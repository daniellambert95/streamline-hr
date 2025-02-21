import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthorizationError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthorizationError('No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      role: string;
      company_id?: number;
    };
    
    req.user = decoded;
    next();
  } catch (err) {
    throw new AuthorizationError('Invalid token');
  }
};