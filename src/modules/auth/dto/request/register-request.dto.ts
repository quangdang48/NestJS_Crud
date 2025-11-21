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
    default: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password register for user',
    default: '12345678',
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @ApiProperty({
    description: 'First name of user',
    minLength: 2,
    maxLength: 30,
    default: 'firstName',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  firstName: string;

  @ApiProperty({
    description: 'Last name of user',
    minLength: 2,
    maxLength: 30,
    default: 'lastName',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  lastName: string;
}
