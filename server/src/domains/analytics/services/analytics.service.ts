import { Pool } from 'pg';
import { EmployeeAnalyticsData } from '../types/analytics.types';

export class AnalyticsService {
  constructor(private pool: Pool) {}

  async getEmployeeAnalytics(userId: number): Promise<EmployeeAnalyticsData> {
    const result = await this.pool.query(`
      SELECT 
        COUNT(DISTINCT e.id) as "activeEmployees",
        COUNT(DISTINCT t.id) as "totalTeams",
        COUNT(DISTINCT m.id) as "totalManagers",
        COUNT(*) FILTER (WHERE e.starting_date >= NOW() - INTERVAL '30 days') as "newHires"
      FROM employees e
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN managers m ON m.employee_id = e.id
      WHERE e.company_id = (
        SELECT e2.company_id 
        FROM employees e2 
        WHERE e2.id = $1
      )
      AND e.employment_status = 'active'
    `, [userId]);
    
    return result.rows[0];
  }
}
