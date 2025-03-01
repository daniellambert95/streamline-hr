import { Pool } from 'pg';
import { User, UserCreationDTO, UserUpdateDTO } from '../types/user.types';
import { DatabaseError } from '../../../shared/errors/application.errors';
import { Employee } from '../../employees/types/employee.types';

export class UserModel {
  constructor(private pool: Pool) {}

  async findById(id: number): Promise<User | null> {
    const query = `
      SELECT u.*, 
        r.name as role
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = $1
    `;

    try {
      const { rows } = await this.pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new DatabaseError('Error finding user');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT u.*, 
        r.name as role
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE LOWER(u.email) = LOWER($1)
    `;

    try {
      const { rows } = await this.pool.query(query, [email]);
      return rows[0] || null;
    } catch (error) {
      throw new DatabaseError('Error finding user by email');
    }
  }

  async findByCompany(companyName: string): Promise<User[]> {
    const query = `
      SELECT u.*, 
        r.name as role
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.company_name = $1
    `;

    try {
      const { rows } = await this.pool.query(query, [companyName]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Error finding users by company');
    }
  }

  async create(data: UserCreationDTO): Promise<User> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const userResult = await client.query(`
        INSERT INTO users (
          email, password, first_name, last_name,
          company_name, subscription, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'active')
        RETURNING *
      `, [
        data.email.toLowerCase(),
        data.password,
        data.first_name,
        data.last_name,
        data.company_name,
        data.subscription || 'basic'
      ]);

      await client.query('COMMIT');
      return userResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw new DatabaseError('Error creating user');
    } finally {
      client.release();
    }
  }

  async update(id: number, data: UserUpdateDTO): Promise<User> {
    const query = `
      UPDATE users
      SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        status = COALESCE($4, status),
        user_image_path = COALESCE($5, user_image_path),
        subscription = COALESCE($6, subscription),
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;

    try {
      const { rows } = await this.pool.query(query, [
        data.first_name,
        data.last_name,
        data.email?.toLowerCase(),
        data.status,
        data.user_image_path,
        data.subscription,
        id
      ]);
      return rows[0];
    } catch (error) {
      throw new DatabaseError('Error updating user');
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
}
