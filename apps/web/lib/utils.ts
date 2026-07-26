import { ClassValue } from 'clsx';

/**
 * Merge class names conditionally.
 * Works similarly to clsx but returns a string.
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Format a date using Intl.DateTimeFormat.
 * @param date - Date object or ISO string.
 * @param options - Optional Intl.DateTimeFormatOptions.
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(undefined, options).format(d);
}

/**
 * Format a number using Intl.NumberFormat.
 * @param num - Number to format.
 * @param options - Optional Intl.NumberFormatOptions.
 */
export function formatNumber(
  num: number,
  options: Intl.NumberFormatOptions = { style: 'decimal' }
): string {
  return new Intl.NumberFormat(undefined, options).format(num);
}

/**
 * Truncate a string to a given length and add a suffix.
 * @param str - Input string.
 * @param length - Maximum length before truncation.
 * @param suffix - String to append when truncated (default: '...').
 */
export function truncate(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Capitalize the first letter of a string.
 * @param str - Input string.
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Debounce a function.
 * @param fn - Function to debounce.
 * @param wait - Delay in milliseconds.
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => ReturnType<T> {
  let timeout: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  } as any;
}

/**
 * Throttle a function.
 * @param fn - Function to throttle.
 * @param limit - Minimum interval in milliseconds.
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => ReturnType<T> {
  let lastCall = 0;
  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  } as any;
}