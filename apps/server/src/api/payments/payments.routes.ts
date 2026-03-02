import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { optionalAuthMiddleware } from '../../middleware/auth.middleware.js';
import * as paymentsController from './payments.controller.js';
import { handleWebhook } from './payments.webhook.js';

const router = Router();

// Get Stripe publishable key (public)
router.get(
  '/config',
  asyncHandler(paymentsController.getStripePublishableKey)
);

// Create PaymentIntent for annual report filing
router.post(
  '/create-payment-intent',
  optionalAuthMiddleware,
  asyncHandler(paymentsController.createPaymentIntent)
);

// Get PaymentIntent status
router.get(
  '/payment-intent/:id',
  asyncHandler(paymentsController.getPaymentIntent)
);

// Stripe webhook (raw body handled in app.ts)
router.post(
  '/webhook',
  asyncHandler(handleWebhook)
);

export default router;
