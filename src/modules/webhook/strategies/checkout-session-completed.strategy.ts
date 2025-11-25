import { Injectable } from '@nestjs/common';
import { WebhookStrategy } from '../interfaces/webhook-strategy.interface';
import { SubscriptionService } from 'src/modules/subscription/subscription.service';
import { SubscriptionRequestDto } from 'src/modules/subscription/dto/request/subscription-request.dto';
import { CREDIT_TRACKING_TYPE, SUBSCRIPTION_STATUS } from '@prisma/client';
import { StripeService } from 'src/modules/stripe/stripe.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckoutSessionCompletedStrategy implements WebhookStrategy {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly stripeService: StripeService,
    private readonly prismaService: PrismaService,
  ) {}

  canHandle(eventType: string): boolean {
    return eventType === 'checkout.session.completed';
  }

  async handle(event: any): Promise<void> {
    const stripeCustomerId = event.data.object.customer as string;
    const user = await this.prismaService.user.findFirst({
      where: { stripeCustomerId: stripeCustomerId, isActive: true },
    });
    if (!user) {
      throw new Error(
        `User with stripeCustomerId ${stripeCustomerId} not found`,
      );
    }

    const dto = new SubscriptionRequestDto();
    dto.userId = user.id;
    dto.stripeSubscriptionId = event.data.object.subscription as string;
    dto.status = SUBSCRIPTION_STATUS.ACTIVE;
    const stripeSubscription = await this.stripeService.retrieveSubscription(
      dto.stripeSubscriptionId,
    );
    dto.stripeProductId = stripeSubscription.items.data[0].price
      .product as string;
    dto.stripePriceId = stripeSubscription.items.data[0].price.id;
    await this.subscriptionService.createFromWebhook(dto);

    const plan = await this.prismaService.plan.findFirst({
      where: {
        stripePriceId: dto.stripePriceId,
        stripeProductId: dto.stripeProductId,
      },
    });
    if (!plan) {
      throw new Error(
        `Plan with priceId ${dto.stripePriceId} and productId ${dto.stripeProductId} not found`,
      );
    }
    await this.prismaService.creditTracking.create({
      data: {
        userId: user.id,
        amount: stripeSubscription.items.data[0].price.unit_amount
          ? stripeSubscription.items.data[0].price.unit_amount / 100
          : 0,
        currentCredit: plan.creditLimits,
        currency: stripeSubscription.items.data[0].price.currency,
        type: CREDIT_TRACKING_TYPE.INCREASE,
        subscriptionId: dto.stripeSubscriptionId,
      },
    });
  }
}
