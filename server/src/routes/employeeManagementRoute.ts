import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import pool from '../config/db';

const router = Router();

// Get all employees with their details
router.get('/employees', authenticateJWT, async (req, res) => {
  const user = (req as any).user;
  
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        e.job_title,
        e.status,
        d.name as department,
        t.name as team_name,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name,
        e.starting_date
      FROM employees e
      JOIN users u ON e.id = u.id
      LEFT JOIN departments d ON e.department_id = d.id
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

// Get departments with employee counts
router.get('/departments', authenticateJWT, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        d.id,
        d.name,
        COUNT(e.id) as employee_count
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id
      GROUP BY d.id, d.name
      ORDER BY d.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  } finally {
    client.release();
  }
});

// Get teams with their departments
router.get('/teams', authenticateJWT, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        t.id,
        t.name as team_name,
        d.name as department_name,
        COUNT(e.id) as member_count
      FROM teams t
      LEFT JOIN departments d ON t.department_id = d.id
      LEFT JOIN employees e ON t.id = e.team_id
      GROUP BY t.id, t.name, d.name
      ORDER BY d.name, t.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  } finally {
    client.release();
  }
});

// Get employee analytics
router.get('/analytics', authenticateJWT, async (req, res) => {
  const user = (req as any).user;
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        COUNT(DISTINCT e.id) as active_employees,
        COUNT(DISTINCT t.id) as total_teams,
        COUNT(DISTINCT e2.id) as total_managers,
        COUNT(*) FILTER (WHERE e.starting_date >= NOW() - INTERVAL '30 days') as new_hires
      FROM employees e
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN employees e2 ON e2.id = e.id AND (
        e2.job_level IN ('executive', 'department_head', 'team_lead')
        OR EXISTS (
          SELECT 1 FROM employees 
          WHERE manager_id = e2.id
        )
      )
      WHERE e.company_id = (SELECT id FROM companies WHERE user_id = $1)
        AND e.employment_status = 'active'
    `, [user.id]);
    
    res.json({
      activeEmployees: Number(result.rows[0].active_employees) || 0,
      totalTeams: Number(result.rows[0].total_teams) || 0,
      totalManagers: Number(result.rows[0].total_managers) || 0,
      newHires: Number(result.rows[0].new_hires) || 0
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  } finally {
    client.release();
  }
});

export default router; 