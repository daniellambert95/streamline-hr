import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import pool from '../config/db';

const router = Router();

router.get('/employee-analytics', authenticateJWT, async (req, res) => {
  const user = (req as any).user;
  
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE e.status = 'active') as active_employees,
        COUNT(*) FILTER (WHERE e.status != 'active') as inactive_employees,
        COUNT(DISTINCT t.id) as total_teams,
        COUNT(DISTINCT m.id) as total_managers,
        COUNT(*) FILTER (WHERE e.starting_date >= NOW() - INTERVAL '30 days') as new_hires,
        AVG(DATE_PART('year', NOW()) - DATE_PART('year', e.starting_date)) as avg_tenure,
        COUNT(*) FILTER (WHERE e.status = 'onboarding') as pending_invites
      FROM employees e
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN managers m ON e.id = m.id
      WHERE e.company_id = (
        SELECT id FROM companies WHERE user_id = $1
      )
    `, [user.id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching employee analytics:', error);
    res.status(500).json({ error: 'Failed to fetch employee analytics' });
  }
});

export default router;
