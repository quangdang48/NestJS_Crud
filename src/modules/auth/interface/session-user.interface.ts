import { USER_ROLE } from '@prisma/client';

export interface SessionUser {
  userId?: string;
  sessionId?: string;
  email?: string;
  role?: USER_ROLE;
}
