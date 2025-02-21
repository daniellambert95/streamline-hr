import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { JobService } from '../services/jobService';
import { validateJobData } from '../middleware/validators/jobValidator';
import { DatabaseError, AuthorizationError } from '../utils/errors';
import pool from '../config/db';

const router = Router();
const jobService = new JobService(pool);

// Create job listing
router.post('/', authenticateJWT, validateJobData, async (req, res) => {
  try {
    if (!req.user?.company_id) {
      throw new AuthorizationError('User must belong to a company to create jobs');
    }

    const job = await jobService.createJob(req.body, req.user.company_id);
    res.status(201).json(job);
  } catch (error) {
    if (error instanceof DatabaseError) {
      res.status(500).json({ error: error.message });
    } else if (error instanceof AuthorizationError) {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get all jobs for company
router.get('/', authenticateJWT, async (req, res) => {
  try {
    if (!req.user?.company_id) {
      throw new AuthorizationError('User must belong to a company to view jobs');
    }

    const jobs = await jobService.getJobs(req.user.company_id);
    res.json(jobs);
  } catch (error) {
    if (error instanceof DatabaseError) {
      res.status(500).json({ error: error.message });
    } else if (error instanceof AuthorizationError) {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;