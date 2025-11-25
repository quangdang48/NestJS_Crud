import { SUBSCRIPTION_STATUS } from '@prisma/client';

export class PlanInfo {
  id: string;
  name: string;
  description?: string;
}

export class SubscriptionResponseDto {
  id: string;
  plan: PlanInfo;
  status: SUBSCRIPTION_STATUS;
  createdAt: Date;

  static fromEntity(subscription: any, plan?: any): SubscriptionResponseDto {
    const dto = new SubscriptionResponseDto();
    dto.id = subscription.id;
    dto.status = subscription.status;
    dto.createdAt = subscription.createdAt;

    if (plan) {
      dto.plan = {
        id: plan.id,
        name: plan.name,
        description: plan.description,
      };
    }

    return dto;
  }
}
