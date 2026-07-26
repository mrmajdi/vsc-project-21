import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('ایمیل نامعتبر است'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد').max(50, 'نام حداکثر ۵۰ کاراکتر می‌تواند باشد'),
  email: z.string().email('ایمیل نامعتبر است'),
  password: z.string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .regex(/[a-z]/, 'رمز عبور باید حاوی حداقل یک حرف کوچک باشد')
    .regex(/[A-Z]/, 'رمز عبور باید حاوی حداقل یک حرف بزرگ باشد')
    .regex(/\d/, 'رمز عبور باید حاوی حداقل یک عدد باشد')
    .regex(/[^a-zA-Z\d]/, 'رمز عبور باید حاوی حداقل یک علامت خاص باشد'),
  // Optional: confirm password
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'رمز عبور و تکرار آن مطابقت ندارند',
  path: ['confirmPassword'],
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email('ایمیل نامعتبر است'),
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, 'توکن لازم است'),
  password: z.string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .regex(/[a-z]/, 'رمز عبور باید حاوی حداقل یک حرف کوچک باشد')
    .regex(/[A-Z]/, 'رمز عبور باید حاوی حداقل یک حرف بزرگ باشد')
    .regex(/\d/, 'رمز عبور باید حاوی حداقل یک عدد باشد')
    .regex(/[^a-zA-Z\d]/, 'رمز عبور باید حاوی حداقل یک علامت خاص باشد'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'رمز عبور و تکرار آن مطابقت ندارند',
  path: ['confirmPassword'],
});