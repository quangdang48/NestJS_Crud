import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { CheckoutLinkResponse } from '@/modules/payment/dto/response/checkout-link-response.dto';

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
  async getCurrentSubOfCustomer(data: { customerId: string }) {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: data.customerId,
      status: 'active',
    });
    if (subscriptions.data.length == 0)
      throw new NotFoundException('Not found subscription of this users');
    return subscriptions;
  }
  async createCheckoutSession(data: {
    priceId: string;
    quantity: number;
    customerId: string;
    metadata?: Record<string, any>;
  }): Promise<CheckoutLinkResponse> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: data.priceId,
          quantity: data.quantity,
        },
      ],
      customer: data.customerId,
      metadata: data.metadata,
      success_url:
        process.env.CHECKOUT_SUCCESS_URL ||
        'http://localhost:3333/checkout/success',
      cancel_url:
        process.env.CHECKOUT_CANCEL_URL ||
        'http://localhost:3333/checkout/cancel',
    });

    return {
      id: session.id,
      url: session.url,
    };
  }
  constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
      return event;
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      throw new BadRequestException('Invalid Stripe webhook signature');
    }
  }
}
