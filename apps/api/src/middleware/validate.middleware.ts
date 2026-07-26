import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Shape of validation schema for different parts of the request.
 */
interface ValidationSource {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
}

/**
 * Generic middleware to validate request body, query, or params against Zod schemas.
 * @param schema - Object containing optional Zod schemas for body, query, and params.
 * @returns Express middleware function.
 */
export const validate = (schema: ValidationSource) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body if schema provided
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      // Validate query if schema provided
      if (schema.query) {
        // req.query is of type {[key: string]: string | string[] | undefined}
        // Zod will parse it accordingly.
        req.query = schema.query.parse(req.query);
      }

      // Validate params if schema provided
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      // If all validations pass, continue to next middleware/handler
      next();
    } catch (err) {
      // Handle Zod validation errors
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: err.errors.map((error) => ({
            // Join path segments into a dot‑separated string (e.g., "user.email")
            path: error.path.join('.'),
            message: error.message,
          })),
        });
      }

      // Pass any other errors to the error‑handling middleware
      next(err);
    }
  };
};