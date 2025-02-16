import { Router } from 'express';
import pool from '../db';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Fetch all job listings for the signed-in user
router.get('/', authenticateJWT, async (req, res) => {
  const user = (req as any).user; // Extract user from the JWT token

  try {
    const query = `
      SELECT * 
      FROM job_listings 
      WHERE company_id IN (
        SELECT id 
        FROM companies 
        WHERE user_id = $1
      )
    `;
    const { rows } = await pool.query(query, [user.id]); // Filter by user ID
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch applicants for a specific job listing
router.get('/:jobId/applicants', authenticateJWT, async (req, res) => {
  const { jobId } = req.params;
  const user = (req as any).user; // Extract user from the JWT token

  try {
    // Ensure the job belongs to the signed-in user
    const jobCheckQuery = `
      SELECT 1 
      FROM job_listings 
      WHERE id = $1 AND company_id IN (
        SELECT id 
        FROM companies 
        WHERE user_id = $2
      )
    `;
    const jobCheckResult = await pool.query(jobCheckQuery, [jobId, user.id]);

    if (jobCheckResult.rowCount === 0) {
      return res.status(403).json({ error: 'You do not have access to this job listing' });
    }

    const query = `
      SELECT 
        a.id, a.name, a.email, a.application_score AS score, 
        r.resume_path AS resumeUrl, c.cover_letter_path AS coverLetterUrl
      FROM applicants a
      LEFT JOIN resumes r ON a.id = r.applicant_id
      LEFT JOIN cover_letters c ON a.id = c.applicant_id
      WHERE a.job_id = $1
    `;
    const { rows } = await pool.query(query, [jobId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new job listing
router.post('/', authenticateJWT, async (req, res) => {
  const user = (req as any).user;

  try {
    // Get the company associated with the user
    const companyQuery = `SELECT id FROM companies WHERE user_id = $1 LIMIT 1`;
    const companyResult = await pool.query(companyQuery, [user.id]);

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: 'No company found for the user' });
    }

    const companyId = companyResult.rows[0].id;

    // Insert job listing
    const { title, description, requirements, location, type, salary, status } = req.body;
    const insertQuery = `
      INSERT INTO job_listings (company_id, title, description, requirements, location, type, salary, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, title, created_at;
    `;
    const result = await pool.query(insertQuery, [
      companyId,
      title,
      description,
      requirements,
      location,
      type,
      salary,
      status || 'open',
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating job listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;