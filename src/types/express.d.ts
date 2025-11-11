import { SessionUser } from 'src/auth/interface/session-user.interface';

declare module 'express-serve-static-core' {
  interface Request {
    user?: SessionUser;
  }
}
