import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';
import { authenticateJWT } from '../../auth/middleware/auth.middleware';
import pool from '../../../shared/config/database_client';
import { createTaskRouter } from './task.routes';

export const createUserRouter = () => {
  const router = Router();
  const userModel = new UserModel(pool);
  const userService = new UserService(userModel, pool);
  const userController = new UserController(userService);

  // Profile routes
  router.get('/profile', authenticateJWT, userController.getProfile);
  router.put('/profile', authenticateJWT, userController.updateProfile);

  // Company users route
  router.get('/company-users', authenticateJWT, userController.getCompanyUsers);

  // Notification and message endpoints
  router.get('/notifications', authenticateJWT, userController.getUserNotifications);
  router.get('/notifications/all', authenticateJWT, userController.getAllUserNotifications);
  router.put('/notifications/:id/read', authenticateJWT, userController.markNotificationAsRead);
  router.put('/notifications/read-all', authenticateJWT, userController.markAllNotificationsAsRead);
  router.delete('/notifications/:id', authenticateJWT, userController.deleteNotification);
  router.put('/notifications/:id/unread', authenticateJWT, userController.markNotificationAsUnread);

  router.get('/messages', authenticateJWT, userController.getUserMessages);
  router.get('/messages/all', authenticateJWT, userController.getAllUserMessages);
  router.post('/messages', authenticateJWT, userController.sendMessage);
  router.put('/messages/:id/read', authenticateJWT, userController.markMessageAsRead);
  router.put('/messages/:id/unread', authenticateJWT, userController.markMessageAsUnread);
  router.delete('/messages/:id', authenticateJWT, userController.deleteMessage);
  router.put('/messages/:id/mark-important', authenticateJWT, userController.markMessageAsImportant);
  router.put('/messages/:id/unmark-important', authenticateJWT, userController.unmarkMessageAsImportant);


  // Mount task routes
  router.use('/tasks', createTaskRouter());

  return router;
};
