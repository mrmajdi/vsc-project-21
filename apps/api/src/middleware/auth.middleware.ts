import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

/**
 * Middleware to protect routes by verifying JWT.
 * Expects token in Authorization header as Bearer <token>.
 * On success, attaches decoded user payload to req.user and calls next().
 * On failure, responds with 401 Unauthorized.
 */
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Access token missing' });
    return;
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    res.status(401).json({ message: 'Malformed authorization header' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // In production, this should never happen; but we fail safely.
    console.error('JWT_SECRET is not defined');
    res.status(500).json({ message: 'Internal server error' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
    } else if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
    } else {
      res.status(401).json({ message: 'Token verification failed' });
    }
  }
};