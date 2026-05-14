import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { stripe } from '../../lib/stripe.js';
import { Decimal } from '@prisma/client/runtime/library';

const STATE_FEE = 125.0;
const SERVICE_FEE = 50.0;

function generateReferenceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LLC-${timestamp}-${random}`;
}

export const submitFormation = async (req: Request, res: Response) => {
  const {
    llcName,
    fein,
    effectiveDate,
    principalOffice,
    sameAsPrincipal,
    mailingAddress,
    registeredAgent,
    managementType,
    membersManagers,
    contactEmail,
    contactPhone,
    paymentIntentId,
  } = req.body;

  let paymentVerified = false;
  let paymentMethod: string | null = null;
  let paymentLast4: string | null = null;

  if (paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          error: 'Payment has not been completed. Please complete payment before submitting.',
        });
      }

      paymentVerified = true;

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
    } catch {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment information. Please try again.',
      });
    }
  }

  const totalFee = STATE_FEE + SERVICE_FEE;

  const formationData = {
    userId: req.user?.id || null,
    contactEmail,
    contactPhone: contactPhone || null,
    llcName,
    fein: fein || null,
    effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
    principalOffice,
    sameAsPrincipal: sameAsPrincipal ?? true,
    mailingAddress: sameAsPrincipal ? null : mailingAddress,
    registeredAgent,
    managementType: managementType || 'MEMBER_MANAGED',
    membersManagers: membersManagers || [],
    stateFee: new Decimal(STATE_FEE),
    serviceFee: new Decimal(SERVICE_FEE),
    totalFee: new Decimal(totalFee),
    stripePaymentIntentId: paymentVerified ? paymentIntentId : null,
    paymentStatus: paymentVerified ? 'SUCCEEDED' as const : 'PENDING' as const,
    status: paymentVerified ? 'PAYMENT_RECEIVED' as const : 'PENDING' as const,
    paidAt: paymentVerified ? new Date() : null,
    paymentMethod,
    paymentLast4,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  };

  let referenceNumber = generateReferenceNumber();
  let attempts = 0;
  while (attempts < 5) {
    const existing = await prisma.lLCFormation.findUnique({ where: { referenceNumber } });
    if (!existing) break;
    referenceNumber = generateReferenceNumber();
    attempts++;
  }

  const formation = await prisma.lLCFormation.create({
    data: { referenceNumber, ...formationData },
    select: {
      id: true,
      referenceNumber: true,
      totalFee: true,
      status: true,
      paymentStatus: true,
      createdAt: true,
    },
  });

  res.status(201).json({
    success: true,
    data: {
      id: formation.id,
      referenceNumber: formation.referenceNumber,
      totalFee: formation.totalFee,
      status: formation.status,
      paymentStatus: formation.paymentStatus,
      message: paymentVerified
        ? 'Your LLC formation request has been submitted and payment received. We will begin processing shortly.'
        : 'Your LLC formation request has been submitted. We will contact you shortly.',
    },
  });
};

export const getFormations = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  const formations = await prisma.lLCFormation.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      referenceNumber: true,
      llcName: true,
      status: true,
      totalFee: true,
      createdAt: true,
    },
  });

  res.json({
    success: true,
    data: { formations },
  });
};

export const getFormation = async (req: Request, res: Response) => {
  const { id } = req.params;

  const formation = await prisma.lLCFormation.findUnique({
    where: { id },
  });

  if (!formation) {
    return res.status(404).json({
      success: false,
      error: 'Formation not found',
    });
  }

  if (req.user && formation.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }

  res.json({
    success: true,
    data: { formation },
  });
};
