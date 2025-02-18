import { Router } from "express";
import pool from "../db"; // Database connection
import { authenticateJWT } from "../middleware/authMiddleware"; // Authentication middleware

const router = Router();

// 🟢 GET: Fetch Employee Profile
router.get("/user-profile", authenticateJWT, async (req, res) => {
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
        e.holiday_time,
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

    console.log('Executing query for user ID:', user.id);
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

// 🟢 PUT: Update User Profile
router.put("/update-profile", authenticateJWT, async (req, res) => {
  console.log('Received update profile request');
  console.log('Request body:', req.body);
  const user = (req as any).user;
  const updates = req.body;

  try {
    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update users table
      const userQuery = `
        UPDATE users 
        SET 
          first_name = $1, 
          last_name = $2, 
          email = $3,
          updated_at = NOW()
        WHERE id = $4
      `;
      await client.query(userQuery, [
        updates.first_name,
        updates.last_name,
        updates.email,
        user.id
      ]);

      // Check if employee record exists
      const checkEmployeeQuery = `SELECT id FROM employees WHERE id = $1`;
      const employeeExists = await client.query(checkEmployeeQuery, [user.id]);

      if (employeeExists.rows.length > 0) {
        // Update existing employee record
        const employeeQuery = `
          UPDATE employees 
          SET 
            job_title = $1,
            mobile_number = $2,
            job_level = $3,
            salary = $4,
            holiday_time = $5,
            starting_date = $6
          WHERE id = $7
        `;
        await client.query(employeeQuery, [
          updates.job_title,
          updates.mobile_number,
          updates.job_level,
          updates.salary,
          updates.holiday_time,
          updates.starting_date,
          user.id
        ]);
      } else {
        // Insert new employee record
        const employeeQuery = `
          INSERT INTO employees (
            id, job_title, mobile_number, job_level, 
            salary, holiday_time, starting_date
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await client.query(employeeQuery, [
          user.id,
          updates.job_title,
          updates.mobile_number,
          updates.job_level,
          updates.salary,
          updates.holiday_time,
          updates.starting_date
        ]);
      }

      // Fetch updated profile data
      const profileQuery = `
        SELECT 
          u.first_name,
          u.last_name,
          u.email,
          u.role,
          e.job_title,
          e.starting_date,
          e.mobile_number,
          e.job_level,
          e.holiday_time,
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
      const updatedProfile = await client.query(profileQuery, [user.id]);

      await client.query('COMMIT');
      res.json(updatedProfile.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;