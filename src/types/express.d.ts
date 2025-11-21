import { AuthSession } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: AuthSession | any;
    }
  }
}
