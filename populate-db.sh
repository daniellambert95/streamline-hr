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
    INSERT INTO users (email, password, first_name, last_name, status, company_name)
    VALUES 
      ('john@streamlinehr.com', '\$2b\$10\$test_hash', 'John', 'Doe', 'active', 'Streamline HR'),
      ('emma@streamlinehr.com', '\$2b\$10\$test_hash', 'Emma', 'Wilson', 'active', 'Streamline HR'),
      ('sarah@streamlinehr.com', '\$2b\$10\$test_hash', 'Sarah', 'Brown', 'active', 'Streamline HR'),
      ('mike@streamlinehr.com', '\$2b\$10\$test_hash', 'Mike', 'Johnson', 'active', 'Streamline HR'),
      ('alex@streamlinehr.com', '\$2b\$10\$test_hash', 'Alex', 'Turner', 'active', 'Streamline HR'),
      ('lisa@streamlinehr.com', '\$2b\$10\$test_hash', 'Lisa', 'Anderson', 'active', 'Streamline HR'),
      ('david@streamlinehr.com', '\$2b\$10\$test_hash', 'David', 'Clark', 'active', 'Streamline HR'),
      ('rachel@streamlinehr.com', '\$2b\$10\$test_hash', 'Rachel', 'White', 'active', 'Streamline HR'),
      ('james@streamlinehr.com', '\$2b\$10\$test_hash', 'James', 'Miller', 'active', 'Streamline HR'),
      ('sophia@streamlinehr.com', '\$2b\$10\$test_hash', 'Sophia', 'Davis', 'active', 'Streamline HR')
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
    id, company_id, team_id, department_id, manager_id,
    job_title, starting_date, mobile_number,
    job_level, salary, employment_status, employment_type
  )
  VALUES 
    (1, 1, 1, 1, NULL, 'CEO', '2025-01-25', '+1234567890', 'executive', '150000', 'active', 'full_time'),
    (2, 1, 2, 2, 1, 'HR Director', '2025-01-27', '+1234567891', 'senior', '100000', 'active', 'full_time'),
    (3, 1, 1, 1, 1, 'Engineering Manager', '2025-01-30', '+1234567892', 'senior', '120000', 'active', 'full_time'),
    (4, 1, 1, 1, 1, 'Senior Developer', '2025-02-01', '+1234567893', 'senior', '90000', 'active', 'full_time'),
    (5, 1, 3, 1, 1, 'DevOps Engineer', '2025-02-05', '+1234567894', 'mid', '85000', 'active', 'full_time'),
    (6, 1, 4, 1, 1, 'QA Lead', '2025-02-08', '+1234567895', 'senior', '95000', 'active', 'full_time'),
    (7, 1, 5, 1, 1, 'Mobile Developer', '2025-02-12', '+1234567896', 'mid', '80000', 'active', 'full_time'),
    (8, 1, 6, 3, 1, 'UI Designer', '2025-02-15', '+1234567897', 'mid', '75000', 'active', 'full_time'),
    (9, 1, 7, 1, 1, 'Data Scientist', '2025-02-18', '+1234567898', 'senior', '110000', 'active', 'full_time'),
    (10, 1, 8, 6, 1, 'Support Specialist', '2025-02-20', '+1234567899', 'junior', '65000', 'active', 'full_time');

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

  -- Insert task lists and tasks for user 1
  INSERT INTO task_lists (user_id, name)
  VALUES 
    (1, 'Work Tasks'),
    (1, 'Personal Tasks');

  -- Insert tasks for the task lists
  INSERT INTO tasks (task_list_id, description, due_date, status, priority)
  VALUES 
    (1, 'Review Q1 performance reports', '2025-03-31', 'pending', 4),
    (1, 'Schedule team meeting', '2025-03-25', 'in_progress', 3),
    (1, 'Update HR policies', '2025-04-15', 'pending', 5),
    (2, 'Gym session', '2025-03-24', 'pending', 2),
    (2, 'Book dentist appointment', '2025-03-30', 'pending', 3);

  -- Insert messages for user 1
  INSERT INTO messages (sender_id, recipient_id, subject, content, is_read, is_important)
  VALUES 
    (2, 1, 'Weekly Update', 'Here is the weekly progress report for the engineering team.', false, false),
    (2, 1, 'Meeting Request', 'Can we schedule a meeting to discuss the new project requirements?', false, true),
    (3, 1, 'Urgent: Server Issue', 'We are experiencing some downtime with the production server.', false, true),
    (4, 1, 'Document Review', 'Please review the attached technical specifications when you have a moment.', false, false);

  -- Insert notifications for user 1
  INSERT INTO notifications (recipient_id, sender_id, type, message, is_read, is_reminder, reminder_date)
  VALUES 
    (1, 2, 'application', 'New job application received for Senior Frontend Developer position', false, false, NULL),
    (1, 2, 'meeting', 'Team meeting scheduled for tomorrow at 10 AM', false, true, NOW() + INTERVAL '1 day'),
    (1, 2, 'review', 'Employee review deadline approaching', false, true, NOW() + INTERVAL '3 days'),
    (1, NULL, 'reminder', 'Call the client about project timeline', false, true, NOW() + INTERVAL '2 days'),
    (1, NULL, 'reminder', 'Prepare quarterly report', false, true, NOW() + INTERVAL '5 days');

  DO \$\$
  BEGIN
    RAISE NOTICE 'Database populated with dummy data successfully!';
  END
  \$\$;
EOSQL

echo "Database population complete!"