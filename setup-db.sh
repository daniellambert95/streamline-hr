#!/bin/bash

# Load environment variables from .env file
set -a
[ -f .env ] && source .env
set +a

set -e  # Exit on error
trap 'echo "An error occurred. Exiting..."; exit 1' ERR

# Instead of a fixed sleep, you could use a loop to check for connection
until docker exec -i postgres_streamline_hr pg_isready -U ${POSTGRES_USER}; do
  echo "Waiting for PostgreSQL to start..."
  sleep 2
done

echo "Setting up the database schema..."

docker exec -i postgres_streamline_hr psql -U ${POSTGRES_USER} -d $POSTGRES_DB <<-EOSQL

  -- Users Table
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'recruiter', 'employee')),
    manager BOOLEAN DEFAULT FALSE,
    subscription VARCHAR(50) NOT NULL DEFAULT 'basic',
    user_image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Companies Table
  CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    address TEXT,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Teams Table
  CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Employees Table
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY REFERENCES users(id),
    company_id INTEGER REFERENCES companies(id),
    team_id INTEGER REFERENCES teams(id),
    manager_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    job_title VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    starting_date DATE,
    mobile_number VARCHAR(20),
    job_level VARCHAR(50),
    holiday_time INTEGER DEFAULT 25,
    salary VARCHAR(50),
    bank_details TEXT,
    id_document VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- Job Listings Table
  CREATE TABLE IF NOT EXISTS job_listings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    industry VARCHAR(100),
    type VARCHAR(50) CHECK (type IN ('full-time', 'part-time', 'contract')),
    salary VARCHAR(50),
    hours VARCHAR(50),
    status VARCHAR(50) CHECK (status IN ('open', 'closed', '1st round', '2nd round', '3rd round', 'offer sent', 'pending approval')),
    responsibilities TEXT,
    educational_requirements TEXT,
    experience_requirements TEXT,
    desired_skills TEXT,
    qualifications TEXT,
    benefits TEXT,
    incentives TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Job Interviewers (for many-to-many relation)
  CREATE TABLE IF NOT EXISTS job_interviewers (
    job_listing_id INTEGER REFERENCES job_listings(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (job_listing_id, user_id)
  );

  -- Applicants Table
  CREATE TABLE IF NOT EXISTS applicants (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    job_listing_id INTEGER REFERENCES job_listings(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    resume_path VARCHAR(255),
    cover_letter_path VARCHAR(255),
    linkedin_url VARCHAR(255),
    status VARCHAR(50) CHECK (status IN ('pending', 'under_review', 'interviewing', 'rejected', 'accepted')),
    applied_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- Applicant Notes Table
  CREATE TABLE IF NOT EXISTS applicant_notes (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- Notifications Table
  CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status VARCHAR CHECK (status IN ('read', 'unread')),
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- Time Off Requests
  CREATE TABLE IF NOT EXISTS time_off_requests (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    manager_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Audit Logs Table
  CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ACCESS')),
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

  -- Print success message
  SELECT 'Database setup complete!' AS status;
EOSQL

echo "Database schema setup complete!"