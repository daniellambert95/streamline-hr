import { Router } from 'express';
import { DepartmentController } from '../controllers/department.controller';
import { TeamController } from '../controllers/team.controller';
import { ManagerController } from '../controllers/manager.controller';
import { authenticateJWT } from '../../auth/middleware/auth.middleware';
import { checkRole } from '../../auth/middleware/role.middleware';

export const createOrganizationRouter = () => {
  const router = Router();
  
  // Department routes
  router.get('/departments', authenticateJWT, DepartmentController.getAll);
  router.post('/departments', authenticateJWT, DepartmentController.create);
  router.put('/departments/:id', authenticateJWT, DepartmentController.update);
  router.delete('/departments/:id', authenticateJWT, DepartmentController.delete);

  // Team routes
  router.get('/teams', authenticateJWT, TeamController.getAll);
  router.post('/teams', authenticateJWT, TeamController.create);
  router.put('/teams/:id', authenticateJWT, TeamController.update);
  router.delete('/teams/:id', authenticateJWT, TeamController.delete);

  // Manager routes
  router.get('/managers', authenticateJWT, ManagerController.getAll);
  router.post('/managers', [authenticateJWT, checkRole(['admin', 'manager', 'recruiter'])], ManagerController.create);

  return router;
}; 