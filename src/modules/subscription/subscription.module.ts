import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { StripeModule } from '../stripe/stripe.module';
import { UserModule } from '../user/user.module';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [StripeModule, UserModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
