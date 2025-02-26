import { Router } from 'express';
import { RecruitmentService } from '../services/recruitment.service';
import { RecruitmentController } from '../controllers/recruitment.controller';
import { validateJobData } from '../validators/job.validator';
import { authenticateJWT } from '../../auth/middleware/auth.middleware';
import { checkRole } from '../../auth/middleware/role.middleware';
import { DatabaseError, AuthorizationError } from '../../../shared/errors/application.errors';
import pool from '../../../shared/config/database_client';

export const createRecruitmentRouter = () => {
  const router = Router();
  const recruitmentService = new RecruitmentService(pool);
  const recruitmentController = new RecruitmentController(recruitmentService);

  // Jobs routes
  router.post('/jobs', 
    [authenticateJWT, checkRole(['recruiter', 'admin']), validateJobData], 
    recruitmentController.createJob
  );
  router.get('/jobs', 
    [authenticateJWT, checkRole(['recruiter', 'admin', 'manager'])], 
    recruitmentController.getJobs
  );

  // Applicants routes
  router.get('/applicants', 
    [authenticateJWT, checkRole(['recruiter', 'admin', 'manager'])], 
    recruitmentController.getApplicants
  );

  // Stats route
  router.get('/stats', 
    [authenticateJWT, checkRole(['recruiter', 'admin'])], 
    recruitmentController.getRecruitmentStats
  );

  return router;
};

const handleError = (error: any, res: any) => {
  if (error instanceof DatabaseError) {
    res.status(500).json({ error: error.message });
  } else if (error instanceof AuthorizationError) {
    res.status(403).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
}; 