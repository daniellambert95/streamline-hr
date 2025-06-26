#!/bin/bash

# Load environment variables from .env file
set -a
[ -f .env ] && source .env
set +a

set -e 
trap 'echo "An error occurred. Exiting..."; exit 1' ERR

until docker exec -i postgres_streamline_hr pg_isready -U ${POSTGRES_USER}; do
  echo "Waiting for PostgreSQL to start..."
  sleep 2
done

echo "Setting up the database schema..."

docker exec -i postgres_streamline_hr psql -U ${POSTGRES_USER} -d $POSTGRES_DB <<-EOSQL

  -- Drop all tables in the correct order to handle dependencies
  DROP TABLE IF EXISTS 
    company_settings,
    system_defaults,
    performance_reviews,
    documents,
    audit_logs,
    time_off_requests,
    notifications,
    messages,
    applicant_activity,
    applicant_notes,
    applicants,
    job_interviewers,
    job_listings,
    manager_permissions,
    tasks,
    task_lists,
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
  DROP FUNCTION IF EXISTS audit_trigger_function CASCADE;

  -- Create trigger function for last_modified first
  CREATE OR REPLACE FUNCTION update_applicant_last_modified()
  RETURNS TRIGGER AS \$\$
  BEGIN
    NEW.last_modified = NOW();
    RETURN NEW;
  END;
  \$\$ LANGUAGE plpgsql;

  -- Create audit trigger function
  CREATE OR REPLACE FUNCTION audit_trigger_function()
  RETURNS TRIGGER AS \$\$
  BEGIN
    INSERT INTO audit_logs (user_id, table_name, record_id, action, old_data, new_data)
    VALUES (
      COALESCE(current_setting('app.current_user_id', true)::INTEGER, 0),
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      TG_OP,
      CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
      CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
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

  -- Create companies table
  CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) UNIQUE NOT NULL,
    industry VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    website VARCHAR(255),
    tax_id VARCHAR(50),
    created_by INTEGER, -- Will add FK later
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- NEW: System defaults for configurable options
  CREATE TABLE IF NOT EXISTS system_defaults (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(category, key)
  );

  -- NEW: Company-specific settings (allows customization per company)
  CREATE TABLE IF NOT EXISTS company_settings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'employment_types', 'job_levels', etc.
    key VARCHAR(100) NOT NULL,
    value VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(company_id, category, key)
  );

  -- Create users table (FLEXIBLE - removed rigid status constraint)
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    subscription VARCHAR(50) NOT NULL DEFAULT 'basic',
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    user_image_path VARCHAR(255),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Add foreign key constraint for companies.created_by
  ALTER TABLE companies
    ADD CONSTRAINT fk_companies_created_by FOREIGN KEY (created_by) REFERENCES users(id);

  -- Create user_roles junction table
  CREATE TABLE IF NOT EXISTS user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
  );

  CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    head_id INTEGER,
    budget DECIMAL(15,2),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(company_id, name) -- Prevent duplicate department names per company
  );

  CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(company_id, name) -- Prevent duplicate team names per company
  );

  -- FLEXIBLE employees table (removed most CHECK constraints)
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    manager_id INTEGER,
    job_title VARCHAR(255),
    starting_date DATE,
    mobile_number VARCHAR(20),
    job_level VARCHAR(100),
    leave_balance INTEGER DEFAULT 25 CHECK (leave_balance >= 0), -- Keep numeric validation
    salary_amount DECIMAL(12,2) CHECK (salary_amount > 0), -- Keep numeric validation
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_period VARCHAR(50) DEFAULT 'annual',
    bank_details TEXT, -- TODO: Encrypt in application
    id_document VARCHAR(255),
    employment_status VARCHAR(100) DEFAULT 'active',
    employment_type VARCHAR(100) DEFAULT 'full_time',
    personal_email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(100),
    marital_status VARCHAR(100),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    work_permit_status VARCHAR(50),
    work_permit_expiry DATE,
    health_insurance_provider VARCHAR(100),
    tax_id VARCHAR(50), -- TODO: Encrypt in application
    probation_end_date DATE,
    contract_end_date DATE,
    last_promotion_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    -- Keep date logic constraints
    CONSTRAINT valid_contract_dates CHECK (contract_end_date IS NULL OR contract_end_date >= starting_date),
    CONSTRAINT valid_probation_date CHECK (probation_end_date IS NULL OR probation_end_date >= starting_date)
  );

  -- FLEXIBLE managers table
  CREATE TABLE IF NOT EXISTS managers (
    id INTEGER PRIMARY KEY,
    employee_id INTEGER UNIQUE REFERENCES employees(id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    level VARCHAR(100),
    can_approve_time_off BOOLEAN DEFAULT TRUE,
    can_hire BOOLEAN DEFAULT FALSE,
    can_edit_salary BOOLEAN DEFAULT FALSE,
    max_reports INTEGER DEFAULT 20 CHECK (max_reports > 0), -- Keep numeric validation
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Add foreign key constraints for employees
  ALTER TABLE employees
    ADD CONSTRAINT fk_employees_user FOREIGN KEY (id) REFERENCES users(id),
    ADD CONSTRAINT fk_employees_manager FOREIGN KEY (manager_id) REFERENCES users(id);

  -- Add foreign key constraint for departments.head_id
  ALTER TABLE departments
    ADD CONSTRAINT fk_departments_head FOREIGN KEY (head_id) REFERENCES managers(id);

  -- Add foreign key constraint for managers.id
  ALTER TABLE managers
    ADD CONSTRAINT fk_managers_employee FOREIGN KEY (id) REFERENCES employees(id);

  -- Manager Permissions Table
  CREATE TABLE IF NOT EXISTS manager_permissions (
    id SERIAL PRIMARY KEY,
    manager_id INTEGER REFERENCES managers(id) ON DELETE CASCADE,
    permission_name VARCHAR(100),
    granted_by INTEGER REFERENCES managers(id),
    granted_at TIMESTAMP DEFAULT NOW()
  );

  -- FLEXIBLE Job Listings Table
  CREATE TABLE IF NOT EXISTS job_listings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    industry VARCHAR(100),
    type VARCHAR(100),
    salary_min DECIMAL(12,2) CHECK (salary_min > 0), -- Keep numeric validation
    salary_max DECIMAL(12,2) CHECK (salary_max > 0), -- Keep numeric validation
    salary_currency VARCHAR(3) DEFAULT 'USD',
    hours VARCHAR(50),
    status VARCHAR(100),
    responsibilities TEXT,
    educational_requirements TEXT,
    experience_requirements TEXT,
    desired_skills TEXT,
    qualifications TEXT,
    benefits TEXT,
    incentives TEXT,
    application_deadline DATE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    -- Keep salary range validation
    CONSTRAINT valid_salary_range CHECK (salary_max IS NULL OR salary_min IS NULL OR salary_max >= salary_min)
  );

  -- Job Interviewers (for many-to-many relation)
  CREATE TABLE IF NOT EXISTS job_interviewers (
    job_listing_id INTEGER REFERENCES job_listings(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (job_listing_id, user_id)
  );

  -- FLEXIBLE Applicants Table
  CREATE TABLE IF NOT EXISTS applicants (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    job_listing_id INTEGER REFERENCES job_listings(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    resume_path VARCHAR(255),
    cover_letter_path VARCHAR(255),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    status VARCHAR(100),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5), -- Keep numeric validation
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
    is_internal BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- FLEXIBLE Applicant Activity Table
  CREATE TABLE IF NOT EXISTS applicant_activity (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- FLEXIBLE Notifications Table
  CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_reminder BOOLEAN DEFAULT FALSE,
    reminder_date TIMESTAMP,
    priority VARCHAR(50) DEFAULT 'normal',
    external_delivery JSONB, -- For storing Slack/Gmail delivery preferences
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- FLEXIBLE Messages Table
  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,
    is_important BOOLEAN DEFAULT FALSE,
    thread_id INTEGER REFERENCES messages(id), -- For message threading
    message_type VARCHAR(100) DEFAULT 'direct'
  );  

  -- Task Lists and Tasks
  CREATE TABLE IF NOT EXISTS task_lists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- FLEXIBLE Tasks Table
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    task_list_id INTEGER NOT NULL REFERENCES task_lists(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    due_date DATE,
    status VARCHAR(100) NOT NULL DEFAULT 'pending',
    priority INTEGER CHECK (priority BETWEEN 1 AND 5), -- Keep numeric validation
    estimated_hours DECIMAL(5,2) CHECK (estimated_hours > 0), -- Keep numeric validation
    actual_hours DECIMAL(5,2) CHECK (actual_hours > 0), -- Keep numeric validation
    assigned_to INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
  );

  -- FLEXIBLE Time Off Requests
  CREATE TABLE IF NOT EXISTS time_off_requests (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    manager_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type VARCHAR(100) DEFAULT 'vacation',
    reason TEXT NOT NULL,
    status VARCHAR(100) DEFAULT 'pending',
    days_requested INTEGER GENERATED ALWAYS AS (end_date - start_date + 1) STORED,
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    -- Keep date logic constraints
    CONSTRAINT valid_time_off_dates CHECK (end_date >= start_date),
    CONSTRAINT no_past_requests CHECK (start_date >= CURRENT_DATE - INTERVAL '7 days')
  );

  -- FLEXIBLE Performance Reviews Table
  CREATE TABLE IF NOT EXISTS performance_reviews (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    review_period VARCHAR(50), -- 'Q1-2025', 'annual-2025'
    review_type VARCHAR(100) DEFAULT 'regular',
    goals JSONB,
    achievements JSONB,
    areas_for_improvement JSONB,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5), -- Keep numeric validation
    overall_comments TEXT,
    employee_comments TEXT,
    status VARCHAR(100) DEFAULT 'draft',
    due_date DATE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- FLEXIBLE Documents Table
  CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    document_type VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_size INTEGER CHECK (file_size > 0), -- Keep numeric validation
    mime_type VARCHAR(100),
    is_confidential BOOLEAN DEFAULT FALSE,
    expiry_date DATE,
    uploaded_by INTEGER REFERENCES users(id),
    version INTEGER DEFAULT 1 CHECK (version > 0), -- Keep numeric validation
    parent_document_id INTEGER REFERENCES documents(id), -- For versioning
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- FLEXIBLE Audit Logs Table
  CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    company_id INTEGER REFERENCES companies(id),
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- ===== POPULATE SYSTEM DEFAULTS =====
  
  INSERT INTO system_defaults (category, key, value, description, sort_order) VALUES
    -- Employment Types
    ('employment_types', 'full_time', 'Full Time', 'Standard full-time employment', 1),
    ('employment_types', 'part_time', 'Part Time', 'Part-time employment', 2),
    ('employment_types', 'contract', 'Contract', 'Contract-based employment', 3),
    ('employment_types', 'intern', 'Intern', 'Internship position', 4),
    
    -- Job Levels
    ('job_levels', 'intern', 'Intern', 'Internship level', 1),
    ('job_levels', 'junior', 'Junior', 'Entry level position', 2),
    ('job_levels', 'mid', 'Mid-Level', 'Mid-level position', 3),
    ('job_levels', 'senior', 'Senior', 'Senior level position', 4),
    ('job_levels', 'lead', 'Lead', 'Team lead position', 5),
    ('job_levels', 'principal', 'Principal', 'Principal level', 6),
    ('job_levels', 'executive', 'Executive', 'Executive level', 7),
    
    -- Employment Status
    ('employment_status', 'active', 'Active', 'Currently employed', 1),
    ('employment_status', 'inactive', 'Inactive', 'Not currently active', 2),
    ('employment_status', 'terminated', 'Terminated', 'Employment terminated', 3),
    ('employment_status', 'on_leave', 'On Leave', 'Currently on leave', 4),
    
    -- Time Off Types
    ('time_off_types', 'vacation', 'Vacation', 'Vacation leave', 1),
    ('time_off_types', 'sick', 'Sick Leave', 'Medical leave', 2),
    ('time_off_types', 'personal', 'Personal', 'Personal time off', 3),
    ('time_off_types', 'parental', 'Parental Leave', 'Maternity/Paternity leave', 4),
    ('time_off_types', 'bereavement', 'Bereavement', 'Bereavement leave', 5),
    
    -- Application Status
    ('application_status', 'pending', 'Pending', 'Application received', 1),
    ('application_status', 'under_review', 'Under Review', 'Application being reviewed', 2),
    ('application_status', 'interviewing', 'Interviewing', 'In interview process', 3),
    ('application_status', 'rejected', 'Rejected', 'Application rejected', 4),
    ('application_status', 'accepted', 'Accepted', 'Application accepted', 5),
    
    -- Job Listing Status
    ('job_status', 'draft', 'Draft', 'Job posting in draft', 1),
    ('job_status', 'open', 'Open', 'Accepting applications', 2),
    ('job_status', 'closed', 'Closed', 'No longer accepting applications', 3),
    
    -- Priority Levels (for tasks, notifications)
    ('priority_levels', 'low', 'Low', 'Low priority', 1),
    ('priority_levels', 'normal', 'Normal', 'Normal priority', 2),
    ('priority_levels', 'high', 'High', 'High priority', 3),
    ('priority_levels', 'urgent', 'Urgent', 'Urgent priority', 4);

  -- ===== CREATE ESSENTIAL INDEXES FOR PERFORMANCE =====
  
  -- Configuration tables
  CREATE INDEX idx_system_defaults_category ON system_defaults(category, sort_order);
  CREATE INDEX idx_company_settings_company_category ON company_settings(company_id, category, sort_order);
  
  -- User and authentication indexes
  CREATE INDEX idx_users_email ON users(email);
  CREATE INDEX idx_users_company_status ON users(company_id, status);
  CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
  
  -- Employee and company structure indexes
  CREATE INDEX idx_employees_company_id ON employees(company_id);
  CREATE INDEX idx_employees_manager_id ON employees(manager_id);
  CREATE INDEX idx_employees_department_id ON employees(department_id);
  CREATE INDEX idx_employees_team_id ON employees(team_id);
  CREATE INDEX idx_employees_status ON employees(employment_status);
  
  -- Recruitment and applicant indexes
  CREATE INDEX idx_applicants_job_listing_id ON applicants(job_listing_id);
  CREATE INDEX idx_applicants_company_id ON applicants(company_id);
  CREATE INDEX idx_applicants_status ON applicants(status);
  CREATE INDEX idx_applicants_applied_date ON applicants(applied_date DESC);
  CREATE INDEX idx_job_listings_company_status ON job_listings(company_id, status);
  CREATE INDEX idx_job_listings_created_at ON job_listings(created_at DESC);
  
  -- Communication indexes
  CREATE INDEX idx_notifications_recipient_read ON notifications(recipient_id, is_read);
  CREATE INDEX idx_notifications_type_date ON notifications(type, created_at DESC);
  CREATE INDEX idx_messages_recipient_read ON messages(recipient_id, is_read);
  CREATE INDEX idx_messages_sent_at ON messages(sent_at DESC);
  
  -- Time off and task indexes
  CREATE INDEX idx_time_off_employee_status ON time_off_requests(employee_id, status);
  CREATE INDEX idx_time_off_manager_id ON time_off_requests(manager_id);
  CREATE INDEX idx_tasks_user_status ON tasks(task_list_id, status);
  CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE status != 'completed';
  
  -- Audit and activity indexes
  CREATE INDEX idx_audit_logs_user_date ON audit_logs(user_id, created_at DESC);
  CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
  CREATE INDEX idx_audit_logs_company_date ON audit_logs(company_id, created_at DESC);
  CREATE INDEX idx_applicant_activity_applicant ON applicant_activity(applicant_id, created_at DESC);

  -- Performance review indexes
  CREATE INDEX idx_performance_reviews_employee ON performance_reviews(employee_id, review_period);
  CREATE INDEX idx_performance_reviews_reviewer ON performance_reviews(reviewer_id, status);

  -- Document indexes
  CREATE INDEX idx_documents_employee_type ON documents(employee_id, document_type);
  CREATE INDEX idx_documents_company_confidential ON documents(company_id, is_confidential);

  -- ===== CREATE TRIGGERS FOR AUDIT LOGGING =====
  
  -- Add audit triggers to important tables
  CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    
  CREATE TRIGGER audit_employees AFTER INSERT OR UPDATE OR DELETE ON employees
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    
  CREATE TRIGGER audit_job_listings AFTER INSERT OR UPDATE OR DELETE ON job_listings
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    
  CREATE TRIGGER audit_applicants AFTER INSERT OR UPDATE OR DELETE ON applicants
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

  -- Create the applicant last modified trigger
  CREATE TRIGGER applicant_last_modified
    BEFORE UPDATE ON applicants
    FOR EACH ROW
    EXECUTE FUNCTION update_applicant_last_modified();

  -- Print success message
  SELECT 'Flexible database setup complete with configurable options!' AS status;
EOSQL

echo "Flexible database schema setup complete!"