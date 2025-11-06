import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginRequestDto, RegisterRequestDto } from './dto/auth.request.dto';
import { LoginResponseDto, RegisterResponseDto } from './dto/auth.response.dto';
import bcrypt from 'node_modules/bcryptjs';
import { plainToClass } from 'class-transformer';
import { AuthSession, UserRole } from '@prisma/client';

@Injectable({})
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(registerDto: RegisterRequestDto): Promise<RegisterResponseDto> {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(registerDto.password, salt);
    const user = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        password: hashedPassword,
        salt: salt,
      },
    });
    return plainToClass(RegisterResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
  async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!bcrypt.compareSync(loginDto.password, user.password))
      throw new UnauthorizedException();
    return this.createSession(user.id, user.role);
  }
  async createSession(
    userId: string,
    role: UserRole,
  ): Promise<LoginResponseDto> {
    const sessionDurationHours = 1;
    const expiresAt = new Date(Date.now() + sessionDurationHours * 3600 * 1000);
    const session = await this.prismaService.authSession.create({
      data: {
        userId: userId,
        roleAtLogin: role,
        expiresAt: expiresAt,
        isActive: true,
      },
    });

    const pickedFieldFromSession = {
      sessionId: session.id,
      role: session.roleAtLogin,
    };
    return plainToClass(LoginResponseDto, pickedFieldFromSession);
  }
  async validSession(sessionId: string): Promise<AuthSession> {
    if (!sessionId) {
      throw new UnauthorizedException('Session ID not found');
    }
    const session = await this.prismaService.authSession.findUnique({
      where: {
        id: sessionId,
      },
    });
    if (!session || session.expiresAt < new Date())
      throw new UnauthorizedException('Session invalid or expired');
    return session;
  }
}
