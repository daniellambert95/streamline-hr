# Streamline HR - Modern HR ATS and Employee Management System

## Overview

Streamline HR is a comprehensive Human Resource Management System (HRMS) built with modern web technologies. It provides a robust platform for managing employees, recruitment, talent insights, and company operations.

## Features

- 👥 Employee Management
- 📊 Talent Analytics & Insights
- 🎯 Recruitment Pipeline
- 📝 Applicant Tracking
- 👔 Job Listings Management
- 📈 Performance Metrics
- 🔐 Role-based Access Control

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Authentication: JWT
- Containerization: Docker
- Testing: Jest + React Testing Library

## Prerequisites

- Docker and Docker Compose
- Node.js (v18+)
- PostgreSQL (if running locally)
- Make (for using Makefile commands)

## Getting Started

### Environment Setup

1. Create a `.env` file in the root directory:

```bash
# Database Configuration
POSTGRES_USER=XXXX
POSTGRES_PASSWORD=XXXX
POSTGRES_DB=XXXX

# Authentication
JWT_SECRET=XXXX

# API Configuration
VITE_API_DOMAIN=XXXX
```

### Local Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/streamline-hr.git
cd streamline-hr
```

2. Configure environment variables:

   - Copy `.env.example` to `.env`
   - Fill in the required environment variables

3. Build and start the containers:

```bash
make build up
```

4. Initialize the database schema:

```bash
make db-setup
```

5. Create an initial admin user:

   - Navigate to http://localhost:5173/signup
   - Register your first admin account
   - This account will have full system access

6. Populate the database with sample data:

```bash
make populate-db
```

7. Start exploring the application:
   - Navigate to http://localhost:5173
   - Login with your admin credentials
   - Explore the various features and modules

### Available Make Commands

- `make help`: Show all available commands
- `make setup`: Complete project setup
- `make build`: Build Docker containers
- `make up`: Start containers
- `make down`: Stop containers
- `make logs`: View container logs
- `make clean`: Clean up containers and volumes
- `make db-setup` : Initialize database
- `make db-populate` : Add sample data

## Project Structure

```
streamline-hr/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── forms/         # Form components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── modals/        # Modal components
│   │   │   └── ui/            # UI components
│   │   ├── pages/             # Page components
│   │   │   ├── private/       # Protected routes
│   │   │   └── public/        # Public routes
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # React context providers
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   └── assets/            # Static assets
│   ├── public/                # Public assets
│   └── vite.config.ts         # Vite configuration
│
├── server/                     # Backend Express application
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Express middleware
│   │   ├── config/            # Configuration files
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   ├── tests/                # Test files
│   └── tsconfig.json         # TypeScript configuration
│
├── scripts/                   # Database and utility scripts
│   ├── setup-db.sh          # Database initialization
│   └── populate-db.sh       # Sample data population
│
├── docker/                   # Docker configuration
│   ├── client/              # Frontend Docker setup
│   └── server/              # Backend Docker setup
│
├── docker-compose.yml        # Docker Compose configuration
├── Makefile                 # Make commands
├── .env                     # Environment variables example
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## API Documentation

### Authentication

- POST `/api/auth/login` - User login
- POST `/api/auth/signup` - User registration
- POST `/api/auth/logout` - User logout

### Employee Management

- GET `/api/employees` - List all employees
- POST `/api/employees/create` - Create new employee
- PUT `/api/employees/:id` - Update employee/profile
- DELETE `/api/employees/:id` - Delete employee
- GET `/api/employees/:id` - Get employee details
- GET `/api/employees/profile` - Get current user's profile

### Company Management

- GET `/api/companies` - List companies
- POST `/api/companies/create` - Create new company
- PUT `/api/companies/:id` - Update company
- GET `/api/companies/:id` - Get company details

### Team Management

- GET `/api/teams` - List teams
- POST `/api/teams/create` - Create new team
- PUT `/api/teams/:id` - Update team
- DELETE `/api/teams/:id` - Delete team

### Recruitment

- GET `/api/job-listings` - List job listings
- POST `/api/job-listings/create` - Create job listing
- PUT `/api/job-listings/:id` - Update job listing
- DELETE `/api/job-listings/:id` - Delete job listing
- GET `/api/job-listings/:id` - Get job listing details

### Applicants

- GET `/api/applicants` - List applicants
- POST `/api/applicants/create` - Create applicant
- PUT `/api/applicants/:id` - Update applicant status
- GET `/api/applicants/:id` - Get applicant details
- GET `/api/applicants/activity` - Get recent activity
- GET `/api/applicants/stats` - Get application statistics

### Analytics

- GET `/api/analytics/vacancy-trends` - Get vacancy trends
- GET `/api/analytics/hiring-stats` - Get hiring statistics
- GET `/api/analytics/department-stats` - Get department statistics
