import { Expose } from 'class-transformer';
import { UserRole } from '@prisma/client';

export class RegisterResponseDto {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
}
export class LoginResponseDto {
  constructor(sessionId: string, role: UserRole) {
    this.sessionId = sessionId;
    this.role = role;
  }
  sessionId: string;
  role: UserRole;
}
export class LogoutResponseDto {
  constructor(message: string) {
    this.message = message;
  }
  message: string;
}
