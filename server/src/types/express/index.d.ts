import { User } from '../user';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
        company_id?: number;
      }
    }
  }
} 