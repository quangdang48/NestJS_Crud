import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BillingPortalResponse } from './dto/billing-portal-response.dto';
import { CUSTOMER_PORTAL_TYPE } from '@prisma/client';

@Injectable()
export class PortalService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prismaService: PrismaService,
  ) {}

  async getBillingPortalUrl(
    userId: string,
    billingPortalType: CUSTOMER_PORTAL_TYPE,
  ): Promise<BillingPortalResponse> {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.stripeCustomerId) {
      throw new BadRequestException(
        'User does not have a Stripe customer ID. Please create a subscription first.',
      );
    }
    const configurationId = this.getConfigurationId(billingPortalType);
    const portalUrl = await this.stripeService.createBillingPortalSession(
      user.stripeCustomerId,
      configurationId,
    );

    return BillingPortalResponse.create(portalUrl);
  }
  getConfigurationId(billingPortalType: CUSTOMER_PORTAL_TYPE): string {
    switch (billingPortalType) {
      case CUSTOMER_PORTAL_TYPE.CANCEL_SUBSCRIPTION:
        return process.env.CONFIG_ID_CANCEL_SUBSCRIPTIONS;
      case CUSTOMER_PORTAL_TYPE.INVOICE_HISTORY:
        return process.env.CONFIG_ID_VIEW_HISTORY_INVOICE;
      case CUSTOMER_PORTAL_TYPE.PAYMENT_METHODS:
        return process.env.CONFIG_ID_VIEW_PAYMENT_METHOD;
      default:
        throw new BadRequestException('Invalid billing portal type');
    }
  }
}
