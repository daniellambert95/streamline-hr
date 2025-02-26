import { AuthUser, LoginResponse, SignupForm } from '../types/auth.types';
import { AuthorizationError, ValidationError } from '../../../shared/errors/application.errors';
import { AuthModel } from '../models/auth.model';
import { JWTService } from './jwt.service';

// This service handles business logic (login, signup, password verification)

export class AuthService {
  private jwtService: JWTService;

  constructor(
    private authModel: AuthModel,
    jwtService?: JWTService
  ) {
    this.jwtService = jwtService || new JWTService();
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.authModel.findUserByEmail(email);
    
    if (!user) {
      throw new AuthorizationError('Invalid credentials');
    }

    const isValidPassword = await this.authModel.verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      throw new AuthorizationError('Invalid credentials');
    }

    const tokenPayload: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      company_id: user.company_id,
      company_name: user.company_name
    };

    const token = this.jwtService.generateToken(tokenPayload);

    return {
      token,
      user: tokenPayload
    };
  }

  async signup(userData: SignupForm): Promise<LoginResponse> {
    const existingUser = await this.authModel.findUserByEmail(userData.email);
    
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }

    const user = await this.authModel.createUser(userData);
    
    const tokenPayload: AuthUser = {
      id: user.id,
      email: user.email,
      role: 'admin', // First signup is always admin
      company_id: user.company_id,
      company_name: user.company_name
    };

    const token = this.jwtService.generateToken(tokenPayload);

    return {
      token,
      user: tokenPayload
    };
  }

  verifyToken(token: string): AuthUser {
    return this.jwtService.verifyToken(token);
  }
}
