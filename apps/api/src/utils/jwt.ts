import { sign, verify, JwtPayload } from 'jsonwebtoken';

/**
 * امضای JWT و تولید توکن
 * @param payload داده‌هایی که داخل توکن قرار می‌گیرند
 * @param expiresIn مدت اعتبار توکن (مثلاً '1h', '7d', یا عدد ثانیه)
 * @returns توکن JWT امضا شده
 */
export function signToken(
  payload: object,
  expiresIn: string | number = '1h'
): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return sign(payload, secret, { expiresIn });
}

/**
 * اعتبارسنجی و decipher کردن توکن JWT
 * @param token توکن JWT دریافتی
 * @returns payload decipher شده یا خطا در صورت نامعتبر بودن
 */
export function verifyToken<T = JwtPayload>(token: string): T {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  try {
    return verify(token, secret) as T;
  } catch (err) {
    // خطا را با پیام واضح‌تر opnieuw پرتاب می‌کنیم
    throw new Error('Invalid or expired token');
  }
}