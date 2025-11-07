import {
  Body,
  Controller,
  Post,
  UseGuards,
  Headers,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto, RegisterRequestDto } from './dto/auth.request.dto';
import {
  LogoutResponseDto,
  RegisterResponseDto,
} from './dto/auth.response.dto';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN', 'CUSTOMER'])
  async logout(@Req() req: Request): Promise<LogoutResponseDto> {
    const sessionId = (req as any).user.sessionId;
    return await this.authService.logout(sessionId);
  }
}
