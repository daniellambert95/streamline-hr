import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { EmployeeService } from '../services/employee.service';
import { authenticateJWT } from '../../auth/middleware/auth.middleware';
import { checkRole } from '../../auth/middleware/role.middleware';
import pool from '../../../shared/config/database_client';

export const createEmployeeRouter = () => {
  const router = Router();
  const employeeService = new EmployeeService(pool);
  const employeeController = new EmployeeController(employeeService);

  // Admin routes (Full access)
  router.get('/admin/all', [authenticateJWT, checkRole(['admin'])], employeeController.getAllEmployees);
  router.post('/admin/create', [authenticateJWT, checkRole(['admin'])], employeeController.createEmployee);
  router.put('/admin/:id', [authenticateJWT, checkRole(['admin'])],  employeeController.updateEmployee);

  // Manager routes (Team management)
  router.get('/manager/team',[authenticateJWT, checkRole(['manager', 'admin'])], employeeController.getTeamMembers);
  router.put('/manager/team/:id', [authenticateJWT, checkRole(['manager', 'admin'])], employeeController.updateTeamMember);

  // Recruiter routes (View access, limited edit)
  router.post('/hr/create-employee', [authenticateJWT, checkRole(['recruiter', 'admin'])], employeeController.createEmployee);

  // Employee routes (Self-service) - specific routes first
  router.get('/profile', authenticateJWT, employeeController.getOwnProfile);
  router.put('/profile', authenticateJWT, employeeController.updateOwnProfile);
  router.get('/', authenticateJWT, employeeController.getAllEmployees);

  // General employee routes with ID parameter - MUST come after specific routes
  router.get('/:id', authenticateJWT, employeeController.getEmployeeById);
  router.put('/:id', [authenticateJWT, checkRole(['admin', 'manager', 'recruiter'])], employeeController.updateEmployee);

  return router;
}; 