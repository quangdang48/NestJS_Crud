import { UserRole } from '@prisma/client';

export class LoginResponseDto {
  constructor(sessionId: string, role: UserRole) {
    this.sessionId = sessionId;
    this.role = role;
  }
  sessionId: string;
  role: UserRole;
}
