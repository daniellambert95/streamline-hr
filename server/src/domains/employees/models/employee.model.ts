import { Pool } from 'pg';
import { DatabaseError, ValidationError } from '../../../shared/errors/application.errors';
import { Employee, EmployeeFormData } from '../types/employee.types';

export class EmployeeModel {
  constructor(private pool: Pool) {}

  async findById(userId: number): Promise<Employee> {
    const query = `
      SELECT 
        e.*,
        u.email,
        u.first_name,
        u.last_name,
        u.company_name,
        d.name as department_name,
        t.name as team_name,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name
      FROM employees e
      JOIN users u ON e.id = u.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN employees manager_e ON e.manager_id = manager_e.id
      LEFT JOIN users m ON manager_e.id = m.id
      WHERE e.id = $1
    `;

    try {
      const { rows } = await this.pool.query(query, [userId]);
      if (rows.length === 0) {
        throw new ValidationError('Employee not found');
      }
      return rows[0];
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError('Error finding employee');
    }
  }

  async findByCompanyId(companyId: number): Promise<Employee[]> {
    const query = `
      SELECT 
        e.*,
        u.email,
        u.first_name,
        u.last_name,
        d.name as department_name,
        t.name as team_name,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name
      FROM employees e
      JOIN users u ON e.id = u.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN employees manager_e ON e.manager_id = manager_e.id
      LEFT JOIN users m ON manager_e.id = m.id
      WHERE e.company_id = $1
    `;

    try {
      const { rows } = await this.pool.query(query, [companyId]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Error finding employees');
    }
  }

  async create(data: EmployeeFormData, creatorId: number): Promise<Employee> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get company_name from the company_id
      const companyResult = await client.query(`
        SELECT company_name 
        FROM companies 
        WHERE id = $1
      `, [data.company_id]);

      if (companyResult.rows.length === 0) {
        throw new ValidationError('Company not found');
      }

      // Create user first with company_name instead of company_id
      const userResult = await client.query(`
        INSERT INTO users (
          email, password, status, 
          first_name, last_name,
          company_name
        )
        VALUES ($1, $2, 'active', $3, $4, $5)
        RETURNING id
      `, [
        data.email.toLowerCase(),
        data.password,
        data.first_name,
        data.last_name,
        companyResult.rows[0].company_name
      ]);
      
      const userId = userResult.rows[0].id;

      // Assign role to the user
      await client.query(`
        WITH selected_role AS (
          SELECT id FROM roles WHERE name = $1
        )
        INSERT INTO user_roles (user_id, role_id)
        SELECT $2, id FROM selected_role
      `, [data.role || 'employee', userId]);

      // Create employee record (company_id is stored here instead)
      const employeeResult = await client.query(`
        INSERT INTO employees (
          id, company_id, department_id, team_id,
          job_title, starting_date, employment_status,
          employment_type, salary, manager_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        userId,
        data.company_id,
        data.department_id,
        data.team_id,
        data.job_title,
        data.starting_date,
        data.employment_status || 'active',
        data.employment_type || 'full_time',
        data.salary,
        data.manager_id
      ]);

      await client.query('COMMIT');
      return {
        ...employeeResult.rows[0],
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw new DatabaseError('Error creating employee');
    } finally {
      client.release();
    }
  }

  async update(id: number, data: Partial<Employee>): Promise<Employee> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update user table if name or email changes
      if (data.first_name || data.last_name || data.email) {
        await client.query(`
          UPDATE users
          SET 
            first_name = COALESCE($1, first_name),
            last_name = COALESCE($2, last_name),
            email = COALESCE($3, email),
            updated_at = NOW()
          WHERE id = $4
        `, [
          data.first_name,
          data.last_name,
          data.email,
          id
        ]);
      }

      // Handle department name to ID conversion
      let departmentId = data.department_id;
      if (data.department_name && !departmentId) {
        const deptResult = await client.query(`
          SELECT id FROM departments WHERE name = $1
        `, [data.department_name]);
        departmentId = deptResult.rows[0]?.id || null;
      }

      // Handle team name to ID conversion
      let teamId = data.team_id;
      if (data.team_name && !teamId) {
        const teamResult = await client.query(`
          SELECT id FROM teams WHERE name = $1
        `, [data.team_name]);
        teamId = teamResult.rows[0]?.id || null;
      }

      // Handle manager name to ID conversion
      let managerId = data.manager_id;
      if (data.manager_name && !managerId) {
        const managerResult = await client.query(`
          SELECT u.id FROM users u 
          WHERE CONCAT(u.first_name, ' ', u.last_name) = $1
        `, [data.manager_name]);
        managerId = managerResult.rows[0]?.id || null;
      }

      // Update employee record
      const result = await client.query(`
        UPDATE employees
        SET 
          department_id = COALESCE($1, department_id),
          team_id = COALESCE($2, team_id),
          job_title = COALESCE($3, job_title),
          salary = COALESCE($4, salary),
          employment_status = COALESCE($5, employment_status),
          employment_type = COALESCE($6, employment_type),
          manager_id = COALESCE($7, manager_id),
          mobile_number = COALESCE($8, mobile_number),
          job_level = COALESCE($9, job_level),
          personal_email = COALESCE($10, personal_email),
          date_of_birth = COALESCE($11, date_of_birth),
          gender = COALESCE($12, gender),
          marital_status = COALESCE($13, marital_status),
          address = COALESCE($14, address),
          emergency_contact_name = COALESCE($15, emergency_contact_name),
          emergency_contact_phone = COALESCE($16, emergency_contact_phone),
          work_permit_status = COALESCE($17, work_permit_status),
          work_permit_expiry = COALESCE($18, work_permit_expiry),
          health_insurance_provider = COALESCE($19, health_insurance_provider),
          tax_id = COALESCE($20, tax_id),
          probation_end_date = COALESCE($21, probation_end_date),
          contract_end_date = COALESCE($22, contract_end_date),
          last_promotion_date = COALESCE($23, last_promotion_date),
          leave_balance = COALESCE($24, leave_balance),
          updated_at = NOW()
        WHERE id = $25
        RETURNING *
      `, [
        departmentId,
        teamId,
        data.job_title,
        data.salary,
        data.employment_status,
        data.employment_type,
        managerId,
        data.mobile_number,
        data.job_level,
        data.personal_email,
        data.date_of_birth,
        data.gender,
        data.marital_status,
        data.address,
        data.emergency_contact_name,
        data.emergency_contact_phone,
        data.work_permit_status,
        data.work_permit_expiry,
        data.health_insurance_provider,
        data.tax_id,
        data.probation_end_date,
        data.contract_end_date,
        data.last_promotion_date,
        data.leave_balance,
        id
      ]);

      if (result.rows.length === 0) {
        throw new ValidationError('Employee not found');
      }

      await client.query('COMMIT');
      
      // Return the updated employee with joined data
      return this.findById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error('Employee update error:', error);
      throw new DatabaseError('Error updating employee');
    } finally {
      client.release();
    }
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const query = `
      SELECT id FROM users WHERE email = $1
    `;

    try {
      const { rows } = await this.pool.query(query, [email.toLowerCase()]);
      return rows[0] || null;
    } catch (error) {
      throw new DatabaseError('Error checking email existence');
    }
  }

  async findByManagerId(managerId: number): Promise<Employee[]> {
    const query = `
      SELECT 
        e.*,
        u.email,
        u.first_name,
        u.last_name,
        d.name as department_name,
        t.name as team_name,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name
      FROM employees e
      JOIN users u ON e.id = u.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN employees manager_e ON e.manager_id = manager_e.id
      LEFT JOIN users m ON manager_e.id = m.id
      WHERE e.manager_id = $1
    `;

    try {
      const { rows } = await this.pool.query(query, [managerId]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Error finding team members');
    }
  }

  async updateTeamMember(employeeId: number, managerId: number, updates: Partial<Employee>): Promise<Employee> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Verify employee belongs to manager's team
      const teamCheck = await client.query(`
        SELECT id FROM employees 
        WHERE id = $1 AND manager_id = $2
      `, [employeeId, managerId]);

      if (teamCheck.rows.length === 0) {
        throw new DatabaseError('Employee not found in your team');
      }

      // Update only allowed fields for manager
      const result = await client.query(`
        UPDATE employees
        SET 
          job_title = COALESCE($1, job_title),
          team_id = COALESCE($2, team_id),
          employment_status = COALESCE($3, employment_status),
          job_level = COALESCE($4, job_level)
        WHERE id = $5
        RETURNING *
      `, [
        updates.job_title,
        updates.team_id,
        updates.employment_status,
        updates.job_level,
        employeeId
      ]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw new DatabaseError('Error updating team member');
    } finally {
      client.release();
    }
  }
} 