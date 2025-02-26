import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';
import { authenticateJWT } from '../../auth/middleware/auth.middleware';
import pool from '../../../shared/config/database_client';

export const createUserRouter = () => {
  const router = Router();
  const userModel = new UserModel(pool);
  const userService = new UserService(userModel);
  const userController = new UserController(userService);

  // Profile routes
  router.get('/profile', authenticateJWT, userController.getProfile);
  router.put('/profile', authenticateJWT, userController.updateProfile);

  // Company users route
  router.get('/company', authenticateJWT, userController.getCompanyUsers);

  return router;
};
