import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { USER_ROLE } from '@prisma/client';
import { CurrentSubscriptionResponse } from './dto/response/subscription-response.dto';
import { SubscriptionRequestDto } from './dto/request/subscription-request.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async getCurrentSubscriptionOfUser(
    customerId: string,
  ): Promise<CurrentSubscriptionResponse> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: customerId,
        role: USER_ROLE.CUSTOMER,
        isActive: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    if (!user.stripeCustomerId) {
      const savedStripeUser = await this.stripeService.createCustomer({
        email: user.email,
        name: user.firstName + ' ' + user.lastName,
      });
      user.stripeCustomerId = savedStripeUser.id;
      await this.prismaService.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: savedStripeUser.id },
      });
    }
    const subscriptions = await this.stripeService.getCurrentSubOfCustomer({
      customerId: user.stripeCustomerId,
    });
    console.log(subscriptions);
    return CurrentSubscriptionResponse.fromEntity(subscriptions);
  }
  async createFromWebhook(dto: SubscriptionRequestDto) {
    const exists = await this.prismaService.subscription.findFirst({
      where: { stripeSubscriptionId: dto.stripeSubscriptionId },
    });
    if (exists) return exists;

    return this.prismaService.subscription.create({
      data: {
        planId: dto.planId,
        userId: dto.userId,
        startDate: dto.startDate,
        status: dto.status,
        stripeSubscriptionId: dto.stripeSubscriptionId,
      },
    });
  }
}
