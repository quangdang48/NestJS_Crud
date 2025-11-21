import { Controller, Get, Query } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutLinkResponse } from './dto/response/checkout-link-response.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}
  @Get('/link')
  async getPaymentLink(
    @Query('packageName') packageName: string,
  ): Promise<CheckoutLinkResponse> {
    return await this.checkoutService.getPaymentLink(packageName);
  }
}
