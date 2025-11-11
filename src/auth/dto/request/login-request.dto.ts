import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'Email login for user',
    default: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password login for user',
    minLength: 8,
    maxLength: 20,
    default: '',
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
