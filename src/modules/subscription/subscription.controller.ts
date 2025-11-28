import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { SubscriptionResponseDto } from './dto/response/subscription-response.dto';
import { UpdateSubscriptionRequestDto } from './dto/request/update-subscription-request.dto';
import { Request } from 'express';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @UseGuards(AuthGuard)
  getActiveSubscription(@Req() req: Request): Promise<SubscriptionResponseDto> {
    const userId = req.user.userId;
    return this.subscriptionService.getActiveSubscription(userId);
  }

  @Patch()
  @UseGuards(AuthGuard)
  updateSubscription(
    @Req() req: Request,
    @Body() updateDto: UpdateSubscriptionRequestDto,
  ): Promise<SubscriptionResponseDto> {
    const userId = req.user.userId;
    return this.subscriptionService.updateSubscription(userId, updateDto);
  }
}
