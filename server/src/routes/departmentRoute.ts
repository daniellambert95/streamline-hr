import { Router } from "express";
import pool from "../config/db";
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
      JOIN users u ON u.company_name = c.company_name
      WHERE u.id = $1
    `, [user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// Add new department
router.post('/', authenticateJWT, async (req, res) => {
  const user = (req as any).user;
  const { name, description } = req.body;
  
  try {
    // Get company_id using company_name from user
    const companyResult = await pool.query(
      'SELECT id FROM companies WHERE company_name = $1',
      [user.company_name]
    );
    
    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    const companyId = companyResult.rows[0].id;
    
    // Create new department
    const result = await pool.query(`
      INSERT INTO departments (name, company_id)
      VALUES ($1, $2)
      RETURNING id, name, company_id, created_at, updated_at
    `, [name, companyId]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ error: 'Failed to create department' });
  }
});

export default router; 