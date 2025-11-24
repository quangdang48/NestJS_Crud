import { SUBSCRIPTION_STATUS } from '@prisma/client';

export class SubscriptionRequestDto {
  stripeSubscriptionId: string;
  userId: string | null;
  planId: string;
  status: SUBSCRIPTION_STATUS;
  startDate: Date;
  endDate: Date;

  static fromStripeWebhook(webhookData: any): SubscriptionRequestDto {
    const session = webhookData.data.object;

    const dto = new SubscriptionRequestDto();
    dto.stripeSubscriptionId = session.subscription;
    dto.userId = session.metadata?.customerId || null;
    dto.planId = session.metadata?.planId;
    dto.status = 'ACTIVE';
    dto.startDate = new Date(session.created * 1000);
    dto.endDate = null;

    return dto;
  }
}
