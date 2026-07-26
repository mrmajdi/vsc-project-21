import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class to attach status code to errors thrown in the app.
 */
export class HttpError extends Error {
  public status: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.status = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

/**
 * Centralized error handling middleware.
 * - Logs error details (in production avoid leaking stack traces).
 * - Sends a JSON response with error message and appropriate status code.
 * - If error is not operational (e.g., programming error), returns 500 with generic message.
 */
export const errorMiddleware = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // Default values
  const statusCode = err instanceof HttpError ? err.status : 500;
  const message = err instanceof HttpError && err.isOperational ? err.message : 'خطای داخلی سرور';
  const isOperational = err instanceof HttpError ? err.isOperational : false;

  // Log error for debugging (avoid logging sensitive info in production)
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error Middleware] ${req.method} ${req.originalUrl} - ${err.message}`);
    // In development, also log stack trace
    if (process.env.NODE_ENV === 'development') {
      console.error(err.stack);
    }
  }

  // Send JSON response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    // Include stack only in non-production environments
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};