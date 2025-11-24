import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '@/modules/auth/auth.service';
import { SessionUser } from 'src/modules/auth/interface/session-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const sessionIdHeader = req.headers['x-session-id'];

    if (!sessionIdHeader || typeof sessionIdHeader !== 'string') {
      throw new UnauthorizedException('Missing x-session-id header');
    }

    const session: SessionUser =
      await this.authService.validateSession(sessionIdHeader);

    if (!session) {
      throw new UnauthorizedException('Session does not exist');
    }

    req.user = session;
    return true;
  }
}
