import { Router } from "express";
import pool from "../db";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

// Get departments for company
router.get('/', authenticateJWT, async (req, res) => {
  const user = (req as any).user;
  
  try {
    const result = await pool.query(`
      SELECT d.* 
      FROM departments d
      JOIN companies c ON d.company_id = c.id
      WHERE c.user_id = $1
    `, [user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

export default router; 