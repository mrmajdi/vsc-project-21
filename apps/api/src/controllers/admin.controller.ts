import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from '../services/admin.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ToggleUserStatusDto } from '../dto/toggle-user-status.dto';

/**
 * Admin controller for managing dashboard statistics and administrative operations.
 * Only accessible by users with the 'admin' role.
 */
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Retrieve overall dashboard statistics.
   * @returns Object containing stats like total users, active subscriptions, etc.
   */
  @Get('stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  /**
   * Get a paginated list of users.
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @param search - Optional search term for username or email
   * @returns Paginated user list.
   */
  @Get('users')
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers({ page, limit, search });
  }

  /**
   * Update a user's information.
   * @param userId - ID of the user to update
   * @param updateUserDto - DTO containing fields to update
   * @returns Updated user object.
   */
  @Put('users/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.adminService.updateUser(userId, updateUserDto);
  }

  /**
   * Toggle a user's active status (activate/deactivate).
   * @param userId - ID of the user
   * @param toggleUserStatusDto - DTO containing the desired active status
   * @returns Updated user object.
   */
  @Patch('users/:userId/status')
  async toggleUserStatus(
    @Param('userId') userId: string,
    @Body() toggleUserStatusDto: ToggleUserStatusDto,
  ) {
    return this.adminService.toggleUserStatus(userId, toggleUserStatusDto.isActive);
  }

  /**
   * Delete a user (soft delete or hard delete based on implementation).
   * @param userId - ID of the user to delete
   * @returns Confirmation message.
   */
  @Delete('users/:userId')
  async deleteUser(@Param('userId') userId: string) {
    await this.adminService.deleteUser(userId);
    return { message: 'User deleted successfully' };
  }

  /**
   * Get content-related statistics (movies, series, episodes).
   * @returns Object with content stats.
   */
  @Get('content/stats')
  async getContentStats() {
    return this.adminService.getContentStats();
  }

  /**
   * Get subscription statistics and revenue overview.
   * @returns Subscription stats.
   */
  @Get('subscription/stats')
  async getSubscriptionStats() {
    return this.adminService.getSubscriptionStats();
  }
}