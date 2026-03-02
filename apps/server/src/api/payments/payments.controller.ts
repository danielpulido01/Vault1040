import { Request, Response } from 'express';
import { stripe } from '../../lib/stripe.js';
import { config } from '../../config/index.js';

// State fees by entity type (same as annual-reports controller)
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

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { entityType, businessName, documentNumber, contactEmail } = req.body;

  // Calculate fees
  const stateFee = STATE_FEES[entityType] || 0;
  const isLate = isAfterMay1();
  const lateFee = isLate && entityType !== 'non-profit-corp' ? LATE_FEE : 0;
  const totalFee = stateFee + SERVICE_FEE + lateFee;

  // Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalFee * 100), // Stripe uses cents
    currency: 'usd',
    metadata: {
      entityType,
      businessName,
      documentNumber,
      contactEmail,
      stateFee: stateFee.toString(),
      serviceFee: SERVICE_FEE.toString(),
      lateFee: lateFee.toString(),
      totalFee: totalFee.toString(),
    },
    receipt_email: contactEmail,
    description: `Florida Annual Report Filing - ${businessName}`,
  });

  res.json({
    success: true,
    data: {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      fees: {
        stateFee,
        serviceFee: SERVICE_FEE,
        lateFee,
        totalFee,
      },
    },
  });
};

export const getPaymentIntent = async (req: Request, res: Response) => {
  const { id } = req.params;

  const paymentIntent = await stripe.paymentIntents.retrieve(id);

  res.json({
    success: true,
    data: {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      metadata: paymentIntent.metadata,
    },
  });
};

export const getStripePublishableKey = async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      publishableKey: config.stripe.publishableKey,
    },
  });
};
