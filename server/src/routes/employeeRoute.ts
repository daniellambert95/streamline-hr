import { Router } from "express";
import pool from "../config/db";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

// POST /api/v1/employees/create
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
        email, password, status, 
        first_name, last_name
      )
      VALUES ($1, $2, 'active', $3, $4)
      RETURNING id
    `, [
      req.body.email, 
      req.body.password,
      req.body.first_name,
      req.body.last_name
    ]);
    
    const userId = userResult.rows[0].id;
    
    // Assign selected role to the user
    const roleQuery = `
      WITH selected_role AS (
        SELECT id FROM roles WHERE name = $1
      )
      INSERT INTO user_roles (user_id, role_id)
      SELECT $2, id FROM selected_role
      RETURNING (
        SELECT name FROM roles WHERE id = role_id
      ) as role_name;
    `;
    await client.query(roleQuery, [req.body.role || 'employee', userId]);

    // Create employee record
    await client.query(`
      INSERT INTO employees (
        id, company_id, team_id, department_id,
        job_title, starting_date, mobile_number,
        job_level, salary, employment_type, manager_id,
        employment_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
      req.body.manager_id || null,
      req.body.status || 'active'
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
        e.employment_status as status,
        e.personal_email,
        e.date_of_birth,
        e.gender,
        e.marital_status,
        e.address,
        e.emergency_contact_name,
        e.emergency_contact_phone,
        e.work_permit_status,
        e.work_permit_expiry,
        e.health_insurance_provider,
        e.tax_id,
        e.probation_end_date,
        e.contract_end_date,
        e.last_promotion_date,
        e.leave_balance,
        d.name as department,
        t.name as team_name,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name,
        e.starting_date,
        ARRAY_AGG(r.name) as roles
      FROM employees e
      JOIN users u ON e.id = u.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN employees manager_e ON e.manager_id = manager_e.id
      LEFT JOIN users m ON manager_e.id = m.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE e.company_id = (
        SELECT e2.company_id 
        FROM employees e2 
        WHERE e2.id = $1
      )
      GROUP BY 
        u.id, u.email, u.first_name, u.last_name,
        e.job_title, e.employment_status, e.personal_email,
        e.date_of_birth, e.gender, e.marital_status,
        e.address, e.emergency_contact_name, e.emergency_contact_phone,
        e.work_permit_status, e.work_permit_expiry,
        e.health_insurance_provider, e.tax_id,
        e.probation_end_date, e.contract_end_date,
        e.last_promotion_date, e.leave_balance,
        d.name, t.name, manager_name, e.starting_date
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
        u.email,
        e.job_title,
        m.can_approve_time_off,
        m.can_hire,
        m.can_edit_salary
      FROM managers m
      JOIN employees e ON m.employee_id = e.id
      JOIN users u ON e.id = u.id
      WHERE e.company_id = (
        SELECT e2.company_id 
        FROM employees e2 
        WHERE e2.id = $1
      )
    `, [user.id]);
   
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({ 
      error: 'Failed to fetch managers',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update employee
router.put('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Update users table
    await client.query(`
      UPDATE users 
      SET first_name = $1, last_name = $2, email = $3
      WHERE id = $4
    `, [updates.first_name, updates.last_name, updates.email, id]);

    // Update employee record
    await client.query(`
      UPDATE employees 
      SET 
        job_title = $1,
        mobile_number = $2,
        job_level = $3,
        salary = $4,
        leave_balance = $5,
        starting_date = $6
      WHERE id = $7
    `, [
      updates.job_title,
      updates.mobile_number,
      updates.job_level,
      updates.salary,
      updates.leave_balance,
      updates.starting_date,
      id
    ]);

    // Fetch updated profile data
    const result = await client.query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.role,
        e.job_title,
        e.starting_date,
        e.mobile_number,
        e.job_level,
        e.leave_balance,
        e.salary,
        e.bank_details,
        e.id_document,
        c.company_name,
        c.industry,
        c.address,
        t.name as team_name,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name
      FROM users u
      LEFT JOIN employees e ON u.id = e.id
      LEFT JOIN companies c ON e.company_id = c.id
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN employees manager_e ON e.manager_id = manager_e.id
      LEFT JOIN users m ON manager_e.id = m.id
      WHERE u.id = $1
    `, [id]);

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating employee:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to update employee'
    });
  } finally {
    client.release();
  }
});

export default router; 