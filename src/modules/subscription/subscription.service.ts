import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { SubscriptionRequestDto } from './dto/request/subscription-request.dto';
import { SUBSCRIPTION_STATUS } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prismaService: PrismaService) {}
  async createFromWebhook(dto: SubscriptionRequestDto) {
    const exists = await this.prismaService.subscription.findFirst({
      where: { stripeSubscriptionId: dto.stripeSubscriptionId },
    });
    if (exists) return exists;

    return this.prismaService.subscription.create({
      data: {
        userId: dto.userId,
        stripeProductId: dto.stripeProductId,
        stripeSubscriptionId: dto.stripeSubscriptionId,
        stripePriceId: dto.stripePriceId,
        status: dto.status,
      },
    });
  }
}
