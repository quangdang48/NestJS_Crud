import { Injectable } from '@nestjs/common';
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
}
