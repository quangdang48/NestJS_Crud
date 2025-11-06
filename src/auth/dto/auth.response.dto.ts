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
  sessionId: string;
  role: UserRole;
}
