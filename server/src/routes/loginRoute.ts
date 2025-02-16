import { Router } from 'express';
import pool from '../db';
import bcrypt from '@node-rs/bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
const JWT_EXPIRES_IN = '4h'; // Token expiration time


// Login (Authenticate a user)
router.post('/login', async (req, res) => {
  // Delete the console.log statement
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
  
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    try {
      // Retrieve the user by email
      const query = `SELECT id, email, password, first_name, last_name, subscription FROM users WHERE email = $1;`;
      const { rows } = await pool.query(query, [email]);
  
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      const user = rows[0];
  
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.verify(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Generate JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          subscription: user.subscription,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
  
      // Respond with the token and user details (excluding password)
      res.status(200).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  export default router;