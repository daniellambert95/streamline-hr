import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { ApplicantService } from '../services/applicantService';
import { DatabaseError, AuthorizationError } from '../utils/errors';
import pool from '../config/db';

const router = Router();
const applicantService = new ApplicantService(pool);

// Get all applicants for a company
router.get('/', authenticateJWT, async (req, res) => {
  try {
    if (!req.user?.company_id) {
      throw new AuthorizationError('User must belong to a company to view applicants');
    }

    const applicants = await applicantService.getAllApplicants(req.user.company_id);
    res.json(applicants);
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

// Get applicants for a specific job
router.get('/job/:jobId', authenticateJWT, async (req, res) => {
  try {
    if (!req.user?.company_id) {
      throw new AuthorizationError('User must belong to a company to view applicants');
    }

    const applicants = await applicantService.getApplicantsForJob(
      parseInt(req.params.jobId), 
      req.user.company_id
    );
    res.json(applicants);
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

// Get recent applicant activity
router.get('/activity', authenticateJWT, async (req, res) => {
  try {
    if (!req.user?.company_id) {
      throw new AuthorizationError('User must belong to a company to view activity');
    }

    const query = `
      SELECT 
        aa.id,
        aa.activity_type,
        aa.old_value,
        aa.new_value,
        aa.created_at,
        CONCAT(a.first_name, ' ', a.last_name) as applicant_name,
        j.title as job_title
      FROM applicant_activity aa
      JOIN applicants a ON aa.applicant_id = a.id
      JOIN job_listings j ON a.job_listing_id = j.id
      WHERE a.company_id = $1
      ORDER BY aa.created_at DESC
      LIMIT 10
    `;

    const { rows } = await pool.query(query, [req.user.company_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching applicant activity:', error);
    res.status(500).json({ error: 'Failed to fetch applicant activity' });
  }
});

export default router; 