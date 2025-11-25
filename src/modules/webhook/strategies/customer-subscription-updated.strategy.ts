import { Injectable } from '@nestjs/common';
import { WebhookStrategy } from '../interfaces/webhook-strategy.interface';
import { StripeService } from 'src/modules/stripe/stripe.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CREDIT_TRACKING_TYPE } from '@prisma/client';

@Injectable()
export class CustomerSubscriptionUpdatedStrategy implements WebhookStrategy {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prismaService: PrismaService,
  ) {}

  canHandle(eventType: string): boolean {
    return eventType === 'customer.subscription.updated';
  }

  async handle(event: any): Promise<void> {
    try {
      if (!event?.data?.object?.id) {
        throw new Error('Invalid event: missing subscription id');
      }

      const stripeSubscriptionId = event.data.object.id as string;

      const subscription = await this.prismaService.subscription.findFirst({
        where: { stripeSubscriptionId },
      });

      if (!subscription) {
        throw new Error(`Subscription ${stripeSubscriptionId} not found`);
      }

      const stripeSubscription =
        await this.stripeService.retrieveSubscription(stripeSubscriptionId);

      if (!stripeSubscription) {
        throw new Error(
          `Stripe subscription ${stripeSubscriptionId} not found`,
        );
      }

      if (!stripeSubscription.items?.data?.[0]?.price?.product) {
        throw new Error('Invalid subscription: missing product information');
      }

      const newProductId = stripeSubscription.items.data[0].price
        .product as string;
      const newPriceId = stripeSubscription.items.data[0].price.id;

      const updatedSubscription = await this.prismaService.subscription.update({
        where: { id: subscription.id },
        data: {
          stripeProductId: newProductId,
          stripePriceId: newPriceId,
        },
      });

      const newPlan = await this.prismaService.plan.findFirst({
        where: {
          stripeProductId: updatedSubscription.stripeProductId,
          stripePriceId: updatedSubscription.stripePriceId as string,
          isActive: true,
        },
      });

      if (!newPlan) {
        throw new Error(
          `Plan with productId ${newProductId} and priceId ${newPriceId} not found`,
        );
      }

      await this.prismaService.creditTracking.create({
        data: {
          userId: subscription.userId,
          amount: stripeSubscription.items.data[0].price.unit_amount
            ? stripeSubscription.items.data[0].price.unit_amount / 100
            : 0,
          currentCredit: newPlan.creditLimits,
          currency: stripeSubscription.items.data[0].price.currency,
          type: CREDIT_TRACKING_TYPE.INCREASE,
          subscriptionId: stripeSubscriptionId,
        },
      });

      console.log(
        `Subscription ${stripeSubscriptionId} updated successfully with plan ${newPlan.name}`,
      );
    } catch (error) {
      console.error(
        'Error handling customer.subscription.updated event:',
        error.message,
      );
      throw error;
    }
  }
}
