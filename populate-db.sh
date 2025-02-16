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
      (v_company_id, 'HR', 'Human resources team', NOW()),
      (v_company_id, 'Product', 'Product management team', NOW()),
      (v_company_id, 'Design', 'UI/UX design team', NOW());

    -- Insert employees for the existing company
    INSERT INTO employees (company_id, team_id, job_title, first_name, last_name, email, starting_date, mobile_number, job_level, holiday_time, salary)
    VALUES 
      (v_company_id, currval('teams_id_seq')-4, 'Senior Developer', 'James', 'Wilson', 'james@company.com', '2024-01-15', '+1234567890', 'Senior', 25, '120000'),
      (v_company_id, currval('teams_id_seq')-4, 'Full Stack Developer', 'Sarah', 'Chen', 'sarah@company.com', '2024-01-20', '+1234567891', 'Mid-Level', 22, '95000'),
      (v_company_id, currval('teams_id_seq')-3, 'Sales Manager', 'Emma', 'Taylor', 'emma@company.com', '2024-02-01', '+1234567892', 'Senior', 25, '110000'),
      (v_company_id, currval('teams_id_seq')-3, 'Sales Representative', 'Michael', 'Brown', 'michael@company.com', '2024-02-15', '+1234567893', 'Junior', 20, '75000'),
      (v_company_id, currval('teams_id_seq')-2, 'HR Director', 'Oliver', 'Smith', 'oliver@company.com', '2024-01-20', '+1234567894', 'Senior', 28, '130000'),
      (v_company_id, currval('teams_id_seq')-1, 'Product Manager', 'Lisa', 'Johnson', 'lisa@company.com', '2024-03-01', '+1234567895', 'Senior', 25, '115000'),
      (v_company_id, currval('teams_id_seq'), 'UI Designer', 'David', 'Martinez', 'david@company.com', '2024-03-15', '+1234567896', 'Mid-Level', 22, '90000');

    -- Insert job listings for the existing company
    INSERT INTO job_listings (company_id, title, description, location, industry, type, salary, hours, status, responsibilities, educational_requirements, experience_requirements)
    VALUES 
      (v_company_id, 'Senior Full Stack Developer', 'Looking for an experienced developer to join our team', 'Remote', 'Technology', 'full-time', '120000-150000', '40', 'open', 
       'Development of new features, Code reviews, Technical documentation', 'Bachelor in Computer Science or related field', '5+ years of experience with React and Node.js'),
      (v_company_id, 'Product Designer', 'Creative designer needed for our product team', 'New York', 'Technology', 'full-time', '90000-110000', '40', 'open',
       'UI/UX design, User research, Prototyping', 'Bachelor in Design or related field', '3+ years of product design experience'),
      (v_company_id, 'Sales Representative', 'Experienced sales professional needed', 'Chicago', 'Technology', 'full-time', '80000-100000', '40', '1st round',
       'Client relationship management, Sales strategy development', 'Bachelor in Business or related field', '2+ years of B2B sales experience'),
      (v_company_id, 'DevOps Engineer', 'Seeking skilled DevOps engineer', 'Remote', 'Technology', 'full-time', '130000-160000', '40', 'open',
       'Infrastructure management, CI/CD pipeline development, Cloud architecture', 'Bachelor in Computer Science or related field', '4+ years of DevOps experience'),
      (v_company_id, 'Marketing Manager', 'Lead our marketing initiatives', 'Los Angeles', 'Technology', 'full-time', '100000-120000', '40', 'open',
       'Marketing strategy, Campaign management, Analytics', 'Bachelor in Marketing', '5+ years of marketing experience');

    -- Insert applicants
    INSERT INTO applicants (company_id, job_listing_id, first_name, last_name, email, resume_path, cover_letter_path, linkedin_url, status, applied_date)
    VALUES 
      (v_company_id, currval('job_listings_id_seq')-4, 'Alex', 'Johnson', 'alex@email.com', '/resumes/alex.pdf', '/cover-letters/alex.pdf', 'linkedin.com/in/alex', 'under_review', NOW() - INTERVAL '5 days'),
      (v_company_id, currval('job_listings_id_seq')-3, 'Maria', 'Garcia', 'maria@email.com', '/resumes/maria.pdf', '/cover-letters/maria.pdf', 'linkedin.com/in/maria', 'pending', NOW() - INTERVAL '3 days'),
      (v_company_id, currval('job_listings_id_seq')-2, 'John', 'Lee', 'john@email.com', '/resumes/john.pdf', '/cover-letters/john.pdf', 'linkedin.com/in/john', 'interviewing', NOW() - INTERVAL '7 days'),
      (v_company_id, currval('job_listings_id_seq')-1, 'Sophie', 'Williams', 'sophie@email.com', '/resumes/sophie.pdf', NULL, 'linkedin.com/in/sophie', 'pending', NOW() - INTERVAL '2 days'),
      (v_company_id, currval('job_listings_id_seq'), 'Ryan', 'Miller', 'ryan@email.com', '/resumes/ryan.pdf', '/cover-letters/ryan.pdf', 'linkedin.com/in/ryan', 'under_review', NOW() - INTERVAL '4 days');

    -- Insert notifications for the existing user
    INSERT INTO notifications (user_id, content, status, created_at)
    SELECT 
      users.id,
      unnest(ARRAY[
        'Welcome to StreamlineHR! Get started by exploring your dashboard.',
        'New application received for Senior Full Stack Developer position.',
        'Reminder: Schedule interview with Maria Garcia.',
        'Time off request pending approval.',
        'New message from team member regarding job posting.'
      ]),
      'unread',
      NOW() - (INTERVAL '1 day' * generate_series(0, 4))
    FROM users
    WHERE id = 1;

    -- Insert time off requests
    INSERT INTO time_off_requests (employee_id, manager_id, start_date, end_date, reason, status, created_at)
    VALUES 
      (currval('employees_id_seq')-6, (SELECT id FROM users WHERE id = 1), '2024-07-15', '2024-07-25', 'Summer vacation', 'pending', NOW()),
      (currval('employees_id_seq')-5, (SELECT id FROM users WHERE id = 1), '2024-08-01', '2024-08-02', 'Medical appointment', 'approved', NOW()),
      (currval('employees_id_seq')-4, (SELECT id FROM users WHERE id = 1), '2024-06-20', '2024-06-22', 'Family event', 'pending', NOW()),
      (currval('employees_id_seq')-3, (SELECT id FROM users WHERE id = 1), '2024-09-10', '2024-09-15', 'Personal leave', 'pending', NOW());

    -- Insert applicant notes
    INSERT INTO applicant_notes (applicant_id, user_id, content, created_at)
    VALUES 
      (currval('applicants_id_seq')-4, (SELECT id FROM users WHERE id = 1), 'Strong technical background, proceed to technical interview', NOW()),
      (currval('applicants_id_seq')-3, (SELECT id FROM users WHERE id = 1), 'Good communication skills, schedule follow-up', NOW()),
      (currval('applicants_id_seq')-2, (SELECT id FROM users WHERE id = 1), 'Excellent portfolio, but lacking required experience', NOW());

  END \$\$;

  -- Print success message
  SELECT 'Database populated with dummy data successfully!' AS status;
EOSQL

echo "Database population complete!"