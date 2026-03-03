import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Warning: VITE_STRIPE_PUBLISHABLE_KEY is not set. Stripe payments will not work.');
}

export const stripePromise = loadStripe(stripePublishableKey || '');
