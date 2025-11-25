import { BadRequestException, Injectable } from '@nestjs/common';
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
  async createCheckoutSession(data: {
    priceId: string;
    quantity: number;
    customerId: string;
  }): Promise<CheckoutLinkResponse> {
    const successUrl =
      process.env.CHECKOUT_SUCCESS_URL ||
      'http://localhost:3333/payment/success';
    const cancelUrl =
      process.env.CHECKOUT_CANCEL_URL || 'http://localhost:3333/payment/cancel';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: data.customerId,
      line_items: [
        {
          price: data.priceId,
          quantity: data.quantity,
        },
      ],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
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
  async retrieveSubscription(subscriptionId: string) {
    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async updateSubscription(
    subscriptionId: string,
    newPriceId: string,
  ): Promise<Stripe.Subscription> {
    const subscription =
      await this.stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const subscriptionItemId = subscription.items.data[0].id;
    const updatedSubscription = await this.stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: subscriptionItemId,
            price: newPriceId,
          },
        ],
        proration_behavior: 'always_invoice',
      },
    );

    return updatedSubscription;
  }
  async createBillingPortalSession(
    customerId: string,
    configurationId?: string,
  ): Promise<string> {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    const portalConfig: Stripe.BillingPortal.SessionCreateParams = {
      customer: customerId,
      return_url:
        process.env.BILLING_PORTAL_RETURN_URL ||
        'http://localhost:3000/account',
    };
    portalConfig.configuration = configurationId;

    const portalSession =
      await this.stripe.billingPortal.sessions.create(portalConfig);
    return portalSession.url;
  }

  async getActiveSubscription(
    customerId: string,
  ): Promise<Stripe.Subscription> {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (!subscriptions.data || subscriptions.data.length === 0) {
      throw new Error('No active subscription found');
    }

    return subscriptions.data[0];
  }

  async getCustomerInvoices(
    customerId: string,
    limit: number = 10,
  ): Promise<Stripe.Invoice[]> {
    const invoices = await this.stripe.invoices.list({
      customer: customerId,
      limit: Math.min(limit, 100),
    });

    return invoices.data;
  }

  async getCustomerPaymentMethods(
    customerId: string,
  ): Promise<Stripe.PaymentMethod[]> {
    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data;
  }
}
