import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const sessionId = req.headers['x-session-id'];
    const session = await this.authService.validSession(sessionId);
    if (!session) {
      throw new UnauthorizedException('Session does not exist');
    }
    req.user = session;
    return true;
  }
}
