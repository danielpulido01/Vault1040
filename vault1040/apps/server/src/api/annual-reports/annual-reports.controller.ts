import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { stripe } from '../../lib/stripe.js';
import { Decimal } from '@prisma/client/runtime/library';

// State fees by entity type
const STATE_FEES: Record<string, number> = {
  'profit-corp': 150.0,
  'non-profit-corp': 61.25,
  'llc': 138.75,
  'lp': 500.0,
  'lllp': 500.0,
};

const SERVICE_FEE = 50.0;
const LATE_FEE = 400.0;

function isAfterMay1(): boolean {
  const now = new Date();
  const may1 = new Date(now.getFullYear(), 4, 1);
  return now > may1;
}

function generateReferenceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AR-${timestamp}-${random}`;
}

export const submitFiling = async (req: Request, res: Response) => {
  const {
    documentNumber,
    entityType,
    businessName,
    fein,
    principalOffice,
    mailingAddress,
    registeredAgent,
    officers,
    llcMembers,
    lpPartners,
    contactEmail,
    contactPhone,
    prefillTokenId,
    paymentIntentId,
  } = req.body;

  // Initialize payment tracking
  let paymentVerified = false;
  let paymentMethod: string | null = null;
  let paymentLast4: string | null = null;
  let paymentSource: 'stripe' | 'external' = 'stripe';
  let externalPaymentMethod: string | null = null;

  // Check if this is a pre-confirmed external payment via prefill token
  if (prefillTokenId) {
    const prefillToken = await prisma.prefillToken.findUnique({
      where: { id: prefillTokenId },
    });

    if (prefillToken?.paymentConfirmed) {
      paymentVerified = true;
      paymentSource = 'external';
      externalPaymentMethod = prefillToken.externalPaymentMethod;
      paymentMethod = prefillToken.externalPaymentMethod;
    }
  }

  // If not pre-confirmed, verify Stripe payment
  if (!paymentVerified && paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          error: 'Payment has not been completed. Please complete payment before submitting.',
        });
      }

      paymentVerified = true;
      paymentSource = 'stripe';

      // Get payment method details
      if (paymentIntent.payment_method) {
        try {
          const pm = await stripe.paymentMethods.retrieve(
            paymentIntent.payment_method as string
          );
          paymentMethod = pm.type;
          if (pm.card) {
            paymentLast4 = pm.card.last4;
          }
        } catch {
          // Continue without payment method details
        }
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment information. Please try again.',
      });
    }
  }

  // Calculate fees
  const stateFee = STATE_FEES[entityType] || 0;
  const isLate = isAfterMay1();
  const lateFee = isLate && entityType !== 'non-profit-corp' ? LATE_FEE : 0;
  const totalFee = stateFee + SERVICE_FEE + lateFee;

  // Generate unique reference number
  let referenceNumber = generateReferenceNumber();

  // Ensure uniqueness (retry if collision)
  let attempts = 0;
  while (attempts < 5) {
    const existing = await prisma.annualReportFiling.findUnique({
      where: { referenceNumber },
    });
    if (!existing) break;
    referenceNumber = generateReferenceNumber();
    attempts++;
  }

  const filing = await prisma.annualReportFiling.create({
    data: {
      referenceNumber,
      userId: req.user?.id || null,
      contactEmail,
      contactPhone,
      documentNumber,
      entityType,
      businessName,
      fein,
      principalOffice,
      mailingAddress,
      registeredAgent,
      officers: officers || [],
      llcMembers: llcMembers || [],
      lpPartners: lpPartners || [],
      stateFee: new Decimal(stateFee),
      serviceFee: new Decimal(SERVICE_FEE),
      lateFee: new Decimal(lateFee),
      totalFee: new Decimal(totalFee),
      // Payment fields
      stripePaymentIntentId: paymentSource === 'stripe' ? paymentIntentId : null,
      paymentStatus: paymentVerified ? 'SUCCEEDED' : 'PENDING',
      status: paymentVerified ? 'PAYMENT_RECEIVED' : 'PENDING',
      paidAt: paymentVerified ? new Date() : null,
      paymentMethod,
      paymentLast4,
      // Payment source tracking
      paymentSource,
      externalPaymentMethod,
      // Metadata
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    },
    select: {
      id: true,
      referenceNumber: true,
      totalFee: true,
      status: true,
      paymentStatus: true,
      createdAt: true,
    },
  });

  // Mark prefill token as submitted if used
  if (prefillTokenId) {
    await prisma.prefillToken.update({
      where: { id: prefillTokenId },
      data: { submittedAt: new Date() },
    }).catch(() => {
      // Ignore errors if token doesn't exist
    });
  }

  // TODO: Send confirmation email to contactEmail
  // TODO: Send notification email to admin

  res.status(201).json({
    success: true,
    data: {
      id: filing.id,
      referenceNumber: filing.referenceNumber,
      totalFee: filing.totalFee,
      status: filing.status,
      paymentStatus: filing.paymentStatus,
      message: paymentVerified
        ? 'Your annual report filing has been submitted and payment received. We will begin processing shortly.'
        : 'Your annual report filing request has been submitted. We will contact you shortly.',
    },
  });
};

export const getFilings = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  const filings = await prisma.annualReportFiling.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      referenceNumber: true,
      businessName: true,
      entityType: true,
      status: true,
      totalFee: true,
      createdAt: true,
    },
  });

  res.json({
    success: true,
    data: { filings },
  });
};

export const getFiling = async (req: Request, res: Response) => {
  const { id } = req.params;

  const filing = await prisma.annualReportFiling.findUnique({
    where: { id },
  });

  if (!filing) {
    return res.status(404).json({
      success: false,
      error: 'Filing not found',
    });
  }

  // Check ownership if user is authenticated
  if (req.user && filing.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }

  res.json({
    success: true,
    data: { filing },
  });
};
