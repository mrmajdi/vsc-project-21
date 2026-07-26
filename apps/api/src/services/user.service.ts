import { User } from '../models/user.model';
import { AppError } from '../middleware/error.middleware';

/**
 * Service for user profile operations.
 */
export class UserService {
  /**
   * Retrieve a user's profile by ID.
   * @param userId - The unique identifier of the user.
   * @returns The user profile without sensitive fields.
   * @throws AppError if user not found.
   */
  static async getProfile(userId: string): Promise<Omit<User, 'password' | 'resetToken' | 'resetTokenExpiry' | 'refreshToken'>> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    // Return a plain object excluding sensitive fields
    const {
      password,
      resetToken,
      resetTokenExpiry,
      refreshToken,
      ...profile
    } = user.get ? user.get() : user;
    return profile;
  }

  /**
   * Update a user's profile.
   * @param userId - The unique identifier of the user.
   * @param data - Partial user data to update (e.g., name, email, bio, avatarUrl).
   * @returns The updated user profile without sensitive fields.
   * @throws AppError if user not found or email already in use.
   */
  static async updateProfile(
    userId: string,
    data: {
      name?: string;
      email?: string;
      bio?: string;
      avatarUrl?: string;
      // Add other updatable fields as needed
    }
  ): Promise<Omit<User, 'password' | 'resetToken' | 'resetTokenExpiry' | 'refreshToken'>> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // If email is being updated, ensure it's unique
    if (data.email && data.email !== user.email) {
      const existing = await User.findOne({ where: { email: data.email } });
      if (existing) {
        throw new AppError('Email already in use', 409);
      }
    }

    // Update allowed fields
    await user.update(data, {
      fields: Object.keys(data) as (keyof User)[],
    });

    // Fetch fresh instance to return updated data
    const updatedUser = await User.findByPk(userId);
    if (!updatedUser) {
      throw new AppError('User not found after update', 500);
    }

    const {
      password,
      resetToken,
      resetTokenExpiry,
      refreshToken,
      ...profile
    } = updatedUser.get ? updatedUser.get() : updatedUser;
    return profile;
  }
}