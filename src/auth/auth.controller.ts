import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { RegisterRequestDto } from './dto/request/register-request.dto';
import { RegisterResponseDto } from './dto/response/register-response.dto';

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
  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request): Promise<{ message: string }> {
    const sessionId = (req as any).user.sessionId;
    const result = await this.authService.inValidateSession(sessionId);
    if (!result) return { message: `Logout failed` };
    return { message: `Logged out successfully` };
  }
}
