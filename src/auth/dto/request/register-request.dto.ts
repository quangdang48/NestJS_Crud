import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    description: 'Email register for user',
    minimum: 1,
    default: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password register for user',
    minimum: 1,
    default: '12345678',
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @ApiProperty({
    description: 'First name of user',
    minLength: 8,
    maxLength: 50,
    default: 'firstName',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    description: 'Last name of user',
    minLength: 8,
    maxLength: 50,
    default: 'lastName',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  lastName: string;
}
