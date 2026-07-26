export interface User {
  id: string;
  email: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  role: Role;
  subscription?: Subscription;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  preferences?: UserPreferences;
}

export interface Role {
  id: string;
  name: RoleName;
  description?: string;
  permissions: Permission[];
}

export type RoleName = 'admin' | 'editor' | 'user' | 'guest';

export interface Permission {
  action: string;
  resource: string;
}

export interface Subscription {
  id: string;
  plan: Plan;
  status: SubscriptionStatus;
  startsAt: Date;
  endsAt?: Date;
  trialEndsAt?: Date;
  isActive: boolean;
  paymentMethodId?: string;
}

export interface Plan {
  id: string;
  name: PlanName;
  price: number;
  currency: string;
  interval: BillingInterval;
  features: string[];
  isPopular?: boolean;
}

export type PlanName = 'free' | 'basic' | 'premium' | 'enterprise';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
export type BillingInterval = 'day' | 'week' | 'month' | 'year';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}