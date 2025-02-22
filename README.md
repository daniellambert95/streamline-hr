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
- 📅 Leave Management
- 👥 Team Management
- 🏢 Department Management

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
│   │   │   ├── employees/     # Employee-related components
│   │   │   ├── forms/         # Form components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── modals/        # Modal components
│   │   │   └── ui/            # UI components
│   │   ├── pages/             # Page components
│   │   │   ├── private/       # Protected routes
│   │   │   └── public/        # Public routes
│   │   ├── services/          # API services
│   │   │   └── api/          # API endpoints and configuration
│   │   │       └── endpoints/ # API endpoint services
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
│   │   ├── routes/            # API route handlers
│   │   ├── services/          # Business logic services
│   │   ├── middleware/        # Express middleware
│   │   ├── config/            # Configuration files
│   │   │   └── db.ts         # Database configuration
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   ├── tests/                # Test files
│   ├── migrations/           # Database migrations
│   └── tsconfig.json         # TypeScript configuration
│
├── scripts/                   # Database and utility scripts
│   ├── setup-db.sh          # Database initialization
│   └── populate-db.sh       # Sample data population
│
├── docker/                    # Docker configuration
│   ├── client/
│   │   └── Dockerfile       # Frontend Dockerfile
│   └── server/
│       └── Dockerfile       # Backend Dockerfile
│
├── docker-compose.yml        # Docker Compose configuration
├── Makefile                 # Make commands
├── .env                     # Environment variables example
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## API Documentation

### Authentication

- POST `/api/v1/auth/login` - User login
- POST `/api/v1/auth/signup` - User registration
- POST `/api/v1/auth/logout` - User logout

### Employee Management

- GET `/api/v1/employees` - List all employees
- POST `/api/v1/employees/create` - Create new employee
- PUT `/api/v1/employees/:id` - Update employee/profile
- DELETE `/api/v1/employees/:id` - Delete employee
- GET `/api/v1/employees/:id` - Get employee details
- GET `/api/v1/employees/profile` - Get current user's profile
- GET `/api/v1/employees/managers` - Get all managers

### Team Management

- GET `/api/v1/teams` - List teams
- POST `/api/v1/teams/create` - Create new team
- PUT `/api/v1/teams/:id` - Update team
- DELETE `/api/v1/teams/:id` - Delete team

### Department Management

- GET `/api/v1/departments` - List departments
- POST `/api/v1/departments/create` - Create department
- PUT `/api/v1/departments/:id` - Update department
- DELETE `/api/v1/departments/:id` - Delete department

### Job Management

- GET `/api/v1/jobs` - List job listings
- POST `/api/v1/jobs` - Create job listing
- PUT `/api/v1/jobs/:id` - Update job listing
- DELETE `/api/v1/jobs/:id` - Delete job listing

### Analytics

- GET `/api/v1/analytics/vacancy-trends` - Get vacancy trends
- GET `/api/v1/analytics/hiring-stats` - Get hiring statistics
- GET `/api/v1/analytics/department-stats` - Get department statistics
- GET `/api/v1/employee-management/analytics` - Get employee analytics
