import { Injectable, NotFoundException } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CheckoutLinkResponse } from './dto/response/checkout-link-response.dto';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prismaService: PrismaService,
  ) {}
  async getPaymentLink(packageName: string): Promise<CheckoutLinkResponse> {
    const plan = await this.prismaService.plan.findFirst({
      where: {
        name: packageName,
      },
    });
    if (!plan) throw new NotFoundException('Plan not found');
    return await this.stripeService.createPaymentLink({
      priceId: plan.stripePriceId,
      quantity: 1,
    });
  }
}
