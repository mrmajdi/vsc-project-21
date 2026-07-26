import { z } from 'zod';

/**
 * Schema for selecting a subscription plan.
 * Includes plan identifier and billing interval.
 */
export const planSelectionSchema = z.object({
  planId: z.string().uuid('Invalid plan ID'),
  interval: z.enum(['monthly', 'yearly']).default('monthly'),
});

/**
 * Schema for activating a subscription after plan selection.
 * May include payment method and optional coupon.
 */
export const subscriptionActivationSchema = z.object({
  planId: z.string().uuid('Invalid plan ID'),
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
  couponCode: z.string().optional().nullable(),
});

/**
 * Type inference for the schemas.
 */
export type PlanSelection = z.infer<typeof planSelectionSchema>;
export type SubscriptionActivation = z.infer<typeof subscriptionActivationSchema>;