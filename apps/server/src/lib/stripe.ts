import Stripe from 'stripe';
import { config } from '../config/index.js';

if (!config.stripe.secretKey) {
  console.warn('Warning: STRIPE_SECRET_KEY is not set. Stripe payments will not work.');
}

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});
