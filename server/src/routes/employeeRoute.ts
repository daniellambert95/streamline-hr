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
      'SELECT id FROM companies WHERE company_name = $1',
      [user.company_name]
    );

    if (companyResult.rows.length === 0) {
      throw new Error('Company not found');
    }

    // Create user first
    const userResult = await client.query(`
      INSERT INTO users (
        email, password, status, 
        first_name, last_name,
        company_name
      )
      VALUES ($1, $2, 'active', $3, $4, $5)
      RETURNING id
    `, [
      req.body.email, 
      req.body.password,
      req.body.first_name,
      req.body.last_name,
      user.company_name
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
    // First, let's check if there are any manager relationships
    const managerCheck = await pool.query(`
      SELECT e.id, e.manager_id 
      FROM employees e 
      WHERE e.company_id = (
        SELECT e2.company_id FROM employees e2 WHERE e2.id = $1
      )
    `, [user.id]);


    const result = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        e.job_title,
        e.employment_status as status,
        e.personal_email,
        e.manager_id,
        d.name as department,
        t.name as team_name,
        CONCAT(manager_u.first_name, ' ', manager_u.last_name) as manager_name,
        e.starting_date,
        r.name as role
      FROM employees e
      JOIN users u ON e.id = u.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN employees manager_e ON e.manager_id = manager_e.id
      LEFT JOIN users manager_u ON manager_e.id = manager_u.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE e.company_id = (
        SELECT e2.company_id 
        FROM employees e2 
        WHERE e2.id = $1
      )
    `, [user.id]);

    
    res.json(result.rows);
  } catch (error) {
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
        e.department_id,
        d.name as department_name,
        m.level,
        m.can_approve_time_off,
        m.can_hire,
        m.can_edit_salary,
        m.max_reports
      FROM employees e
      JOIN users u ON e.id = u.id
      JOIN managers m ON e.id = m.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.company_id = (
        SELECT e2.company_id 
        FROM employees e2 
        WHERE e2.id = $1
      )
    `, [user.id]);
   
    res.json(result.rows);
  } catch (error) {
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
    if (updates.first_name || updates.last_name || updates.email) {
      await client.query(`
        UPDATE users 
        SET 
          first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          email = COALESCE($3, email)
        WHERE id = $4
      `, [updates.first_name, updates.last_name, updates.email, id]);
    }

    // Get department_id and team_id from names
    let department_id = null;
    let team_id = null;

    if (updates.department) {
      const deptResult = await client.query(
        `SELECT id FROM departments WHERE name = $1 AND company_id = (
          SELECT company_id FROM employees WHERE id = $2
        )`,
        [updates.department, id]
      );
      if (deptResult.rows.length > 0) {
        department_id = deptResult.rows[0].id;
      }
    }

    if (updates.team_name) {
      const teamResult = await client.query(
        `SELECT id FROM teams WHERE name = $1 AND company_id = (
          SELECT company_id FROM employees WHERE id = $2
        )`,
        [updates.team_name, id]
      );
      if (teamResult.rows.length > 0) {
        team_id = teamResult.rows[0].id;
      }
    }

    // Update employee record
    await client.query(`
      UPDATE employees 
      SET 
        job_title = COALESCE($1, job_title),
        mobile_number = COALESCE($2, mobile_number),
        job_level = COALESCE($3, job_level),
        salary = COALESCE($4, salary),
        leave_balance = COALESCE($5, leave_balance),
        starting_date = COALESCE($6, starting_date),
        gender = COALESCE($7, gender),
        marital_status = COALESCE($8, marital_status),
        address = COALESCE($9, address),
        department_id = COALESCE($10, department_id),
        team_id = COALESCE($11, team_id),
        date_of_birth = COALESCE($12, date_of_birth),
        personal_email = COALESCE($13, personal_email),
        emergency_contact_name = COALESCE($14, emergency_contact_name),
        emergency_contact_phone = COALESCE($15, emergency_contact_phone),
        work_permit_status = COALESCE($16, work_permit_status),
        work_permit_expiry = COALESCE($17, work_permit_expiry),
        health_insurance_provider = COALESCE($18, health_insurance_provider),
        tax_id = COALESCE($19, tax_id),
        probation_end_date = COALESCE($20, probation_end_date),
        contract_end_date = COALESCE($21, contract_end_date),
        last_promotion_date = COALESCE($22, last_promotion_date)
      WHERE id = $23
      RETURNING *
    `, [
      updates.job_title,
      updates.mobile_number,
      updates.job_level,
      updates.salary,
      updates.leave_balance,
      updates.starting_date,
      updates.gender,
      updates.marital_status,
      updates.address,
      department_id,
      team_id,
      updates.date_of_birth,
      updates.personal_email,
      updates.emergency_contact_name,
      updates.emergency_contact_phone,
      updates.work_permit_status,
      updates.work_permit_expiry,
      updates.health_insurance_provider,
      updates.tax_id,
      updates.probation_end_date,
      updates.contract_end_date,
      updates.last_promotion_date,
      id
    ]);

    // Fetch updated profile data
    const result = await client.query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.company_name,
        e.*,
        d.name as department,
        t.name as team_name,
        CONCAT(manager_u.first_name, ' ', manager_u.last_name) as manager_name,
        (SELECT name FROM roles r 
         JOIN user_roles ur ON r.id = ur.role_id 
         WHERE ur.user_id = u.id 
         LIMIT 1) as role
      FROM users u
      LEFT JOIN employees e ON u.id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN employees manager_e ON e.manager_id = manager_e.id
      LEFT JOIN users manager_u ON manager_e.id = manager_u.id
      LEFT JOIN companies c ON u.company_name = c.company_name
      WHERE u.id = $1
    `, [id]);

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating employee:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to update employee',
      details: error
    });
  } finally {
    client.release();
  }
});

export default router; 