import { Request, Response, NextFunction } from 'express';

/**
 * Rate limiter middleware (fixed-window counter).
 * For production with multiple instances, replace the in-memory store with Redis or another shared store.
 */
interface RateLimitOptions {
  /** Window size in milliseconds (default: 60000 = 1 minute) */
  windowMs?: number;
  /** Max number of requests allowed per window (default: 100) */
  max?: number;
  /** Response status code when limit exceeded (default: 429) */
  statusCode?: number;
  /** Custom message to send when limit exceeded (default: 'Too many requests, please try again later.') */
  message?: string;
  /** Function to generate a key for identifying a client (default: IP address) */
  keyGenerator?: (req: Request) => string;
  /** Function to skip rate limiting for certain requests */
  skip?: (req: Request, res: Response) => boolean;
}

/**
 * In-memory store: { key: { count: number, resetTime: number } }
 */
const createRateLimiter = ({
  windowMs = 60_000,
  max = 100,
  statusCode = 429,
  message = 'Too many requests, please try again later.',
  keyGenerator = (req: Request) => req.ip ?? 'anonymous',
  skip,
}: RateLimitOptions = {}) => {
  const store = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    if (skip?.(req, res)) {
      return next();
    }

    const key = keyGenerator(req);
    const now = Date.now();
    const record = store.get(key);

    if (!record) {
      // No record for this key, create a new window
      store.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    // If the current window has expired, reset the counter
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    // Increment count and check limit
    record.count += 1;
    if (record.count > max) {
      // Limit exceeded
      return res.status(statusCode).send({
        error: 'RateLimitExceeded',
        message,
      });
    }

    // Within limit
    return next();
  };
};

export default createRateLimiter;