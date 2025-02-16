import express from 'express';
import cors from 'cors';
import uploadRoutes from './routes/uploadRoute';
import jobsRoutes from './routes/jobsRoute';
import signupRoute from './routes/signupRoute';
import profileRoute from './routes/profileRoute';
import userProfileRoute from './routes/userProfileRoute';
import loginRoute from './routes/loginRoute';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

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
app.use('/api/uploads', uploadRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/users', signupRoute);
app.use('/api/users', profileRoute);
app.use('/api/users', userProfileRoute);
app.use('/api/users', loginRoute)

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello from Streamline HR Server!');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${port}`);
});