export class SubscriptionPortalDto {
  id: string;
  planName: string;
  planDescription?: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  amount: number;
  currency: string;
  billingCycle: string;

  static fromEntity(subscription: any, plan?: any): SubscriptionPortalDto {
    const dto = new SubscriptionPortalDto();
    dto.id = subscription.id;
    dto.status = subscription.status;
    dto.planName = plan?.name || 'Unknown Plan';
    dto.planDescription = plan?.description;
    dto.amount = plan?.price || 0;
    dto.currency = 'USD';
    dto.billingCycle = plan?.billingCycle || 'MONTHLY';
    dto.currentPeriodStart = subscription.currentPeriodStart;
    dto.currentPeriodEnd = subscription.currentPeriodEnd;
    return dto;
  }
}
