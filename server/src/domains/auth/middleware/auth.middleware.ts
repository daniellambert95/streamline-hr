import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../../../shared/errors/application.errors';
import { JWTService } from '../services/jwt.service';

// The Middleware handles request authentication
const jwtService = new JWTService();

export const authenticateJWT = createAuthMiddleware(jwtService);

export function createAuthMiddleware(jwtService: JWTService) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        throw new AuthorizationError('No token provided');
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwtService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
}