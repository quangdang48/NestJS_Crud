import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto, RegisterRequestDto } from './dto/auth.request.dto';
import { RegisterResponseDto } from './dto/auth.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() requestLogin: LoginRequestDto) {
    return this.authService.login(requestLogin);
  }
  @Post('register')
  async signup(
    @Body() requestRegister: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return await this.authService.signup(requestRegister);
  }
}
