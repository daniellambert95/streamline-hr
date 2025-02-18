#!/bin/bash

echo "Populating the database with dummy data..."

# Load environment variables from .env file
set -a
[ -f .env ] && source .env
set +a

docker exec -i postgres_streamline_hr psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} <<-EOSQL
  -- Clear existing data
  DELETE FROM applicant_notes;
  DELETE FROM time_off_requests;
  DELETE FROM notifications;
  DELETE FROM job_interviewers;
  DELETE FROM applicants;
  DELETE FROM job_listings;
  DELETE FROM employees;
  DELETE FROM teams;
  DELETE FROM audit_logs;

  -- Insert teams for the existing company
  INSERT INTO teams (company_id, name, description)
  SELECT 
    id, 
    unnest(ARRAY['Engineering', 'Logistics', 'HR']),
    unnest(ARRAY['Software Development Team', 'Product Management Team', 'Human Resources Team'])
  FROM companies
  WHERE user_id = 1;

  -- First, insert employee data for user ID 1 (the admin user)
  INSERT INTO employees (
    id,
    company_id,
    team_id,
    manager_id,
    job_title,
    first_name,
    last_name,
    email,
    starting_date,
    mobile_number,
    job_level,
    holiday_time,
    salary
  )
  SELECT 
    1,
    c.id,
    t.id,
    NULL,
    'CEO',
    'Daniel',
    'Lambert',
    u.email,
    '2024-01-01',
    '+1234567890',
    'Executive',
    30,
    '200000'
  FROM users u
  JOIN companies c ON c.user_id = u.id
  JOIN teams t ON t.company_id = c.id AND t.name = 'HR'
  WHERE u.id = 1;

  -- Insert additional users
  INSERT INTO users (first_name, last_name, email, password, role)
  VALUES 
    ('Oliver', 'Smith', 'oliver@streamlinehr.com', '$2b$10$xxxxxxxxxxx', 'admin'),
    ('Sarah', 'Chen', 'sarah@streamlinehr.com', '$2b$10$xxxxxxxxxxx', 'employee'),
    ('Michael', 'Johnson', 'michael@streamlinehr.com', '$2b$10$xxxxxxxxxxx', 'employee'),
    ('Emma', 'Williams', 'emma@streamlinehr.com', '$2b$10$xxxxxxxxxxx', 'recruiter');

  -- Insert employees for additional users
  INSERT INTO employees (
    id,
    company_id,
    team_id,
    manager_id,
    job_title,
    first_name,
    last_name,
    email,
    starting_date,
    mobile_number,
    job_level,
    holiday_time,
    salary
  )
  SELECT 
    u.id,
    c.id,
    t.id,
    1, -- Set manager_id to user 1 (CEO)
    CASE u.email
      WHEN 'oliver@streamlinehr.com' THEN 'HR Director'
      WHEN 'sarah@streamlinehr.com' THEN 'Senior Developer'
      WHEN 'michael@streamlinehr.com' THEN 'Product Manager'
      WHEN 'emma@streamlinehr.com' THEN 'Recruitment Lead'
    END,
    u.first_name,
    u.last_name,
    u.email,
    '2025-01-01',
    '+1234567891',
    CASE u.email
      WHEN 'oliver@streamlinehr.com' THEN 'Director'
      WHEN 'sarah@streamlinehr.com' THEN 'Senior'
      WHEN 'michael@streamlinehr.com' THEN 'Manager'
      WHEN 'emma@streamlinehr.com' THEN 'Lead'
    END,
    25,
    CASE u.email
      WHEN 'oliver@streamlinehr.com' THEN '150000'
      WHEN 'sarah@streamlinehr.com' THEN '120000'
      WHEN 'michael@streamlinehr.com' THEN '130000'
      WHEN 'emma@streamlinehr.com' THEN '110000'
    END
  FROM users u
  CROSS JOIN (SELECT id FROM companies WHERE user_id = 1) c
  JOIN teams t ON t.company_id = c.id
  WHERE u.email IN ('oliver@streamlinehr.com', 'sarah@streamlinehr.com', 'michael@streamlinehr.com', 'emma@streamlinehr.com');

  -- Insert job listings for the existing company
  INSERT INTO job_listings (
    company_id, 
    title, 
    description, 
    location, 
    industry, 
    type, 
    salary, 
    status
  )
  SELECT 
    c.id,
    unnest(ARRAY[
      'Senior Full Stack Developer',
      'Product Designer',
      'Sales Representative'
    ]),
    'Job description here',
    'Remote',
    'Technology',
    'full-time',
    '120000',
    'open'
  FROM companies c
  WHERE c.user_id = 1;

  -- Print success message
  SELECT 'Database populated with dummy data successfully!' AS status;
EOSQL

echo "Database population complete!"