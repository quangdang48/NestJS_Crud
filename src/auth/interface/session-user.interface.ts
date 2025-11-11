import { UserRole } from '@prisma/client';

export interface SessionUser {
  userId: string;
  sessionId: string;
  email?: string;
  roles?: UserRole;
}
