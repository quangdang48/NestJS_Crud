import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { StripeModule } from '../stripe/stripe.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [StripeModule, SubscriptionModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
