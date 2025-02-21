import { Router } from "express";
import pool from "../config/db";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

// Get teams for company
router.get('/', authenticateJWT, async (req, res) => {
  const user = (req as any).user;
  
  try {
    const result = await pool.query(`
      SELECT t.* 
      FROM teams t
      JOIN companies c ON t.company_id = c.id
      WHERE c.user_id = $1
    `, [user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Add new team
router.post('/', authenticateJWT, async (req, res) => {
  const user = (req as any).user;
  const { name } = req.body;
  
  try {
    // Get company_id first
    const companyResult = await pool.query(
      'SELECT id FROM companies WHERE user_id = $1',
      [user.id]
    );
    
    const companyId = companyResult.rows[0].id;
    
    // Create new team
    const result = await pool.query(`
      INSERT INTO teams (name, company_id)
      VALUES ($1, $2)
      RETURNING id, name
    `, [name, companyId]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
});

export default router; 