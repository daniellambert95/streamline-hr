import { Request, Response } from 'express';
import pool from '../../../shared/config/database_client';

export class DepartmentController {
  static async getAll(req: Request, res: Response) {
    const user = req.user;
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
        INSERT INTO departments (name, company_id)
        VALUES ($1, $2)
        RETURNING *
      `, [name, companyId]);
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating department:', error);
      res.status(500).json({ error: 'Failed to create department' });
    }
  }

  static async update(req: Request, res: Response) {
    const user = req.user;
    const { id } = req.params;
    const { name, description } = req.body;
    
    try {
      // Verify department belongs to user's company
      const verifyResult = await pool.query(`
        SELECT d.* 
        FROM departments d
        JOIN companies c ON d.company_id = c.id
        JOIN users u ON u.company_name = c.company_name
        WHERE d.id = $1 AND u.id = $2
      `, [id, user.id]);
      
      if (verifyResult.rows.length === 0) {
        return res.status(404).json({ error: 'Department not found' });
      }
      
      const result = await pool.query(`
        UPDATE departments 
        SET name = $1, description = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `, [name, description, id]);
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating department:', error);
      res.status(500).json({ error: 'Failed to update department' });
    }
  }

  static async delete(req: Request, res: Response) {
    const user = req.user;
    const { id } = req.params;
    
    try {
      // Verify department belongs to user's company
      const verifyResult = await pool.query(`
        SELECT d.* 
        FROM departments d
        JOIN companies c ON d.company_id = c.id
        JOIN users u ON u.company_name = c.company_name
        WHERE d.id = $1 AND u.id = $2
      `, [id, user.id]);
      
      if (verifyResult.rows.length === 0) {
        return res.status(404).json({ error: 'Department not found' });
      }
      
      await pool.query('DELETE FROM departments WHERE id = $1', [id]);
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting department:', error);
      res.status(500).json({ error: 'Failed to delete department' });
    }
  }

  // Add other controller methods as needed
} 