import { Router } from 'express';
import pool from '../db';
import bcrypt from '@node-rs/bcrypt';
import dotenv from 'dotenv';
import loginRouter from './loginRoute';
dotenv.config();


const router = Router();

// Signup (Create a new user)
router.post('/signup', async (req, res) => {
  console.log('Signup request received:', req.body);
  const { email, password, company_name, subscription } = req.body;

  // Validate required fields
  if (!email || !password || !company_name) {
    return res.status(400).json({ error: 'Email, password, and company name are required' });
  }

  try {
    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Check if company name already exists
    const existingCompany = await pool.query(
      'SELECT id FROM companies WHERE company_name = $1',
      [company_name]
    );

    if (existingCompany.rows.length > 0) {
      return res.status(400).json({ error: 'Company name already exists' });
    }

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const userQuery = `
        INSERT INTO users (email, password, subscription, role)
        VALUES ($1, $2, $3, 'admin')
        RETURNING id, email, subscription, created_at;
      `;
      const userValues = [email, hashedPassword, subscription];
      const userResult = await client.query(userQuery, userValues);
      const user = userResult.rows[0];

      // Insert company
      const companyQuery = `
        INSERT INTO companies (user_id, company_name)
        VALUES ($1, $2)
        RETURNING id, company_name, created_at;
      `;
      const companyValues = [user.id, company_name];
      const companyResult = await client.query(companyQuery, companyValues);

      await client.query('COMMIT');

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          subscription: user.subscription,
          created_at: user.created_at,
        },
        company: companyResult.rows[0],
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error signing up user:', err);
    if ((err as any).code === '23505') {
      // Check which unique constraint was violated
      if ((err as any).constraint === 'users_email_key') {
        res.status(400).json({ error: 'Email already exists' });
      } else if ((err as any).constraint === 'companies_company_name_key') {
        res.status(400).json({ error: 'Company name already exists' });
      } else {
        res.status(400).json({ error: 'Duplicate entry' });
      }
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.use('/login', loginRouter);


export default router;