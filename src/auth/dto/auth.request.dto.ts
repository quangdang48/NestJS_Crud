import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequestDto {
  email: string;
  password: string;
}
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
    default: '123456',
  })
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'First name of user',
    minimum: 1,
    default: 'firstName',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of user',
    minimum: 1,
    default: 'lastName',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;
}
