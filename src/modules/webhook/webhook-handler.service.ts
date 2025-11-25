import { Inject, Injectable } from '@nestjs/common';
import { WebhookStrategy } from './interfaces/webhook-strategy.interface';
import { WEBHOOK_STRATEGIES } from './constants/webhook.constants';

@Injectable()
export class WebhookHandler {
  constructor(
    @Inject(WEBHOOK_STRATEGIES)
    private readonly strategies: WebhookStrategy[],
  ) {}

  async handle(event: any): Promise<void> {
    const strategy = this.strategies.find((s) => s.canHandle(event.type));
    if (!strategy) {
      console.warn(`No strategy found for event type: ${event.type}`);
      return;
    }
    await strategy.handle(event);
  }
}
