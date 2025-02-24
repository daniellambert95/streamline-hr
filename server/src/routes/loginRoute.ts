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


// POST /api/v1/users/login
router.post('/login', async (req, res) => {
  const password = req.body.password;
  const email = req.body.email.toLowerCase().trim(); // Normalize email
  
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
        e.leave_balance,
        e.personal_email,
        e.date_of_birth,
        e.gender,
        e.marital_status,
        e.address,
        e.emergency_contact_name,
        e.emergency_contact_phone,
        e.work_permit_status,
        e.work_permit_expiry,
        e.health_insurance_provider,
        e.tax_id,
        e.probation_end_date,
        e.contract_end_date,
        e.last_promotion_date,
        e.employment_status,
        e.employment_type,
        r.name as role
      FROM users u
      LEFT JOIN companies c ON u.company_name = c.company_name
      LEFT JOIN employees e ON u.id = e.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE LOWER(u.email) = LOWER($1)
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

    
    const companyName = user.company_name;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
        first_name: user.first_name,
        last_name: user.last_name,
        company_name: companyName
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ 
      token, 
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
        company_name: companyName,
        first_name: user.first_name,
        last_name: user.last_name,
        job_title: user.job_title,
        job_level: user.job_level,
        starting_date: user.starting_date,
        mobile_number: user.mobile_number,
        salary: user.salary,
        leave_balance: user.leave_balance,
        personal_email: user.personal_email,
        date_of_birth: user.date_of_birth,
        gender: user.gender,
        marital_status: user.marital_status,
        address: user.address,
        emergency_contact_name: user.emergency_contact_name,
        emergency_contact_phone: user.emergency_contact_phone,
        work_permit_status: user.work_permit_status,
        work_permit_expiry: user.work_permit_expiry,
        health_insurance_provider: user.health_insurance_provider,
        tax_id: user.tax_id,
        probation_end_date: user.probation_end_date,
        contract_end_date: user.contract_end_date,
        last_promotion_date: user.last_promotion_date,
        employment_status: user.employment_status,
        employment_type: user.employment_type
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  
export default router;