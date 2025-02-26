import { Request, Response } from 'express';
import pool from '../../../shared/config/database_client';

export class ManagerController {
  static async getAll(req: Request, res: Response) {
    const user = req.user;
    try {
      const result = await pool.query(`
        SELECT 
          e.id,
          u.first_name,
          u.last_name,
          u.email,
          e.job_title,
          e.department_id,
          m.can_approve_time_off,
          m.can_hire,
          m.can_edit_salary
        FROM employees e
        JOIN users u ON e.id = u.id
        JOIN managers m ON e.id = m.employee_id
        JOIN companies c ON e.company_id = c.id
        WHERE e.company_id = (
          SELECT company_id 
          FROM employees 
          WHERE id = $1
        )
      `, [user.id]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching managers:', error);
      res.status(500).json({ error: 'Failed to fetch managers' });
    }
  }

  static async create(req: Request, res: Response) {
    const { employee_id, department_id, permissions } = req.body;
    const user = req.user;
    
    try {
      // Verify employee belongs to user's company
      const verifyResult = await pool.query(`
        SELECT e.* 
        FROM employees e
        WHERE e.id = $1 
        AND e.company_id = (
          SELECT company_id 
          FROM employees 
          WHERE id = $2
        )
      `, [employee_id, user.id]);
      
      if (verifyResult.rows.length === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      
      const result = await pool.query(`
        INSERT INTO managers (
          employee_id,
          department_id,
          can_approve_time_off,
          can_hire,
          can_edit_salary
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [
        employee_id,
        department_id,
        permissions?.can_approve_time_off || false,
        permissions?.can_hire || false,
        permissions?.can_edit_salary || false
      ]);
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating manager:', error);
      res.status(500).json({ error: 'Failed to create manager' });
    }
  }
} 