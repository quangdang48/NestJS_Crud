import { ApiProperty } from '@nestjs/swagger';
import { CREDIT_SYSTEM_TYPE } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateCreditTrackingDto {
  @ApiProperty({
    description: 'Type of credit system to use',
    enum: CREDIT_SYSTEM_TYPE,
    example: 'AI_BLOG_GEN',
    enumName: 'CREDIT_SYSTEM_TYPE',
  })
  @IsEnum(CREDIT_SYSTEM_TYPE)
  creditSystemType: CREDIT_SYSTEM_TYPE;

  @ApiProperty({
    description: 'The user ID for whom the credit is being tracked',
    example: 'user_1234567890abcdef',
  })
  @IsString()
  userId: string;
}
