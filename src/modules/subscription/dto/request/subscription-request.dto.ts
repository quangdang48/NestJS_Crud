import { SUBSCRIPTION_STATUS } from '@prisma/client';

export class SubscriptionRequestDto {
  userId: string;
  planId: string;
  stripeSubscriptionId: string;
  stripeSiId: string;
  status: SUBSCRIPTION_STATUS;
}
