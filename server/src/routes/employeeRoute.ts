import { Router } from "express";
import pool from "../config/db";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

router.post('/create', authenticateJWT, async (req, res) => {
  const client = await pool.connect();
  const user = (req as any).user;
  
  try {
    // Validate required fields
    const requiredFields = ['email', 'first_name', 'last_name', 'job_title'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    await client.query('BEGIN');
    
    // Check if email already exists
    const emailCheck = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [req.body.email]
    );

    if (emailCheck.rows.length > 0) {
      throw new Error('Email already exists');
    }

    // Get company_id first
    const companyResult = await client.query(
      'SELECT id FROM companies WHERE user_id = $1',
      [user.id]
    );

    if (companyResult.rows.length === 0) {
      throw new Error('Company not found');
    }

    // Create user first
    const userResult = await client.query(`
      INSERT INTO users (
        email, password, role, status, 
        first_name, last_name
      )
      VALUES ($1, $2, $3, 'active', $4, $5)
      RETURNING id
    `, [
      req.body.email, 
      req.body.password, 
      req.body.role || 'employee',
      req.body.first_name,
      req.body.last_name
    ]);
    
    const userId = userResult.rows[0].id;
    
    // Create employee record
    await client.query(`
      INSERT INTO employees (
        id, company_id, team_id, department_id,
        job_title, starting_date, mobile_number,
        job_level, salary, employment_type, manager_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      userId,
      companyResult.rows[0].id,
      req.body.team_id || null,
      req.body.department_id || null,
      req.body.job_title,
      req.body.starting_date,
      req.body.mobile_number || null,
      req.body.job_level || null,
      req.body.salary || null,
      req.body.employment_type || 'full_time',
      req.body.manager_id || null
    ]);

    // If marked as manager, create manager record
    if (req.body.is_manager) {
      await client.query(`
        INSERT INTO managers (
          id, department, level,
          can_approve_time_off, can_hire, can_edit_salary
        )
        VALUES ($1, $2, $3, true, false, false)
      `, [
        userId,
        req.body.department_id ? 
          (await client.query('SELECT name FROM departments WHERE id = $1', [req.body.department_id])).rows[0]?.name 
          : null,
        'team_lead' // Default level for new managers
      ]);
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Employee created successfully', userId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating employee:', error);
    res.status(error instanceof Error && error.message === 'Email already exists' ? 400 : 500).json({
      error: error instanceof Error ? error.message : 'Failed to create employee'
    });
  } finally {
    client.release();
  }
});

router.get('/', authenticateJWT, async (req, res) => {
  const user = (req as any).user;
  
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        e.job_title,
        t.name as team_name,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name,
        e.starting_date
      FROM employees e
      JOIN users u ON e.id = u.id
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN employees manager_e ON e.manager_id = manager_e.id
      LEFT JOIN users m ON manager_e.id = m.id
      WHERE e.company_id = (
        SELECT id FROM companies WHERE user_id = $1
      )
    `, [user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ 
      error: 'Failed to fetch employees',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get managers for company
router.get('/managers', authenticateJWT, async (req, res) => {
  const user = (req as any).user;
  
  try {
    const result = await pool.query(`
      SELECT DISTINCT 
        u.id,
        u.first_name,
        u.last_name,
        e.job_title
      FROM employees e
      JOIN users u ON e.id = u.id
      WHERE e.company_id = (
        SELECT id FROM companies WHERE user_id = $1
      ) AND (
        e.job_level IN ('executive', 'department_head', 'team_lead')
        OR EXISTS (
          SELECT 1 FROM employees 
          WHERE manager_id = e.id
        )
      )
    `, [user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({ error: 'Failed to fetch managers' });
  }
});

export default router; 