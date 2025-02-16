import { Router } from "express";
import pool from "../db"; // Database connection
import { authenticateJWT } from "../middleware/authMiddleware"; // Authentication middleware

const router = Router();

// 🟢 GET: Fetch Employee Profile
router.get("/profile", authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user.id; // Extract user ID from JWT

    // Query to fetch employee details
    const query = `
      SELECT 
        u.first_name, u.last_name, u.email, u.user_image_path, 
        e.job_title, e.starting_date, e.mobile_number, e.job_level, 
        e.salary, e.holiday_time, e.id_document,
        c.company_name, c.industry, c.address
      FROM employees e
      JOIN users u ON e.id = u.id
      JOIN company c ON e.company_id = c.id
      WHERE u.id = $1;
    `;

    const result = await pool.query(query, [userId]);

    // If no employee found, return 404
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee profile not found" });
    }

    // Return profile data
    res.json(result.rows[0]);

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;