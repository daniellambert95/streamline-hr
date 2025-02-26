import jwt from 'jsonwebtoken';
import { ConfigError, AuthorizationError } from '../../../shared/errors/application.errors';
import { AuthUser } from '../types/auth.types';

export class JWTService {
    private readonly secret: string;
    private readonly expiresIn: string;
  
    constructor() {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new ConfigError('JWT_SECRET is not defined');
      }
      this.secret = secret;
      this.expiresIn = '8h';
    }
  
    generateToken(payload: Omit<AuthUser, 'password'>): string {
      return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }
  
    verifyToken(token: string): AuthUser {
      try {
        return jwt.verify(token, this.secret) as AuthUser;
      } catch (error) {
        throw new AuthorizationError(`Invalid token: ${error}`);
      }
    }
  }