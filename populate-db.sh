#!/bin/bash

echo "Populating the database with dummy data..."

# Load environment variables from .env file
set -a
[ -f .env ] && source .env
set +a

docker exec -i postgres_streamline_hr psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} <<-EOSQL
  -- Clear existing data except users and companies
  DELETE FROM applicant_notes;
  DELETE FROM time_off_requests;
  DELETE FROM notifications;
  DELETE FROM job_interviewers;
  DELETE FROM applicants;
  DELETE FROM job_listings;
  DELETE FROM employees;
  DELETE FROM teams;
  DELETE FROM audit_logs;

  -- Get the existing user's company_id
  DO \$\$
  DECLARE
    v_company_id INTEGER;
  BEGIN
    SELECT id INTO v_company_id FROM companies LIMIT 1;

    -- Insert teams for the existing company
    INSERT INTO teams (company_id, name, description, created_at)
    VALUES 
      (v_company_id, 'Engineering', 'Core development team', NOW()),
      (v_company_id, 'Sales', 'Sales and marketing team', NOW()),
      (v_company_id, 'HR', 'Human resources team', NOW());

    -- Insert employees for the existing company
    INSERT INTO employees (company_id, team_id, job_title, first_name, last_name, email, starting_date, mobile_number, job_level, holiday_time, salary)
    VALUES 
      (v_company_id, currval('teams_id_seq'), 'Senior Developer', 'James', 'Wilson', 'james@company.com', '2024-01-15', '+1234567890', 'Senior', 25, '120000'),
      (v_company_id, currval('teams_id_seq')-1, 'Sales Manager', 'Emma', 'Taylor', 'emma@company.com', '2024-02-01', '+1234567891', 'Mid-Level', 20, '95000'),
      (v_company_id, currval('teams_id_seq')-2, 'HR Specialist', 'Oliver', 'Smith', 'oliver@company.com', '2024-01-20', '+1234567892', 'Junior', 18, '75000');

    -- Insert job listings for the existing company
    INSERT INTO job_listings (company_id, title, description, location, industry, type, salary, hours, status, responsibilities, educational_requirements, experience_requirements)
    VALUES 
      (v_company_id, 'Full Stack Developer', 'Looking for an experienced developer to join our team', 'Remote', 'Technology', 'full-time', '100000-130000', '40', 'open', 
       'Development of new features, Code reviews, Technical documentation', 'Bachelor in Computer Science or related field', '3+ years of experience with React and Node.js'),
      (v_company_id, 'Sales Representative', 'Experienced sales professional needed', 'New York', 'Technology', 'full-time', '80000-100000', '40', '1st round',
       'Client relationship management, Sales strategy development', 'Bachelor in Business or related field', '2+ years of B2B sales experience'),
      (v_company_id, 'HR Coordinator', 'Join our growing HR team', 'Chicago', 'Technology', 'full-time', '60000-75000', '40', 'open',
       'Employee relations, Recruitment support, HR administration', 'Bachelor in HR Management', '1+ year of HR experience');

    -- Insert applicants
    INSERT INTO applicants (company_id, job_listing_id, first_name, last_name, email, resume_path, cover_letter_path, linkedin_url)
    VALUES 
      (v_company_id, currval('job_listings_id_seq'), 'Alex', 'Johnson', 'alex@email.com', '/resumes/alex.pdf', '/cover-letters/alex.pdf', 'linkedin.com/in/alex'),
      (v_company_id, currval('job_listings_id_seq')-1, 'Maria', 'Garcia', 'maria@email.com', '/resumes/maria.pdf', '/cover-letters/maria.pdf', 'linkedin.com/in/maria');

    -- Insert notifications for the existing user
    INSERT INTO notifications (user_id, content, status)
    SELECT 
      users.id,
      'Welcome to StreamlineHR! Get started by exploring your dashboard.',
      'unread'
    FROM users
    LIMIT 1;

    -- Insert time off requests
    INSERT INTO time_off_requests (employee_id, manager_id, start_date, end_date, reason, status)
    VALUES 
      (currval('employees_id_seq'), (SELECT id FROM users LIMIT 1), '2025-03-15', '2025-03-20', 'Annual vacation', 'pending'),
      (currval('employees_id_seq')-1, (SELECT id FROM users LIMIT 1), '2025-04-01', '2025-04-02', 'Medical appointment', 'approved');

  END \$\$;

  -- Print success message
  SELECT 'Database populated with dummy data successfully!' AS status;
EOSQL

echo "Database population complete!"