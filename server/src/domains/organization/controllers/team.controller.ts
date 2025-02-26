import { Request, Response } from 'express';
import pool from '../../../shared/config/database_client';

export class TeamController {
  static async getAll(req: Request, res: Response) {
    const user = req.user;
    try {
      const result = await pool.query(`
        SELECT t.* 
        FROM teams t
        JOIN companies c ON t.company_id = c.id
        JOIN users u ON u.company_name = c.company_name
        WHERE u.id = $1
      `, [user.id]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ error: 'Failed to fetch teams' });
    }
  }

  static async create(req: Request, res: Response) {
    const user = req.user;
    const { name } = req.body;
    
    try {
      const companyResult = await pool.query(
        'SELECT id FROM companies WHERE company_name = $1',
        [user.company_name]
      );
      
      if (companyResult.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }
      
      const companyId = companyResult.rows[0].id;
      
      const result = await pool.query(`
        INSERT INTO teams (name, company_id)
        VALUES ($1, $2)
        RETURNING *
      `, [name, companyId]);
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating team:', error);
      res.status(500).json({ error: 'Failed to create team' });
    }
  }

  static async update(req: Request, res: Response) {
    const user = req.user;
    const { id } = req.params;
    const { name, department_id } = req.body;
    
    try {
      // Verify team belongs to user's company
      const verifyResult = await pool.query(`
        SELECT t.* 
        FROM teams t
        JOIN companies c ON t.company_id = c.id
        JOIN users u ON u.company_name = c.company_name
        WHERE t.id = $1 AND u.id = $2
      `, [id, user.id]);
      
      if (verifyResult.rows.length === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      const result = await pool.query(`
        UPDATE teams 
        SET name = $1, department_id = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `, [name, department_id, id]);
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating team:', error);
      res.status(500).json({ error: 'Failed to update team' });
    }
  }

  static async delete(req: Request, res: Response) {
    const user = req.user;
    const { id } = req.params;
    
    try {
      // Verify team belongs to user's company
      const verifyResult = await pool.query(`
        SELECT t.* 
        FROM teams t
        JOIN companies c ON t.company_id = c.id
        JOIN users u ON u.company_name = c.company_name
        WHERE t.id = $1 AND u.id = $2
      `, [id, user.id]);
      
      if (verifyResult.rows.length === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      await pool.query('DELETE FROM teams WHERE id = $1', [id]);
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting team:', error);
      res.status(500).json({ error: 'Failed to delete team' });
    }
  }

  // Add other controller methods as needed
}
