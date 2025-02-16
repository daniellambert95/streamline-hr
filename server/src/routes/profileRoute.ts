import { Router } from 'express';
import pool from '../db';
import { authenticateJWT } from '../middleware/authMiddleware';


const router = Router();

// Profile Page (Retrieve user details)
router.get('/profile', authenticateJWT, async (req, res) => {
    const user = (req as any).user; // Retrieved from the decoded JWT
  
    // Validate user.id
    if (!user || !user.id) {
      return res.status(400).json({ error: 'Invalid user authentication' });
    }
  
    try {
      const query = `
        SELECT u.first_name, u.last_name, u.email, b.company_name
        FROM users u
        LEFT JOIN companies b ON u.id = b.user_id
        WHERE u.id = $1
      `;
      console.log('User ID:', user.id); // Log user ID
      console.log('Executing query...'); // Log before query execution

      const { rows } = await pool.query(query, [user.id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      console.log('Query executed'); // Log after query execution
      console.log(rows[0]); // Log the query result
      res.status(200).json(rows[0]); // Send the response
    } catch (err) {
      console.error('Error fetching profile:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  export default router;