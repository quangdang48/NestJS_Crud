import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { StripeModule } from '../stripe/stripe.module';
import { PaymentService } from './payment.service';
import { PlanModule } from '../plan/plan.module';

@Module({
  imports: [StripeModule, PlanModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
