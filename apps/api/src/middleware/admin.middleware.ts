import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to restrict route access to admin users only.
 * Assumes that `req.user` is set by an authentication middleware and contains a `role` field.
 */
export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user as { role?: string } | undefined;

  if (!user || user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied: admin only' });
    return;
  }

  next();
};