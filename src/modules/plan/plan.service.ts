import { Injectable, NotFoundException } from '@nestjs/common';
import PlanResponseDto from './dto/response/plan-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Plan } from '@prisma/client';

@Injectable()
export class PlanService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllPlans(): Promise<PlanResponseDto[]> {
    const plans: Plan[] = await this.prismaService.plan.findMany({
      where: {
        isActive: true,
        isDisplay: true,
      },
    });
    return plans.map((plan) => PlanResponseDto.fromEntity(plan));
  }
  async getPlanById(planId: string): Promise<PlanResponseDto> {
    const plan = await this.prismaService.plan.findFirst({
      where: {
        id: planId,
      },
    });
    if (!plan) throw new NotFoundException('Plan not found');
    return PlanResponseDto.fromEntity(plan);
  }
}
