import { query, Router } from 'express';
import pool from '../config/db';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Get user profile with employee data
router.get('/profile', authenticateJWT, async (req, res) => {
  const user = (req as any).user;

  try {
    const query = `
      SELECT 
        u.first_name,
        u.last_name,
        u.email,
        e.job_title,
        e.starting_date,
        e.mobile_number,
        e.job_level,
        e.leave_balance,
        e.salary,
        e.bank_details,
        e.id_document,
        e.employment_status,
        e.employment_type,
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
        c.company_name,
        c.industry,
        c.address as company_address,
        d.name as department,
        t.name as team_name,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name
      FROM users u
      LEFT JOIN employees e ON u.id = e.id
      LEFT JOIN companies c ON e.company_id = c.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN employees manager_e ON e.manager_id = manager_e.id
      LEFT JOIN users m ON manager_e.id = m.id
      WHERE u.id = $1
    `;

    const { rows } = await pool.query(query, [user.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }

    console.log('Profile data found:', rows[0]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile
router.put('/profile/:id', authenticateJWT, async (req, res) => {
  const userId = parseInt(req.params.id);
  const userData = req.body;
  
  // Ensure user can only update their own profile
  if (req.user?.id !== userId) {
    return res.status(403).json({ error: 'Unauthorized to update this profile' });
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Update users table
    const userUpdateQuery = `
      UPDATE users
      SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email)
      WHERE id = $4
      RETURNING *;
    `;

    const userResult = await client.query(userUpdateQuery, [
      userData.first_name,
      userData.last_name,
      userData.email,
      userId
    ]);

    // Update employees table
    const employeeUpdateQuery = `
      UPDATE employees
      SET 
        job_title = COALESCE($1, job_title),
        job_level = COALESCE($2, job_level),
        mobile_number = COALESCE($3, mobile_number),
        starting_date = COALESCE($4, starting_date),
        personal_email = COALESCE($5, personal_email),
        date_of_birth = COALESCE($6, date_of_birth),
        gender = COALESCE($7, gender),
        marital_status = COALESCE($8, marital_status),
        address = COALESCE($9, address),
        emergency_contact_name = COALESCE($10, emergency_contact_name),
        emergency_contact_phone = COALESCE($11, emergency_contact_phone),
        work_permit_status = COALESCE($12, work_permit_status),
        work_permit_expiry = COALESCE($13, work_permit_expiry),
        health_insurance_provider = COALESCE($14, health_insurance_provider),
        tax_id = COALESCE($15, tax_id),
        probation_end_date = COALESCE($16, probation_end_date),
        contract_end_date = COALESCE($17, contract_end_date),
        last_promotion_date = COALESCE($18, last_promotion_date),
        salary = COALESCE($19, salary),
        leave_balance = COALESCE($20, leave_balance)
      WHERE id = $21
      RETURNING *;
    `;

    const employeeResult = await client.query(employeeUpdateQuery, [
      userData.job_title,
      userData.job_level,
      userData.mobile_number,
      userData.starting_date,
      userData.personal_email,
      userData.date_of_birth,
      userData.gender,
      userData.marital_status,
      userData.address,
      userData.emergency_contact_name,
      userData.emergency_contact_phone,
      userData.work_permit_status,
      userData.work_permit_expiry,
      userData.health_insurance_provider,
      userData.tax_id,
      userData.probation_end_date,
      userData.contract_end_date,
      userData.last_promotion_date,
      userData.salary,
      userData.leave_balance,
      userId
    ]);

    await client.query('COMMIT');

    // Combine user and employee data
    const updatedProfile = {
      ...userResult.rows[0],
      ...employeeResult.rows[0]
    };

    res.json(updatedProfile);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  } finally {
    client.release();
  }
});

export default router;