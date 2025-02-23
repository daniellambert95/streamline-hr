#!/bin/bash

echo "Populating the database with dummy data..."

# Load environment variables from .env file
set -a
[ -f .env ] && source .env
set +a

docker exec -i postgres_streamline_hr psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} <<-EOSQL
  -- Update user 1 (admin) with first and last name
  UPDATE users 
  SET 
    first_name = 'Daniel',
    last_name = 'Lambert',
    updated_at = NOW()
  WHERE id = 1;

  -- Update sequence for new users
  SELECT pg_catalog.setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));

  -- Insert test users (starting from ID 2)
  WITH inserted_users AS (
    INSERT INTO users (email, password, first_name, last_name, status)
    VALUES 
      ('john@streamlinehr.com', '\$2b\$10\$test_hash', 'John', 'Doe', 'active'),
      ('emma@streamlinehr.com', '\$2b\$10\$test_hash', 'Emma', 'Wilson', 'active'),
      ('sarah@streamlinehr.com', '\$2b\$10\$test_hash', 'Sarah', 'Brown', 'active'),
      ('mike@streamlinehr.com', '\$2b\$10\$test_hash', 'Mike', 'Johnson', 'active'),
      ('alex@streamlinehr.com', '\$2b\$10\$test_hash', 'Alex', 'Turner', 'active'),
      ('lisa@streamlinehr.com', '\$2b\$10\$test_hash', 'Lisa', 'Anderson', 'active'),
      ('david@streamlinehr.com', '\$2b\$10\$test_hash', 'David', 'Clark', 'active'),
      ('rachel@streamlinehr.com', '\$2b\$10\$test_hash', 'Rachel', 'White', 'active'),
      ('james@streamlinehr.com', '\$2b\$10\$test_hash', 'James', 'Miller', 'active'),
      ('sophia@streamlinehr.com', '\$2b\$10\$test_hash', 'Sophia', 'Davis', 'active')
    RETURNING id, email
  )
  INSERT INTO user_roles (user_id, role_id)
  SELECT 
    u.id,
    r.id
  FROM inserted_users u
  CROSS JOIN roles r
  WHERE 
    (u.email = 'john@streamlinehr.com' AND r.name = 'admin') OR
    (u.email = 'emma@streamlinehr.com' AND r.name = 'recruiter') OR
    (u.email = 'sarah@streamlinehr.com' AND r.name = 'manager') OR
    (u.email IN ('mike@streamlinehr.com', 'alex@streamlinehr.com', 'lisa@streamlinehr.com', 
                 'david@streamlinehr.com', 'rachel@streamlinehr.com', 'james@streamlinehr.com', 
                 'sophia@streamlinehr.com') AND r.name = 'employee');

  -- Insert departments for existing company (company_id = 1)
  INSERT INTO departments (company_id, name, budget)
  VALUES 
    (1, 'Engineering', 1000000),
    (1, 'HR', 500000),
    (1, 'Marketing', 750000),
    (1, 'Sales', 850000),
    (1, 'Product', 600000),
    (1, 'Customer Success', 400000),
    (1, 'Finance', 550000);

  -- Insert teams
  INSERT INTO teams (company_id, name, description)
  VALUES 
    (1, 'Frontend', 'Frontend development team'),
    (1, 'Backend', 'Backend development team'),
    (1, 'DevOps', 'Infrastructure team'),
    (1, 'QA', 'Quality Assurance team'),
    (1, 'Mobile', 'Mobile development team'),
    (1, 'Design', 'UI/UX design team'),
    (1, 'Data Science', 'Analytics and ML team'),
    (1, 'Support', 'Customer support team');

  -- Insert employees with random dates between 2025-01-25 and 2025-02-23
  INSERT INTO employees (
    id, company_id, team_id, department_id,
    job_title, starting_date, mobile_number,
    job_level, salary, employment_status, employment_type
  )
  VALUES 
    (1, 1, 1, 1, 'CEO', '2025-01-25', '+1234567890', 'executive', '150000', 'active', 'full_time'),
    (2, 1, 2, 2, 'HR Director', '2025-01-27', '+1234567891', 'senior', '100000', 'active', 'full_time'),
    (3, 1, 1, 1, 'Engineering Manager', '2025-01-30', '+1234567892', 'senior', '120000', 'active', 'full_time'),
    (4, 1, 1, 1, 'Senior Developer', '2025-02-01', '+1234567893', 'senior', '90000', 'active', 'full_time'),
    (5, 1, 3, 1, 'DevOps Engineer', '2025-02-05', '+1234567894', 'mid', '85000', 'active', 'full_time'),
    (6, 1, 4, 1, 'QA Lead', '2025-02-08', '+1234567895', 'senior', '95000', 'active', 'full_time'),
    (7, 1, 5, 1, 'Mobile Developer', '2025-02-12', '+1234567896', 'mid', '80000', 'active', 'full_time'),
    (8, 1, 6, 3, 'UI Designer', '2025-02-15', '+1234567897', 'mid', '75000', 'active', 'full_time'),
    (9, 1, 7, 1, 'Data Scientist', '2025-02-18', '+1234567898', 'senior', '110000', 'active', 'full_time'),
    (10, 1, 8, 6, 'Support Specialist', '2025-02-20', '+1234567899', 'junior', '65000', 'active', 'full_time');

  -- Insert managers
  INSERT INTO managers (
    id, employee_id, department_id, level,
    can_approve_time_off, can_hire, can_edit_salary, max_reports
  )
  VALUES 
    (1, 1, 1, 'executive', true, true, true, 50),
    (2, 2, 2, 'department_head', true, true, true, 20),
    (3, 3, 1, 'team_lead', true, true, false, 10),
    (4, 6, 1, 'team_lead', true, false, false, 5);

  -- Insert job listings
  INSERT INTO job_listings (
    company_id, title, description, location, type,
    salary, status, created_at
  )
  VALUES 
    (1, 'Senior Frontend Developer', 'Looking for experienced frontend dev', 'Remote', 'full-time', '120000-150000', 'open', NOW() - INTERVAL '10 days'),
    (1, 'Backend Engineer', 'Backend position with Node.js', 'Remote', 'full-time', '130000-160000', 'open', NOW() - INTERVAL '15 days'),
    (1, 'Product Designer', 'Senior product designer position', 'Hybrid', 'full-time', '100000-130000', '1st round', NOW() - INTERVAL '5 days'),
    (1, 'DevOps Engineer', 'Experienced DevOps engineer', 'Remote', 'full-time', '140000-170000', '2nd round', NOW() - INTERVAL '20 days'),
    (1, 'Data Analyst', 'Entry level data analyst', 'On-site', 'full-time', '70000-90000', 'open', NOW() - INTERVAL '3 days');

  -- Insert applicants
  INSERT INTO applicants (
    company_id, job_listing_id, first_name, last_name,
    email, status, applied_date
  )
  VALUES 
    (1, 1, 'Jane', 'Smith', 'jane@example.com', 'under_review', NOW() - INTERVAL '9 days'),
    (1, 1, 'Mark', 'Johnson', 'mark@example.com', 'interviewing', NOW() - INTERVAL '8 days'),
    (1, 2, 'Emily', 'Brown', 'emily@example.com', 'pending', NOW() - INTERVAL '14 days'),
    (1, 2, 'Michael', 'Davis', 'michael@example.com', 'accepted', NOW() - INTERVAL '10 days'),
    (1, 3, 'Sarah', 'Wilson', 'sarah@example.com', 'under_review', NOW() - INTERVAL '4 days'),
    (1, 3, 'James', 'Taylor', 'james@example.com', 'rejected', NOW() - INTERVAL '3 days'),
    (1, 4, 'Emma', 'Anderson', 'emma@example.com', 'interviewing', NOW() - INTERVAL '18 days'),
    (1, 4, 'William', 'Thomas', 'william@example.com', 'pending', NOW() - INTERVAL '17 days'),
    (1, 5, 'Olivia', 'Martinez', 'olivia@example.com', 'under_review', NOW() - INTERVAL '2 days'),
    (1, 5, 'Lucas', 'Garcia', 'lucas@example.com', 'pending', NOW() - INTERVAL '1 day');

  -- Insert applicant notes
  INSERT INTO applicant_notes (
    applicant_id, content, created_at
  )
  VALUES 
    (1, 'Strong technical background', NOW() - INTERVAL '8 days'),
    (1, 'Great communication skills', NOW() - INTERVAL '7 days'),
    (2, 'Passed technical interview', NOW() - INTERVAL '7 days'),
    (4, 'Perfect fit for the role', NOW() - INTERVAL '9 days'),
    (7, 'Good problem-solving skills', NOW() - INTERVAL '17 days');

  DO \$\$
  BEGIN
    RAISE NOTICE 'Database populated with dummy data successfully!';
  END
  \$\$;
EOSQL

echo "Database population complete!"