import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    StripeModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
