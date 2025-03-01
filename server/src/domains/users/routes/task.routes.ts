import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { TaskService } from '../services/task.service';
import { TaskModel } from '../models/task.model';
import { authenticateJWT } from '../../auth/middleware/auth.middleware';
import pool from '../../../shared/config/database_client';

export const createTaskRouter = () => {
  const router = Router();
  const taskModel = new TaskModel(pool);
  const taskService = new TaskService(taskModel);
  const taskController = new TaskController(taskService);

  // Task routes
  router.get('/', authenticateJWT, taskController.getTasks);
  router.post('/lists', authenticateJWT, taskController.createTaskList);
  router.post('/', authenticateJWT, taskController.createTask);
  router.put('/:id', authenticateJWT, taskController.updateTask);
  router.delete('/:id', authenticateJWT, taskController.deleteTask);
  router.delete('/lists/:id', authenticateJWT, taskController.deleteTaskList);

  return router;
}; 