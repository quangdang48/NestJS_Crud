import { Controller, Get, Param } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get(':customerId')
  async getCurrentSubscription(@Param('customerId') customerId: string) {
    return this.subscriptionService.getCurrentSubscriptionOfUser(customerId);
  }
}
