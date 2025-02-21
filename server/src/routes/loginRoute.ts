import { Router } from 'express';
import pool from '../config/db';
import bcrypt from '@node-rs/bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
const JWT_EXPIRES_IN = '8h'; // Token expiration time


// Login (Authenticate a user)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const query = `
      SELECT 
        u.*,
        c.id as company_id,
        c.company_name,
        e.job_title,
        e.job_level,
        e.team_id,
        e.starting_date,
        e.mobile_number,
        e.salary,
        e.holiday_time
      FROM users u
      LEFT JOIN companies c ON u.id = c.user_id
      LEFT JOIN employees e ON u.id = e.id
      WHERE u.email = $1
    `;
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.verify(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
        first_name: user.first_name,
        last_name: user.last_name
      },
      JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.json({ 
      token, 
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
        company_name: user.company_name,
        first_name: user.first_name,
        last_name: user.last_name,
        job_title: user.job_title,
        job_level: user.job_level,
        starting_date: user.starting_date,
        mobile_number: user.mobile_number,
        salary: user.salary,
        holiday_time: user.holiday_time
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  
export default router;