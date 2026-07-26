import { Router, Request, Response, NextFunction } from 'express';
import { registerController, loginController, logoutController, refreshTokenController, forgotPasswordController, resetPasswordController, getMeController } from '../controllers/auth.controller';
import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from '../validators/auth.validator';
import { authenticate, authorize } from '../middleware/auth.middleware';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

// Auth routes
router.post('/register', registerValidator, asyncHandler(registerController));
router.post('/login', loginValidator, asyncHandler(loginController));
router.post('/logout', authenticate, asyncHandler(logoutController));
router.post('/refresh-token', asyncHandler(refreshTokenController));
router.post('/forgot-password', forgotPasswordValidator, asyncHandler(forgotPasswordController));
router.post('/reset-password', resetPasswordValidator, asyncHandler(resetPasswordController));
router.get('/me', authenticate, asyncHandler(getMeController));

export default router;