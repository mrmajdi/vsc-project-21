import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionService } from '../services/subscription.service';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dtos/update-subscription.dto';

@ApiTags('subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto, @Request() req) {
    const userId = req.user.userId;
    const subscription = await this.subscriptionService.create(userId, createSubscriptionDto);
    return { success: true, data: subscription };
  }

  @Get()
  @ApiOperation({ summary: 'Get current user subscription' })
  @ApiResponse({ status: 200, description: 'Return the subscription.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  async findOne(@Request() req) {
    const userId = req.user.userId;
    const subscription = await this.subscriptionService.findByUserId(userId);
    if (!subscription) {
      return { success: false, message: 'Subscription not found' };
    }
    return { success: true, data: subscription };
  }

  @Put()
  @ApiOperation({ summary: 'Update subscription' })
  @ApiResponse({ status: 200, description: 'Subscription updated.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async update(@Body() updateSubscriptionDto: UpdateSubscriptionDto, @Request() req) {
    const userId = req.user.userId;
    const updated = await this.subscriptionService.update(userId, updateSubscriptionDto);
    return { success: true, data: updated };
  }

  @Delete()
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled.' })
  async remove(@Request() req) {
    const userId = req.user.userId;
    await this.subscriptionService.remove(userId);
    return { success: true, message: 'Subscription cancelled' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Return subscription.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  async findById(@Param('id') id: string) {
    const subscription = await this.subscriptionService.findById(id);
    if (!subscription) {
      return { success: false, message: 'Subscription not found' };
    }
    return { success: true, data: subscription };
  }
}