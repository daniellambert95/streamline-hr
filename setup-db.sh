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

  -- Drop all tables in the correct order to handle dependencies
  DROP TABLE IF EXISTS 
    audit_logs,
    time_off_requests,
    notifications,
    applicant_activity,
    applicant_notes,
    applicants,
    job_interviewers,
    job_listings,
    manager_permissions,
    employees,
    managers,
    departments,
    teams,
    companies,
    users,
    roles,
    user_roles
  CASCADE;

  -- Drop the trigger function if it exists
  DROP FUNCTION IF EXISTS update_applicant_last_modified CASCADE;

  -- Create trigger function for last_modified first
  CREATE OR REPLACE FUNCTION update_applicant_last_modified()
  RETURNS TRIGGER AS \$\$
  BEGIN
    NEW.last_modified = NOW();
    RETURN NEW;
  END;
  \$\$ LANGUAGE plpgsql;

  -- Create roles table first
  CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Insert default roles
  INSERT INTO roles (name, description) VALUES
    ('admin', 'Full system access and control'),
    ('recruiter', 'Manage recruitment process and candidates'),
    ('manager', 'Manage employees and teams'),
    ('employee', 'Standard employee access');

  -- Create users table
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    subscription VARCHAR(50) NOT NULL DEFAULT 'basic',
    company_name VARCHAR(255) NOT NULL,
    user_image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Create user_roles junction table
  CREATE TABLE IF NOT EXISTS user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
  );

  CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) UNIQUE NOT NULL,
    industry VARCHAR(100),
    address TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    name VARCHAR(100) NOT NULL,
    head_id INTEGER,
    budget DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY,
    company_id INTEGER,
    team_id INTEGER,
    department_id INTEGER,
    manager_id INTEGER,
    job_title VARCHAR(255),
    starting_date DATE,
    mobile_number VARCHAR(20),
    job_level VARCHAR(50),
    leave_balance INTEGER DEFAULT 25,
    salary VARCHAR(50),
    bank_details TEXT,
    id_document VARCHAR(255),
    employment_status VARCHAR(50) DEFAULT 'active',
    employment_type VARCHAR(50) DEFAULT 'full_time',
    personal_email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    marital_status VARCHAR(50) CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    work_permit_status VARCHAR(50),
    work_permit_expiry DATE,
    health_insurance_provider VARCHAR(100),
    tax_id VARCHAR(50),
    probation_end_date DATE,
    contract_end_date DATE,
    last_promotion_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS managers (
    id INTEGER PRIMARY KEY,
    employee_id INTEGER UNIQUE REFERENCES employees(id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES departments(id),
    level VARCHAR(50) CHECK (level IN ('team_lead', 'department_head', 'executive')),
    can_approve_time_off BOOLEAN DEFAULT TRUE,
    can_hire BOOLEAN DEFAULT FALSE,
    can_edit_salary BOOLEAN DEFAULT FALSE,
    max_reports INTEGER DEFAULT 20,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Now add all the foreign key constraints
  ALTER TABLE companies
    ADD CONSTRAINT fk_companies_user FOREIGN KEY (created_by) REFERENCES users(id);

  ALTER TABLE departments
    ADD CONSTRAINT fk_departments_company FOREIGN KEY (company_id) REFERENCES companies(id),
    ADD CONSTRAINT fk_departments_head FOREIGN KEY (head_id) REFERENCES managers(id);

  ALTER TABLE teams
    ADD CONSTRAINT fk_teams_company FOREIGN KEY (company_id) REFERENCES companies(id);

  ALTER TABLE employees
    ADD CONSTRAINT fk_employees_company FOREIGN KEY (company_id) REFERENCES companies(id),
    ADD CONSTRAINT fk_employees_user FOREIGN KEY (id) REFERENCES users(id),
    ADD CONSTRAINT fk_employees_team FOREIGN KEY (team_id) REFERENCES teams(id),
    ADD CONSTRAINT fk_employees_department FOREIGN KEY (department_id) REFERENCES departments(id),
    ADD CONSTRAINT fk_employees_manager FOREIGN KEY (manager_id) REFERENCES users(id);

  ALTER TABLE managers
    ADD CONSTRAINT fk_managers_employee FOREIGN KEY (id) REFERENCES employees(id);

  -- 7. Manager Permissions Table (Depends on managers)
  CREATE TABLE IF NOT EXISTS manager_permissions (
    id SERIAL PRIMARY KEY,
    manager_id INTEGER REFERENCES managers(id) ON DELETE CASCADE,
    permission_name VARCHAR(100),
    granted_by INTEGER REFERENCES managers(id),
    granted_at TIMESTAMP DEFAULT NOW()
  );

  -- 8. Job Listings Table (Depends on companies)
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
    created_at TIMESTAMP DEFAULT NOW(),
    last_modified TIMESTAMP DEFAULT NOW()
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

  -- Create applicant_activity table to track all changes
  CREATE TABLE IF NOT EXISTS applicant_activity (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) CHECK (
      activity_type IN (
        'status_change',
        'note_added',
        'document_added',
        'interview_scheduled',
        'feedback_added'
      )
    ),
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- Create the trigger after all tables are created
  CREATE TRIGGER applicant_last_modified
    BEFORE UPDATE ON applicants
    FOR EACH ROW
    EXECUTE FUNCTION update_applicant_last_modified();

  -- Print success message
  SELECT 'Database setup complete!' AS status;
EOSQL

echo "Database schema setup complete!"