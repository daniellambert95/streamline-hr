import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { EmployeeService } from '../../employees/services/employee.service';
import { UserService } from '../../users/services/user.service';
import { UserModel } from '../../users/models/user.model';
import { authenticateJWT } from '../../auth/middleware/auth.middleware';
import pool from '../../../shared/config/database_client';

export const createDashboardRouter = () => {
  const router = Router();
  const userModel = new UserModel(pool);
  const userService = new UserService(userModel, pool);
  const employeeService = new EmployeeService(pool);
  const dashboardController = new DashboardController(employeeService, userService);

  router.get('/data', authenticateJWT, dashboardController.getDashboardData);

  return router;
}; 