import { z } from 'zod';

/**
 * Environment variables schema.
 * All required variables must be present in the runtime environment.
 * Optional variables have sensible defaults.
 */
const EnvSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Server port
  PORT: z.string().default('3000').transform((val) => parseInt(val, 10)),

  // Database connection (SQLite)
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // JWT secret for authentication
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),

  // JWT expiration (e.g., '7d', '24h')
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Bcrypt salt rounds for password hashing
  BCRYPT_SALT_ROUNDS: z.string().default('12').transform((val) => parseInt(val, 10)),

  // File upload limits (in MB)
  MAX_UPLOAD_SIZE_MB: z.string().default('50').transform((val) => parseInt(val, 10)),

  // Base URL for the application (used for generating absolute URLs in emails, etc.)
  APP_URL: z.string().url().optional(),

  // Email provider (e.g., SendGrid, SMTP) – only needed if email features are enabled
  EMAIL_PROVIDER: z.enum(['sendgrid', 'smtp', 'none']).default('none'),
  SENDGRID_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Feature flags
  ENABLE_REGISTRATION: z.string().default('true').transform((val) => val === 'true'),
  ENABLE_PASSWORD_RESET: z.string().default('true').transform((val) => val === 'true'),
});

/**
 * Load and validate environment variables.
 * Throws if validation fails.
 */
export const env = EnvSchema.parse(process.env);

export type Env = z.infer<typeof EnvSchema>;