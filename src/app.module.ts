import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from '@/modules/user/user.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { PlanModule } from './modules/plan/plan.module';
import { BlogModule } from './modules/blog/blog.module';

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
  ],
})
export class AppModule {}
