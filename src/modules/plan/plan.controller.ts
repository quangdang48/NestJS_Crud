import { Controller, Get } from '@nestjs/common';
import PlanResponseDto from './dto/response/plan-response.dto';
import { PlanService } from './plan.service';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}
  @Get()
  async getAllPlans(): Promise<PlanResponseDto[]> {
    return await this.planService.getAllPlans();
  }
}
