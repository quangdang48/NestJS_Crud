import { USER_ROLE } from '@prisma/client';
import { SessionUser } from '@/modules/auth/interface/session-user.interface';

export class LoginResponseDto {
  constructor(sessionId: string, role: USER_ROLE) {
    this.sessionId = sessionId;
    this.role = role;
  }
  sessionId: string;
  role: USER_ROLE;

  static fromEntity(entity: SessionUser): LoginResponseDto {
    return new LoginResponseDto(entity.sessionId, entity.role);
  }
}
