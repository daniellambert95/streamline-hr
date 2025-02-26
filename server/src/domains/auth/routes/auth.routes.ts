import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { AuthModel } from '../models/auth.model';
import pool from '../../../shared/config/database_client';
import { authenticateJWT } from '../middleware/auth.middleware';
import { JWTService } from '../services/jwt.service';

export const createAuthRouter = () => {
  const router = Router();
  
  // Initialize services and controllers
  const authModel = new AuthModel(pool);
  const jwtService = new JWTService();
  const authService = new AuthService(authModel, jwtService);
  const authController = new AuthController(authService);

  // Public routes
  router.post('/login', authController.login);
  router.post('/signup', authController.signup);

  // Protected routes (example)
  router.get('/me', authenticateJWT, (req, res) => {
    res.json(req.user);
  });

  return router;
};
