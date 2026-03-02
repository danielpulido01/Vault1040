import { Request, Response } from 'express';
import { stripe } from '../../lib/stripe.js';
import { prisma } from '../../lib/prisma.js';
import { config } from '../../config/index.js';
import Stripe from 'stripe';

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhookSecret
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSucceeded(paymentIntent);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailed(paymentIntent);
      break;
    }
    default:
      // Unhandled event type
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);

  // Update any existing filing with this payment intent ID
  const filing = await prisma.annualReportFiling.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (filing) {
    // Get payment method details
    let paymentMethod: string | null = null;
    let paymentLast4: string | null = null;

    if (paymentIntent.payment_method) {
      try {
        const pm = await stripe.paymentMethods.retrieve(
          paymentIntent.payment_method as string
        );
        paymentMethod = pm.type;
        if (pm.card) {
          paymentLast4 = pm.card.last4;
        }
      } catch (err) {
        console.error('Failed to retrieve payment method:', err);
      }
    }

    await prisma.annualReportFiling.update({
      where: { id: filing.id },
      data: {
        paymentStatus: 'SUCCEEDED',
        status: 'PAYMENT_RECEIVED',
        paidAt: new Date(),
        paymentMethod,
        paymentLast4,
      },
    });

    console.log(`Filing ${filing.referenceNumber} marked as paid`);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.error('Payment failed:', paymentIntent.id);
  console.error('Failure message:', paymentIntent.last_payment_error?.message);

  // Update filing payment status if it exists
  const filing = await prisma.annualReportFiling.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (filing) {
    await prisma.annualReportFiling.update({
      where: { id: filing.id },
      data: {
        paymentStatus: 'FAILED',
      },
    });
  }
}
