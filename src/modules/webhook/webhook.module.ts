import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { StripeModule } from '../stripe/stripe.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { SubscriptionService } from '../subscription/subscription.service';
import { CheckoutSessionCompletedStrategy } from './strategies/checkout-session-completed.strategy';
import { CustomerSubscriptionUpdatedStrategy } from './strategies/customer-subscription-updated.strategy';
import { WebhookHandler } from './webhook-handler.service';
import { WEBHOOK_STRATEGIES } from './constants/webhook.constants';

@Module({
  imports: [StripeModule, SubscriptionModule],
  controllers: [WebhookController],
  providers: [
    SubscriptionService,
    CheckoutSessionCompletedStrategy,
    CustomerSubscriptionUpdatedStrategy,
    {
      provide: WEBHOOK_STRATEGIES,
      useFactory: (
        checkoutStrategy: CheckoutSessionCompletedStrategy,
        updateStrategy: CustomerSubscriptionUpdatedStrategy,
      ) => [checkoutStrategy, updateStrategy],
      inject: [
        CheckoutSessionCompletedStrategy,
        CustomerSubscriptionUpdatedStrategy,
      ],
    },
    WebhookHandler,
    WebhookService,
  ],
  exports: [WebhookService],
})
export class WebhookModule {}
