import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../../../shared/errors/application.errors';

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new AuthorizationError('Insufficient permissions');
    }

    next();
  };
}; 