import { BILLING_CYCLE, Plan, PLAN_TYPE } from '@prisma/client';

export default class PlanResponseDto {
  id: string;
  name: string;
  description: string;
  durationDay: number;
  billingCycle: BILLING_CYCLE;
  type: PLAN_TYPE;
  creditLimit: number;
  price: number;
  isTrial: boolean;
  static fromEntity(entity: Plan): PlanResponseDto {
    const dto = new PlanResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.type = entity.planType;
    dto.description = entity.description;
    dto.durationDay = entity.durationDays;
    dto.billingCycle = entity.billingCycle;
    dto.creditLimit = entity.creditLimits;
    dto.price = entity.price;
    dto.isTrial = entity.isTrial;
    return dto;
  }
}
