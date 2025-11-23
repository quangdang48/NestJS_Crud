import { SessionUser } from 'src/modules/auth/interface/session-user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}
