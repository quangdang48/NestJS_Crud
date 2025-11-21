import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CheckoutLinkResponse } from '../checkout/dto/response/checkout-link-response.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createCustomer(customer: { email: string; name: string }) {
    return await this.stripe.customers.create({
      email: customer.email,
      name: customer.name,
    });
  }
  async createPaymentLink(data: {
    priceId: string;
    quantity: number;
  }): Promise<CheckoutLinkResponse> {
    const paymentLink = await this.stripe.paymentLinks.create({
      line_items: [
        {
          price: data.priceId,
          quantity: data.quantity,
        },
      ],
    });
    return {
      url: paymentLink.url,
      id: paymentLink.id,
    };
  }
}
