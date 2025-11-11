import { UserRole } from '@prisma/client';
import { SessionUser } from 'src/auth/interface/session-user.interface';

export class LoginResponseDto {
  constructor(sessionId: string, role: UserRole) {
    this.sessionId = sessionId;
    this.role = role;
  }
  sessionId: string;
  role: UserRole;

  static fromEntity(entity: SessionUser): LoginResponseDto {
    return new LoginResponseDto(entity.sessionId, entity.role);
  }
}
