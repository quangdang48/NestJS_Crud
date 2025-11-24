import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CheckoutLinkResponse } from './dto/response/checkout-link-response.dto';
import { SUBSCRIPTION_STATUS } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prismaService: PrismaService,
  ) {}
  async getPaymentLink(planId: string): Promise<CheckoutLinkResponse> {
    const plan = await this.prismaService.plan.findFirst({
      where: {
        id: planId,
      },
    });
    if (!plan) throw new NotFoundException('Plan not found');
    return await this.stripeService.createPaymentLink({
      priceId: plan.stripePriceId,
      quantity: 1,
    });
  }
  async createCheckoutSession(
    planId: string,
    customerId: string,
  ): Promise<CheckoutLinkResponse> {
    const currentSubscription = await this.prismaService.subscription.findFirst(
      {
        where: {
          userId: customerId,
          status: SUBSCRIPTION_STATUS.ACTIVE,
        },
      },
    );
    if (currentSubscription)
      throw new BadRequestException(
        'This customer already has an active subscription.',
      );
    const plan = await this.prismaService.plan.findFirst({
      where: { id: planId },
    });
    if (!plan) throw new NotFoundException('Plan not found');
    const user = await this.prismaService.user.findFirst({
      where: {
        id: customerId,
      },
    });
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
    return await this.stripeService.createCheckoutSession({
      priceId: plan.stripePriceId,
      quantity: 1,
      customerId: user.stripeCustomerId,
      metadata: {
        customerId: customerId,
        planId: planId,
      },
    });
  }
}
