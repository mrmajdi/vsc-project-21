export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

/**
 * طرح‌های اشتراک موجود در سامانه
 */
export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'رایگان',
    price: 0,
    currency: 'USD',
    features: [
      'دسترسی محدود به کتابخانه',
      '.streaming با کیفیت استاندارد',
      'بدون امکان دانلود',
    ],
  },
  {
    id: 'basic',
    name: 'اساسی',
    price: 9.99,
    currency: 'USD',
    features: [
      'دسترسی کامل به کتابخانه',
      '.streaming با کیفیت HD',
      'امکان دانلود برای ۲ دستگاه',
      'بدون تبلیغات',
    ],
  },
  {
    id: 'premium',
    name: 'پریمیوم',
    price: 19.99,
    currency: 'USD',
    features: [
      'دسترسی کامل به کتابخانه',
      '.streaming با کیفیت 4K HDR',
      'امکان دانلود نامحدود',
      'بدون تبلیغات',
      'پشتیبانی اولویت',
      'دسترسی به محتوای ویژه',
    ],
  },
];

/**
 * نقش‌های کاربری
 */
export const USER_ROLES = [
  { id: 'admin', label: 'ادمین' },
  { id: 'user', label: 'کاربر عادی' },
];

/**
 * وضعیت‌های اشتراک
 */
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELED: 'canceled',
  PAST_DUE: 'past_due',
  TRIALING: 'trialing',
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
};

/**
 * حداکثر تعداد آیتم در لیست‌های صفحه‌بندی
 */
export const PAGE_SIZE = 10;