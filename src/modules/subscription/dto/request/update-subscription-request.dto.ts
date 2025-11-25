import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateSubscriptionRequestDto {
  @ApiProperty({
    description: 'The ID of the new plan to switch the subscription to',
    default: 'plan_1234567890abcdef',
  })
  @IsNotEmpty()
  newPlanId: string;
}
