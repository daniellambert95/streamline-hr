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

// Update profile
router.put('/update-profile', authenticateJWT, async (req, res) => {
  const user = (req as any).user;
  const updates = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update users table
    await client.query(`
      UPDATE users 
      SET first_name = $1, last_name = $2, email = $3
      WHERE id = $4
    `, [updates.first_name, updates.last_name, updates.email, user.id]);

    // Update or insert employee record
    const employeeExists = await client.query('SELECT 1 FROM employees WHERE id = $1', [user.id]);
    
    if (employeeExists.rows.length > 0) {
      await client.query(`
        UPDATE employees 
        SET job_title = $1, mobile_number = $2, job_level = $3,
            salary = $4, leave_balance = $5, starting_date = $6
        WHERE id = $7
      `, [
        updates.job_title,
        updates.mobile_number,
        updates.job_level,
        updates.salary,
        updates.leave_balance,
        updates.starting_date,
        user.id
      ]);
    } else {
      await client.query(`
        INSERT INTO employees (
          id, job_title, mobile_number, job_level,
          salary, leave_balance, starting_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        user.id,
        updates.job_title,
        updates.mobile_number,
        updates.job_level,
        updates.salary,
        updates.leave_balance,
        updates.starting_date
      ]);
    }

    // Fetch updated profile
    const updatedProfile = await client.query(`
      SELECT 
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
    `, [user.id]);

    await client.query('COMMIT');
    res.json(updatedProfile.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

export default router;