import { AuthUser } from '../domains/auth/types/user.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
} 