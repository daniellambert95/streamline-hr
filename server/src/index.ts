import express from 'express';
import cors from 'cors';
import uploadRoutes from './routes/uploadRoute';
import jobsRoutes from './routes/jobRoutes';
import signupRoute from './routes/signupRoute';
import profileRoute from './routes/profileRoute';
import userProfileRoute from './routes/userProfileRoute';
import loginRoute from './routes/loginRoute';
import employeeRoute from './routes/employeeRoute';
import teamRoute from './routes/teamRoute';
import departmentRoute from './routes/departmentRoute';
import applicantRoutes from './routes/applicantRoutes';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import employeeManagementRoute from './routes/employeeManagementRoute';
import analyticsRoute from './routes/analyticsRoute';
import profileRouter from './routes/profileRoute';

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
app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/users', signupRoute);
app.use('/api/v1/users', loginRoute);
app.use('/api/v1/users/profile', profileRoute);
app.use('/api/v1/users/user-profile', userProfileRoute);
app.use('/api/v1/jobs', jobsRoutes);
app.use('/api/v1/employees', employeeRoute);
app.use('/api/v1/teams', teamRoute);
app.use('/api/v1/departments', departmentRoute);
app.use('/api/v1/applicants', applicantRoutes);
app.use('/api/v1/employee-management', employeeManagementRoute);
app.use('/api/v1/analytics', analyticsRoute);
app.use('/api/v1/employees', profileRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello from Streamline HR Server!');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${port}`);
});