import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PageOptionsDto } from '@/common/dto';

export class UserOptionDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Search by first name',
    example: 'firstName',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @IsOptional()
  readonly firstName?: string;

  @ApiPropertyOptional({
    description: 'Search by last name',
    example: 'lastName',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @IsOptional()
  readonly lastName?: string;

  @ApiPropertyOptional({
    description: 'Search by email',
    example: 'example@gmail.com',
  })
  @IsOptional()
  @IsString()
  readonly email?: string;
}
