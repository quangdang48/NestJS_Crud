import { SUBSCRIPTION_STATUS } from '@prisma/client';

export class SubscriptionRequestDto {
  userId: string;
  stripeSubscriptionId: string;
  stripeProductId: string;
  stripePriceId: string;
  status: SUBSCRIPTION_STATUS;
}
