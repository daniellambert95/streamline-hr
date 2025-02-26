import { Pool } from 'pg';
import { SignupForm } from '../types/auth.types';
import { UserModel } from '../../users/models/user.model';
import bcrypt from '@node-rs/bcrypt';
import { DatabaseError } from '../../../shared/errors/application.errors';
import { UserRole } from '../../users/types/user.types';

export class AuthModel {
  private userModel: UserModel;
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.userModel = new UserModel(pool);
  }

  async findUserByEmail(email: string): Promise<any> {
    const user = await this.userModel.findByEmail(email);
    if (!user) return null;

    // Get company_id separately since it's not in UserModel
    const companyResult = await this.pool.query(`
      SELECT id as company_id 
      FROM companies 
      WHERE company_name = $1
    `, [user.company_name]);

    return {
      ...user,
      role: user.role as UserRole,
      company_id: companyResult.rows[0]?.company_id
    };
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.verify(password, hashedPassword);
  }

  async createUser(userData: SignupForm): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Create company first
      await client.query(`
        INSERT INTO companies (company_name)
        VALUES ($1)
        ON CONFLICT (company_name) DO NOTHING
      `, [userData.company_name]);

      // Use UserModel to create user
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.userModel.create({
        ...userData,
        password: hashedPassword
      });

      // Assign admin role
      await client.query(`
        WITH role_id AS (
          SELECT id FROM roles WHERE name = 'admin'
        )
        INSERT INTO user_roles (user_id, role_id)
        SELECT $1, id FROM role_id
      `, [user.id]);

      // Get company_id
      const companyResult = await client.query(`
        SELECT id as company_id 
        FROM companies 
        WHERE company_name = $1
      `, [userData.company_name]);

      await client.query('COMMIT');

      return {
        ...user,
        role: 'admin',
        company_id: companyResult.rows[0].company_id
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw new DatabaseError('Error creating user');
    } finally {
      client.release();
    }
  }
} 