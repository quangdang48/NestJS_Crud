import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CheckoutLinkResponse } from './dto/response/checkout-link-response.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly checkoutService: PaymentService) {}

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
    if (!sessionId) {
      return { message: 'Payment success!', sessionId: null };
    }
    return { message: 'Payment success!', sessionId };
  }

  @Get('cancel')
  cancel() {
    return { message: 'Payment cancelled!' };
  }
}
