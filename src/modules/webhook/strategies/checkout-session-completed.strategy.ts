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

    const stripeSubscriptionId = event.data.object.subscription as string;
    const stripeSubscription =
      await this.stripeService.retrieveSubscription(stripeSubscriptionId);

    const stripeProductId = stripeSubscription.items.data[0].price
      .product as string;
    const stripePriceId = stripeSubscription.items.data[0].price.id;
    const stripeSiId = stripeSubscription.items.data[0].id;

    // Find plan by Stripe IDs
    const plan = await this.prismaService.plan.findFirst({
      where: {
        stripePriceId: stripePriceId,
        stripeProductId: stripeProductId,
        isActive: true,
      },
    });
    if (!plan) {
      throw new Error(
        `Plan with priceId ${stripePriceId} and productId ${stripeProductId} not found`,
      );
    }

    // Create subscription with planId
    const dto = new SubscriptionRequestDto();
    dto.userId = user.id;
    dto.planId = plan.id;
    dto.stripeSubscriptionId = stripeSubscriptionId;
    dto.stripeSiId = stripeSiId;
    dto.status = SUBSCRIPTION_STATUS.ACTIVE;
    const subscription = await this.subscriptionService.createFromWebhook(dto);

    // Create credit tracking for initial subscription
    await this.prismaService.creditTracking.create({
      data: {
        userId: user.id,
        amount: plan.creditLimits,
        currency: stripeSubscription.items.data[0].price.currency || 'usd',
        type: CREDIT_TRACKING_TYPE.INITIAL_SUBSCRIPTION,
        status: 'COMPLETED',
        subscriptionId: subscription.id,
      },
    });
  }
}
