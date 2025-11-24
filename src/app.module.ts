import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from '@/modules/user/user.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { PlanModule } from './modules/plan/plan.module';
import { BlogModule } from '@/modules/blog/blog.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { PaymentModule } from '@/modules/payment/payment.module';
import { WebhookModule } from '@/modules/webhook/webhook.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    StripeModule,
    BlogModule,
    UserModule,
    PlanModule,
    PaymentModule,
    SubscriptionModule,
    WebhookModule,
  ],
})
export class AppModule {}
