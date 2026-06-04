import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100); // Convert dollars to cents
};
