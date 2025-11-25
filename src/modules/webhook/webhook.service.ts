import { Injectable, BadRequestException } from '@nestjs/common';
import { WEBHOOK_STATUS } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';
import { StripeService } from '../stripe/stripe.service';
import { WebhookHandler } from './webhook-handler.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
    private readonly webhookHandler: WebhookHandler,
  ) {}

  async constructWebhookEvent(body: Buffer, signature: string) {
    let event: Stripe.Event;
    try {
      event = this.stripeService.constructWebhookEvent(body, signature);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);

      await this.prismaService.webhookLog.create({
        data: {
          event: 'unknown',
          payload: {},
          status: WEBHOOK_STATUS.FAILED,
          receivedAt: new Date(),
        },
      });

      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    await this.prismaService.webhookLog.create({
      data: {
        event: event.type,
        payload: JSON.parse(JSON.stringify(event)),
        status: WEBHOOK_STATUS.RECEIVED,
        receivedAt: new Date(),
      },
    });
    await this.webhookHandler.handle(event);
    return event;
  }
}
