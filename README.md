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

## Database Schema

View the complete database schema and relationships: [**Streamline HR Database Documentation**](https://dbdocs.io/danjlambert95/streamlinehr-v1?view=relationships)

## Prerequisites

- Docker and Docker Compose
- Node.js (v18+)
- PostgreSQL (if running locally)
- Make (for using Makefile commands)

## Getting Started

### Local Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/streamline-hr.git
cd streamline-hr
```

2. Configure environment variables:

   - Create a `.env` file in the root directory:
   - Fill in the required environment variables

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
├── client/                   # Frontend React application
│   ├── src/
│   │   ├── core/             # Core application components
│   │   │   ├── api/          # API client configuration
│   │   │   ├── components/   # Shared UI components
│   │   │   │   ├── common/   # Common UI elements
│   │   │   │   ├── layout/   # Layout components (Sidebar, Navbar)
│   │   │   │   └── ui/       # Basic UI components
│   │   │   └── utils/        # Core utility functions
│   │   ├── domains/          # Domain-driven design structure
│   │   │   ├── analytics/    # Analytics domain
│   │   │   │   ├── components/  # Domain-specific components
│   │   │   │   ├── services/    # API services for this domain
│   │   │   │   └── types/       # Type definitions
│   │   │   ├── auth/         # Authentication domain
│   │   │   ├── dashboard/    # Dashboard domain
│   │   │   ├── employees/    # Employee management domain
│   │   │   ├── organization/ # Organization domain
│   │   │   ├── payroll/      # Payroll domain
│   │   │   ├── performance/  # Performance domain
│   │   │   ├── recruitment/  # Recruitment domain
│   │   │   └── users/        # User management domain
│   │   ├── pages/            # Page components
│   │   │   ├── private/      # Protected routes
│   │   │   └── public/       # Public routes
│   │   ├── index.css         # Global styles
│   │   ├── App.tsx           # Main application component
│   │   └── main.tsx          # Application entry point
│   ├── public/               # Public assets
│   └── vite.config.ts        # Vite configuration
│
├── server/                   # Backend Express application
│   ├── src/
│   │   ├── domains/          # Domain-driven design structure
│   │   │   ├── analytics/    # Analytics domain
│   │   │   ├── auth/         # Authentication domain
│   │   │   ├── dashboard/    # Dashboard domain
│   │   │   ├── employees/    # Employee management domain
│   │   │   ├── organization/ # Organization domain
│   │   │   ├── recruitment/  # Recruitment domain
│   │   │   └── users/        # User management domain
│   │   ├── shared/           # Shared utilities and types
│   │   │   ├── config/       # Configuration
│   │   │   ├── errors/       # Error handling
│   │   │   └── types/        # Shared types
│   │   └── index.ts          # Application entry point
│   ├── tests/                # Test files
│   └── migrations/           # Database migrations
│
├── scripts/                  # Database and utility scripts
│   ├── setup-db.sh           # Database initialization
│   └── populate-db.sh        # Sample data population
│
├── docker/                   # Docker configuration
│   ├── client/
│   │   └── Dockerfile        # Frontend Dockerfile
│   └── server/
│       └── Dockerfile        # Backend Dockerfile
│
├── docker-compose.yml        # Docker Compose configuration
├── Makefile                  # Make commands
├── .env                      # Environment variables example
├── .gitignore                # Git ignore rules
└── README.md                 # Project documentation
```

## Domain Structure

```
domain/
├── controllers/              # Request handlers
├── services/                 # Business logic
├── models/                   # Data access layer
├── routes/                   # Route definitions
├── types/                    # Domain-specific types
├── validators/               # Input validation
└── middleware/               # Domain-specific middleware
```

## API Documentation

### Authentication

- POST `/api/v1/auth/login` - User login
- POST `/api/v1/auth/signup` - User registration
- POST `/api/v1/auth/logout` - User logout

### Employee Management

- GET `/api/v1/employees` - List all employees
- POST `/api/v1/employees/create` - Create new employee
- PUT `/api/v1/employees/:id` - Update employee
- GET `/api/v1/employees/profile` - Get current user's profile
- GET `/api/v1/employees/managers` - Get all managers

### Organization Management

- GET `/api/v1/organization/departments` - List departments
- POST `/api/v1/organization/departments` - Create department
- PUT `/api/v1/organization/departments/:id` - Update department
- DELETE `/api/v1/organization/departments/:id` - Delete department
- GET `/api/v1/organization/teams` - List teams
- POST `/api/v1/organization/teams` - Create team
- PUT `/api/v1/organization/teams/:id` - Update team
- DELETE `/api/v1/organization/teams/:id` - Delete team

### Recruitment

- GET `/api/v1/recruitment/jobs` - List job listings
- POST `/api/v1/recruitment/jobs` - Create job listing
- GET `/api/v1/recruitment/applicants` - List applicants
- GET `/api/v1/recruitment/stats` - Get recruitment statistics

### Analytics

- GET `/api/v1/analytics/employee-analytics` - Get employee analytics

## Error Handling

The application implements a standardized error handling approach with custom error types:

- DatabaseError
- ValidationError
- AuthorizationError
- ConfigError

## Authentication & Authorization

The system uses JWT-based authentication with role-based access control:

- Admin: Full system access
- Manager: Team management and limited HR functions
- Recruiter: Recruitment and applicant management
- Employee: Self-service and basic access
