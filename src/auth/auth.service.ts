import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { RegisterRequestDto } from './dto/request/register-request.dto';
import { RegisterResponseDto } from './dto/response/register-response.dto';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { SessionUser } from './interface/session-user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(registerDto: RegisterRequestDto): Promise<RegisterResponseDto> {
    // Check existing user
    const userExists = await this.prismaService.user.findFirst({
      where: { email: registerDto.email, isActive: true },
    });
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(registerDto.password, salt);
    // Create user
    const user = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        password: hashedPassword,
        salt: salt,
      },
    });
    return RegisterResponseDto.fromEntity(user);
  }
  async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    // Find user by email
    const user = await this.prismaService.user.findFirst({
      where: { email: loginDto.email, isActive: true },
    });
    if (!user) {
      throw new NotFoundException('Email or password is incorrect');
    }
    // Compare password
    if (!bcrypt.compareSync(loginDto.password, user.password))
      throw new UnauthorizedException('Password is incorrect');
    return this.createSession(user.id, user.role);
  }
  async createSession(
    userId: string,
    role: UserRole,
  ): Promise<LoginResponseDto> {
    // Create session
    const sessionDurationHours = 24; // 24 hours
    const expiresAt = new Date(Date.now() + sessionDurationHours * 3600 * 1000);
    const session = await this.prismaService.authSession.create({
      data: {
        userId: userId,
        roleAtLogin: role,
        expiresAt: expiresAt,
      },
    });
    // Map to LoginResponseDto
    const pickedFieldFromSession: SessionUser = {
      sessionId: session.id,
      role: session.roleAtLogin,
    };
    return LoginResponseDto.fromEntity(pickedFieldFromSession);
  }
  async validateSession(sessionId: string): Promise<SessionUser> {
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
    const sessionUser: SessionUser = {
      userId: user.id,
      sessionId: session.id,
      email: user.email,
      role: user.role,
    };
    return sessionUser;
  }
  async logout(userId: string): Promise<{ message: string }> {
    // Deactivate current session
    const updatedSession = await this.prismaService.authSession.updateMany({
      where: { userId: userId, isActive: true },
      data: { isActive: false },
    });

    if (!updatedSession) {
      return { message: 'Logout failed' };
    }
    return { message: 'Logged out successfully' };
  }
}
