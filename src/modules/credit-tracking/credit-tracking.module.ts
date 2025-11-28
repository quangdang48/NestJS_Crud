import { Module } from '@nestjs/common';
import { CreditTrackingController } from './credit-tracking.controller';
import { CreditTrackingService } from './credit-tracking.service';

@Module({
  controllers: [CreditTrackingController],
  providers: [CreditTrackingService],
  exports: [CreditTrackingService],
})
export class CreditTrackingModule {}
