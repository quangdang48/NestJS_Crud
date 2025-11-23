import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutLinkResponse } from './dto/response/checkout-link-response.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}
  @Get('checkout-session/:planId')
  @UseGuards(AuthGuard)
  async createCheckoutSession(
    @Param('planId') planId: string,
    @Req() req: Request,
  ): Promise<CheckoutLinkResponse> {
    const userId = req.user.userId;
    return this.checkoutService.createCheckoutSession(planId, userId);
  }
  @Get('success')
  success(@Query('session_id') sessionId: string) {
    return `Payment success! Session ID: ${sessionId}`;
  }

  @Get('cancel')
  cancel() {
    return 'Payment cancelled!';
  }
}
