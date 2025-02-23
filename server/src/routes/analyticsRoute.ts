import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import pool from '../config/db';

const router = Router();

router.get('/employee-analytics', authenticateJWT, async (req, res) => {
  const user = (req as any).user;
  
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT e.id) as active_employees,
        COUNT(DISTINCT t.id) as total_teams,
        COUNT(DISTINCT m.id) as total_managers,
        COUNT(*) FILTER (WHERE e.starting_date >= NOW() - INTERVAL '30 days') as new_hires
      FROM employees e
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN managers m ON m.employee_id = e.id
      WHERE e.company_id = (
        SELECT e2.company_id 
        FROM employees e2 
        WHERE e2.id = $1
      )
      AND e.employment_status = 'active'
    `, [user.id]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
