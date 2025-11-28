import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { SubscriptionRequestDto } from './dto/request/subscription-request.dto';
import { SUBSCRIPTION_STATUS } from '@prisma/client';
import { SubscriptionResponseDto } from './dto/response/subscription-response.dto';
import { UpdateSubscriptionRequestDto } from './dto/request/update-subscription-request.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async createFromWebhook(dto: SubscriptionRequestDto) {
    const exists = await this.prismaService.subscription.findFirst({
      where: { stripeSubscriptionId: dto.stripeSubscriptionId },
    });
    if (exists) return exists;

    return this.prismaService.subscription.create({
      data: {
        userId: dto.userId,
        planId: dto.planId,
        stripeSiId: dto.stripeSiId,
        stripeSubscriptionId: dto.stripeSubscriptionId,
        status: dto.status,
      },
    });
  }

  async getActiveSubscription(
    userId: string,
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.prismaService.subscription.findFirst({
      where: {
        userId: userId,
        status: SUBSCRIPTION_STATUS.ACTIVE,
      },
    });

    if (!subscription) {
      throw new NotFoundException('No active subscription found for this user');
    }
    const plan = await this.prismaService.plan.findFirst({
      where: {
        id: subscription.planId,
        isActive: true,
      },
    });

    return SubscriptionResponseDto.fromEntity(subscription, plan);
  }

  async updateSubscription(
    userId: string,
    updateDto: UpdateSubscriptionRequestDto,
  ): Promise<SubscriptionResponseDto> {
    const currentSubscription = await this.prismaService.subscription.findFirst(
      {
        where: {
          userId: userId,
          status: SUBSCRIPTION_STATUS.ACTIVE,
        },
      },
    );

    if (!currentSubscription) {
      throw new NotFoundException('No active subscription found');
    }

    const newPlan = await this.prismaService.plan.findFirst({
      where: {
        id: updateDto.newPlanId,
        isActive: true,
      },
    });

    if (!newPlan) {
      throw new NotFoundException('Plan not found');
    }

    const currentPlan = await this.prismaService.plan.findFirst({
      where: {
        id: currentSubscription.planId,
        isActive: true,
      },
    });

    if (!currentPlan) {
      throw new NotFoundException('Current plan not found');
    }

    if (currentPlan.id === newPlan.id) {
      throw new BadRequestException(
        'Cannot update to the same plan. Please choose a different plan.',
      );
    }

    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
    });

    if (!user || !user.stripeCustomerId) {
      throw new NotFoundException('User or Stripe customer ID not found');
    }

    try {
      await this.stripeService.updateSubscription(
        currentSubscription.stripeSubscriptionId,
        newPlan.stripePriceId,
      );

      // Database will be updated via webhook event (customer.subscription.updated)
      // For now, return the new plan info
      return SubscriptionResponseDto.fromEntity(currentSubscription, newPlan);
    } catch (error) {
      throw new BadRequestException(
        `Failed to update subscription: ${error.message}`,
      );
    }
  }
}
