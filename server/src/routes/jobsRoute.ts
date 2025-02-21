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

    // Insert job
    const { title, description, location, type, salary, status } = req.body;
    const insertQuery = `
      INSERT INTO job_listings (company_id, title, description, location, type, salary, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title, created_at;
    `;
    const result = await pool.query(insertQuery, [
      companyId,
      title,
      description,
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

// Fetch all applicants for the company
router.get('/applicants', authenticateJWT, async (req, res) => {
  const user = (req as any).user;

  try {
    // Get the company_id for the authenticated user
    const companyQuery = `
      SELECT id FROM companies WHERE user_id = $1
    `;
    const companyResult = await pool.query(companyQuery, [user.id]);
    
    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const companyId = companyResult.rows[0].id;

    // Fetch applicants with job listing information
    const query = `
      SELECT 
        a.id,
        a.first_name,
        a.last_name,
        a.email,
        a.resume_path,
        a.cover_letter_path,
        a.linkedin_url,
        a.status,
        a.applied_date,
        a.job_listing_id,
        j.title as job_title,
        (
          SELECT json_agg(json_build_object(
            'id', an.id,
            'content', an.content,
            'created_at', an.created_at
          ))
          FROM applicant_notes an
          WHERE an.applicant_id = a.id
        ) as notes
      FROM applicants a
      JOIN job_listings j ON a.job_listing_id = j.id
      WHERE a.company_id = $1
      ORDER BY a.applied_date DESC
    `;

    const { rows } = await pool.query(query, [companyId]);
    
    // Format the response
    const formattedApplicants = rows.map(applicant => ({
      id: applicant.id,
      first_name: applicant.first_name,
      last_name: applicant.last_name,
      email: applicant.email,
      resume_path: applicant.resume_path,
      cover_letter_path: applicant.cover_letter_path,
      linkedin_url: applicant.linkedin_url,
      status: applicant.status,
      applied_date: applicant.applied_date,
      job_listing_id: applicant.job_listing_id,
      job_title: applicant.job_title,
      notes: applicant.notes || []
    }));

    res.status(200).json(formattedApplicants);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single applicant's details
router.get('/applicants/:id', authenticateJWT, async (req, res) => {
  const user = (req as any).user;
  const applicantId = req.params.id;

  try {
    // Verify the applicant belongs to the user's company
    const query = `
      SELECT 
        a.*,
        j.title as job_title,
        (
          SELECT json_agg(json_build_object(
            'id', an.id,
            'content', an.content,
            'created_at', an.created_at
          ))
          FROM applicant_notes an
          WHERE an.applicant_id = a.id
        ) as notes
      FROM applicants a
      JOIN job_listings j ON a.job_listing_id = j.id
      JOIN companies c ON a.company_id = c.id
      WHERE a.id = $1 AND c.user_id = $2
    `;

    const { rows } = await pool.query(query, [applicantId, user.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    const applicant = rows[0];
    res.status(200).json({
      id: applicant.id,
      first_name: applicant.first_name,
      last_name: applicant.last_name,
      email: applicant.email,
      resume_path: applicant.resume_path,
      cover_letter_path: applicant.cover_letter_path,
      linkedin_url: applicant.linkedin_url,
      status: applicant.status,
      applied_date: applicant.applied_date,
      job_listing_id: applicant.job_listing_id,
      job_title: applicant.job_title,
      notes: applicant.notes || []
    });
  } catch (error) {
    console.error('Error fetching applicant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent applicant activity
router.get('/applicant-activity', authenticateJWT, async (req, res) => {
  const user = (req as any).user;

  try {
    const companyQuery = `SELECT id FROM companies WHERE user_id = $1`;
    const companyResult = await pool.query(companyQuery, [user.id]);
    
    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const companyId = companyResult.rows[0].id;

    const query = `
      SELECT 
        aa.id,
        aa.applicant_id,
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
      LIMIT 20
    `;

    const { rows } = await pool.query(query, [companyId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching applicant activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;