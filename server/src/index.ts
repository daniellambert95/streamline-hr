import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Route imports
import { createAuthRouter } from './domains/auth/routes/auth.routes';
import { createUserRouter } from './domains/users/routes/user.routes';
import { createDashboardRouter } from './domains/dashboard/routes/dashboard.routes';
import { createEmployeeRouter } from './domains/employees/routes/employee.route';
import { createOrganizationRouter } from './domains/organization/routes/organization.routes';
import { createRecruitmentRouter } from './domains/recruitment/routes/recruitment.routes';
import { createAnalyticsRouter } from './domains/analytics/routes/analytics.routes';

dotenv.config();

// Initialize Express app
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
}));
const port = 3000;

// Middleware for parsing JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create the uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use('/api/v1/auth', createAuthRouter());
app.use('/api/v1/users', createUserRouter());
app.use('/api/v1/dashboard', createDashboardRouter());
app.use('/api/v1/employees', createEmployeeRouter());
app.use('/api/v1/organization', createOrganizationRouter());
app.use('/api/v1/recruitment', createRecruitmentRouter());
app.use('/api/v1/analytics', createAnalyticsRouter());

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello from Streamline HR Server!');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${port}`);
});