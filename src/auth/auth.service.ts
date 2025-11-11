import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { AuthSession, UserRole } from '@prisma/client';
import { RegisterRequestDto } from './dto/request/register-request.dto';
import { RegisterResponseDto } from './dto/response/register-response.dto';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';

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
    const user = await this.prismaService.user.findFirst({
      where: { email: loginDto.email, isActive: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!bcrypt.compareSync(loginDto.password, user.password))
      throw new UnauthorizedException();
    return this.createSession(user.id, user.role);
  }
  async createSession(
    userId: string,
    role: UserRole,
  ): Promise<LoginResponseDto> {
    const sessionDurationHours = 24; // 24 hours
    const expiresAt = new Date(Date.now() + sessionDurationHours * 3600 * 1000);
    const session = await this.prismaService.authSession.create({
      data: {
        userId: userId,
        roleAtLogin: role,
        expiresAt: expiresAt,
      },
    });

    const pickedFieldFromSession = {
      sessionId: session.id,
      role: session.roleAtLogin,
    };
    return plainToClass(LoginResponseDto, pickedFieldFromSession);
  }
  async validateSession(sessionId: string): Promise<AuthSession> {
    // Get session
    const session = await this.prismaService.authSession.findFirst({
      where: {
        id: sessionId,
        isActive: true,
      },
    });
    // Check session
    if (!session || session.expiresAt < new Date())
      throw new UnauthorizedException('Session invalid or expired');

    // Get user with current session
    const user = await this.prismaService.user.findFirst({
      where: {
        id: session.userId,
        isActive: true,
      },
    });
    if (!user) throw new UnauthorizedException('Session invalid or expired');
    return session;
  }
  async inValidateSession(sessionId: string): Promise<boolean> {
    // Get session
    const session = await this.prismaService.authSession.findFirst({
      where: {
        id: sessionId,
        isActive: true,
      },
    });
    // Check session
    if (!session || session.expiresAt < new Date())
      throw new UnauthorizedException('Session invalid or expired');

    // Get user with current session
    const user = await this.prismaService.user.findFirst({
      where: {
        id: session.userId,
        isActive: true,
      },
    });
    if (!user) throw new UnauthorizedException('Session invalid or expired');

    // Deactive session
    const inValidatedSession = await this.prismaService.authSession.update({
      where: { id: session.id },
      data: { isActive: false },
    });
    if (!inValidatedSession) return false;
    return true;
  }
}
