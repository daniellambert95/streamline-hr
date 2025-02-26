import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { AnalyticsService } from '../services/analytics.service';
import { authenticateJWT } from '../../auth/middleware/auth.middleware';
import pool from '../../../shared/config/database_client';

export const createAnalyticsRouter = () => {
  const router = Router();
  const analyticsService = new AnalyticsService(pool);
  const analyticsController = new AnalyticsController(analyticsService);

  router.get('/employee-analytics', 
    authenticateJWT, 
    analyticsController.getEmployeeAnalytics
  );

  return router;
};
