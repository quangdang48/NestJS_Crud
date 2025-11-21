import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { StripeModule } from '../stripe/stripe.module';
import { CheckoutService } from './checkout.service';
import { PlanModule } from '../plan/plan.module';

@Module({
  imports: [StripeModule, PlanModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
