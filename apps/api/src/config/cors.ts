import { ConfigService } from '@nestjs/config';

/**
 * CORS configuration for the NestJS API.
 * Allows requests from the Next.js frontend and any additional origins
 * specified via the CORS_ORIGINS environment variable (comma-separated).
 */
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // If no origin (e.g., same-origin requests, curl, etc.), allow it.
    if (!origin) {
      return callback(null, true);
    }

    // Get allowed origins from env, fallback to localhost for development.
    const envOrigins = process.env.CORS_ORIGINS ?? 'http://localhost:3000';
    const allowedOrigins = envOrigins
      .split(',')
      .map(o => o.trim())
      .filter(Boolean);

    // Allow if the origin matches any of the allowed origins (including subpaths).
    const isAllowed = allowedOrigins.some(allowed => origin.startsWith(allowed));
    if (isAllowed) {
      return callback(null, true);
    }

    // Otherwise, reject the request.
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // Allow cookies, authorization headers, etc.
};