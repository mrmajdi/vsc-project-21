import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/user.model';
import { AppError } from '../middleware/error.middleware';
import { sendEmail } from '../utils/email.util';
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from '../config/env.config';

/**
 * AuthService handles core authentication logic:
 * - User registration
 * - User login (access & refresh tokens)
 * - Password reset request
 * - Password reset confirmation
 */
export class AuthService {
  /**
   * Register a new user
   * @param payload - { email, password, name }
   */
  static async register(payload: { email: string; password: string; name: string }) {
    const { email, password, name } = payload;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      id: crypto.randomUUID(),
      email,
      name,
      password: hashedPassword,
      isVerified: false, // email verification can be added later
    });

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store hashed refresh token for rotation/revocation
    const refreshTokenSalt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, refreshTokenSalt);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken, // plain token sent to client only once
    };
  }

  /**
   * Login user and issue tokens
   * @param payload - { email, password }
   */
  static async login(payload: { email: string; password: string }) {
    const { email, password } = payload;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Update stored refresh token hash
    const refreshTokenSalt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, refreshTokenSalt);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken, // plain token sent to client only once
    };
  }

  /**
   * Request password reset: generate token and send email
   * @param email - user's email
   */
  static async requestPasswordReset(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // For security, do not reveal that email doesn't exist
      return { message: 'If the email exists, a reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hour

    // Hash token before storing
    const salt = await bcrypt.genSalt(10);
    const resetTokenHash = await bcrypt.hash(resetToken, salt);
    user.resetToken = resetTokenHash;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    // Construct reset URL (frontend domain from env)
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: 'بازنشانی رمز عبور',
      html: `<p>سلام ${user.name},</p>
             <p>برای بازنشانی رمز عبور خود، روی لینک زیر کلیک کنید:</p>
             <a href="${resetUrl}">بازنشانی رمز عبور</a>
             <p>لینک یک ساعت معتبر است.</p>`,
    });

    return { message: 'If the email exists, a reset link has been sent.' };
  }

  /**
   * Reset password using token
   * @param token - reset token received via email (plain)
   * @param newPassword - new password to set
   */
  static async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({
      where: {
        resetTokenExpires: { [Sequelize.Op.gt]: Date.now() },
      },
    });
    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Compare token hash
    const isMatch = await bcrypt.compare(token, user.resetToken);
    if (!isMatch) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset fields
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    // Invalidate sessions by clearing refresh token hash (optional)
    user.refreshToken = null;
    await user.save();

    return { message: 'Password has been reset successfully.' };
  }

  /**
   * Generate JWT access token
   */
  private static generateAccessToken(user: User) {
    return jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_ACCESS_SECRET,
      { expiresIn: JWT_ACCESS_EXPIRES_IN }
    );
  }

  /**
   * Generate JWT refresh token
   */
  private static generateRefreshToken(user: User) {
    return jwt.sign(
      { sub: user.id, email: user.email },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );
  }
}