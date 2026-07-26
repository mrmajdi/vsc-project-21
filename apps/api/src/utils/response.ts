import { Response } from 'express';

/**
 * Standardized success response helper.
 * @param res Express Response object
 * @param data Payload to send (can be any JSON-serializable value)
 * @param message Optional human-readable message
 * @param statusCode HTTP status code (defaults to 200)
 */
export function successResponse<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response {
  const payload: any = {
    success: true,
    ...(message !== undefined && { message }),
    data,
  };
  return res.status(statusCode).json(payload);
}

/**
 * Standardized error response helper.
 * @param res Express Response object
 * @param message Human-readable error message
 * @param statusCode HTTP status code (defaults to 500)
 * @param errors Optional array or object with validation/detailed errors
 */
export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: any
): Response {
  const payload: any = {
    success: false,
    message,
    ...(errors !== undefined && { errors }),
  };
  return res.status(statusCode).json(payload);
}

/**
 * Helper for validation errors (422).
 */
export function validationErrorResponse(
  res: Response,
  message: string = 'Validation failed',
  errors: any = {}
): Response {
  return errorResponse(res, message, 422, errors);
}

/**
 * Helper for not found errors (404).
 */
export function notFoundResponse(
  res: Response,
  message: string = 'Resource not found'
): Response {
  return errorResponse(res, message, 404);
}

/**
 * Helper for unauthorized errors (401).
 */
export function unauthorizedResponse(
  res: Response,
  message: string = 'Unauthorized'
): Response {
  return errorResponse(res, message, 401);
}

/**
 * Helper for forbidden errors (403).
 */
export function forbiddenResponse(
  res: Response,
  message: string = 'Forbidden'
): Response {
  return errorResponse(res, message, 403);
}