import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import { UserSubscription } from '../entities/user-subscription.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepo: Repository<SubscriptionPlan>,
    @InjectRepository(UserSubscription)
    private readonly userSubRepo: Repository<UserSubscription>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Retrieve all active subscription plans.
   */
  async getPlans(): Promise<SubscriptionPlan[]> {
    return this.planRepo.find({
      where: { isActive: true },
      order: { price: 'ASC' },
    });
  }

  /**
   * Retrieve a single plan by its ID.
   * @throws NotFoundException if plan not found or inactive.
   */
  async getPlanById(planId: string): Promise<SubscriptionPlan> {
    const plan = await this.planRepo.findOne({
      where: { id: planId, isActive: true },
    });
    if (!plan) {
      throw new NotFoundException('اشتراک مورد نظر یافت نشد یا غیرفعال است.');
    }
    return plan;
  }

  /**
   * Activate a subscription for a user.
   * If the user already has an active subscription, it will be replaced.
   * @throws NotFoundException if user or plan not found.
   * @throws BadRequestException if activation fails.
   */
  async activateSubscription(
    userId: string,
    planId: string,
  ): Promise<UserSubscription> {
    // Validate user
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد.');
    }

    // Validate plan
    const plan = await this.getPlanById(planId);

    // Deactivate any existing active subscription for the user
    await this.userSubRepo.update(
      { userId: user.id, isActive: true },
      { isActive: false, endedAt: new Date() },
    );

    // Create new subscription
    const newSub = this.userSubRepo.create({
      userId: user.id,
      planId: plan.id,
      startsAt: new Date(),
      endsAt: this.calculateEndDate(plan.durationInDays),
      isActive: true,
    });

    try {
      return await this.userSubRepo.save(newSub);
    } catch (error) {
      throw new BadRequestException('فعالسازی اشتراک با خطا مواجه شد.');
    }
  }

  /**
   * Helper to compute subscription end date based on plan duration (in days).
   */
  private calculateEndDate(durationInDays: number): Date {
    const end = new Date();
    end.setDate(end.getDate() + durationInDays);
    return end;
  }

  /**
   * Get the current active subscription for a user.
   */
  async getActiveSubscription(userId: string): Promise<UserSubscription | null> {
    return this.userSubRepo.findOne({
      where: { userId: userId, isActive: true },
      relations: ['plan'],
    });
  }
}