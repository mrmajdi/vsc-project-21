import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { asyncHandler } from '../middleware/asyncHandler';
import { ValidationError } from '../utils/errors';
import { validateUserUpdate } from '../validation/user.validation';

/**
 * Controller responsible for handling user profile related HTTP requests.
 * All methods are wrapped with asyncHandler to catch and forward errors.
 */
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * GET /api/users/me
   * Returns the authenticated user's profile.
   */
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id; // Assuming auth middleware attaches user
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new ValidationError('User not found');
    }

    // Return sanitized user data (remove password, etc.)
    const sanitized = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      data: sanitized,
    });
  });

  /**
   * PUT /api/users/me
   * Updates the authenticated user's profile.
   * Expects validated body per validateUserUpdate schema.
   */
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    // Validate request body
    const { error, value } = validateUserUpdate(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const updatedUser = await this.userService.update(userId, value);
    if (!updatedUser) {
      throw new ValidationError('User not found or update failed');
    }

    const sanitized = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      updatedAt: updatedUser.updatedAt,
    };

    res.status(200).json({
      success: true,
      data: sanitized,
      message: 'Profile updated successfully',
    });
  });

  /**
   * GET /api/users/:id
   * Admin or public endpoint to fetch a user's public profile.
   * Adjust visibility based on role if needed.
   */
  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.findById(id);
    if (!user) {
      throw new ValidationError('User not found');
    }

    // Return only public fields
    const publicProfile = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      data: publicProfile,
    });
  });
}