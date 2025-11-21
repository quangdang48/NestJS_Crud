import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createCustomer(customer: { email: string; name: string }) {
    return this.stripe.customers.create({
      email: customer.email,
      name: customer.name,
    });
  }
}
