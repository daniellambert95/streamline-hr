import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ValidationError } from '../../../shared/errors/application.errors';

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      const authData = await this.authService.login(email, password);
      res.json(authData);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Login failed' });
      }
    }
  };

  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = req.body;
      const newUser = await this.authService.signup(userData);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Signup failed' });
      }
    }
  };
}
