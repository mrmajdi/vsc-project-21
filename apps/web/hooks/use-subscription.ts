import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SubscriptionPlan, UserSubscription } from '@/types/subscription';

// Mock API functions (replace with real API calls in production)
const fetchPlans = async (): Promise<SubscriptionPlan[]> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  // Mock data
  return [
    { id: 'basic', name: 'پلن پایه', price: 9.99, currency: 'USD', features: ['.streaming SD', 'یک دستگاه'] },
    { id: 'standard', name: 'پلن استاندارد', price: 14.99, currency: 'USD', features: ['.streaming HD', 'دو دستگاه'] },
    { id: 'premium', name: 'پلن پرمیوم', price: 19.99, currency: 'USD', features: ['.streaming UHD', 'چهار دستگاه', 'دانلود آفلاین'] },
  ];
};

const fetchUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  await new Promise(res => setTimeout(res, 500));
  // Mock: return a subscription for demo
  if (userId === 'demo-user') {
    return {
      id: 'sub_123',
      userId,
      planId: 'standard',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
    };
  }
  return null;
};

const subscribe = async (planId: string): Promise<UserSubscription> => {
  await new Promise(res => setTimeout(res, 800));
  // Mock response
  return {
    id: `sub_${Math.random().toString(36).substr(2, 9)}`,
    userId: 'demo-user', // In real app, get from auth context
    planId,
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
  };
};

const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  await new Promise(res => setTimeout(res, 600));
  // Mock: just resolve
};

export const usePlans = () => {
  return useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: fetchPlans,
    staleTime: 1000 * 60 * 5, // 5 minutes
    // SSR: keep data on server if needed
  });
};

export const useUserSubscription = (userId: string) => {
  return useQuery({
    queryKey: ['subscription', 'user', userId],
    queryFn: () => fetchUserSubscription(userId),
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useSubscribe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscribe,
    onSuccess: (data) => {
      // Invalidate and refetch user subscription
      queryClient.invalidateQueries({ queryKey: ['subscription', 'user', data.userId] });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: (_, variables) => {
      // Assuming we have userId somewhere; for simplicity invalidate all user subscriptions
      queryClient.invalidateQueries({ queryKey: ['subscription', 'user'] });
    },
  });
};