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

  -- Get the company ID for the admin user and insert departments
  DO \$\$
  DECLARE
    admin_company_id INTEGER;
  BEGIN
    SELECT id INTO admin_company_id FROM companies WHERE user_id = 1;

    -- Insert departments for the company
    INSERT INTO departments (company_id, name, budget)
    VALUES 
      (admin_company_id, 'Engineering', 1000000),
      (admin_company_id, 'Human Resources', 500000),
      (admin_company_id, 'Sales', 750000),
      (admin_company_id, 'Operations', 400000);

    -- Insert teams for each department
    INSERT INTO teams (company_id, name, description)
    VALUES 
      (admin_company_id, 'Engineering Team', 'Software Development Team'),
      (admin_company_id, 'HR Team', 'Human Resources Team'),
      (admin_company_id, 'Sales Team', 'Sales and Marketing Team'),
      (admin_company_id, 'Operations Team', 'Operations and Support Team');
  END;
  \$\$;

  -- First, insert employee data for user ID 1 (the admin/CEO)
  INSERT INTO employees (
    id,
    company_id,
    team_id,
    job_title,
    starting_date,
    mobile_number,
    job_level,
    leave_balance,
    salary,
    employment_status,
    employment_type,
    department_id
  )
  SELECT 
    1,
    c.id,
    t.id,
    'CEO',
    '2025-02-22',
    '+1234567890',
    'executive',
    30,
    '250000',
    'active',
    'full_time',
    d.id
  FROM users u
  JOIN companies c ON c.user_id = u.id
  JOIN teams t ON t.company_id = c.id AND t.name = 'Operations Team'
  JOIN departments d ON d.company_id = c.id AND d.name = 'Operations'
  WHERE u.id = 1;

  -- Now we can insert CEO as executive manager
  INSERT INTO managers (
    id,
    department,
    level,
    can_approve_time_off,
    can_hire,
    can_edit_salary,
    max_reports
  )
  VALUES (
    1,
    'Executive',
    'executive',
    TRUE,
    TRUE,
    TRUE,
    50
  );

  -- Insert manager permissions for CEO
  INSERT INTO manager_permissions (manager_id, permission_name, granted_by)
  VALUES 
    (1, 'approve_hire', 1),
    (1, 'approve_salary', 1),
    (1, 'approve_budget', 1),
    (1, 'manage_departments', 1);

  -- Insert additional users
  INSERT INTO users (email, password, role, status, first_name, last_name)
  VALUES 
    ('oliver@streamlinehr.com', '$2b$10$xxxxxxxxxxx', 'admin', 'active', 'Oliver', 'Smith'),
    ('sarah@streamlinehr.com', '$2b$10$xxxxxxxxxxx', 'employee', 'active', 'Sarah', 'Chen'),
    ('michael@streamlinehr.com', '$2b$10$xxxxxxxxxxx', 'employee', 'active', 'Michael', 'Johnson'),
    ('emma@streamlinehr.com', '$2b$10$xxxxxxxxxxx', 'recruiter', 'active', 'Emma', 'Williams');

  -- Insert employees for additional users
  INSERT INTO employees (
    id,
    company_id,
    team_id,
    manager_id,
    job_title,
    starting_date,
    mobile_number,
    job_level,
    leave_balance,
    salary,
    employment_status,
    employment_type,
    department_id
  )
  SELECT 
    u.id,
    c.id,
    t.id,
    1, -- All report to CEO (user_id 1)
    CASE u.email
      WHEN 'oliver@streamlinehr.com' THEN 'HR Director'
      WHEN 'sarah@streamlinehr.com' THEN 'Senior Developer'
      WHEN 'michael@streamlinehr.com' THEN 'Product Manager'
      WHEN 'emma@streamlinehr.com' THEN 'Recruitment Lead'
    END,
    '2025-02-22',
    '+1234567891',
    CASE u.email
      WHEN 'oliver@streamlinehr.com' THEN 'department_head'
      WHEN 'sarah@streamlinehr.com' THEN 'team_lead'
      WHEN 'michael@streamlinehr.com' THEN 'team_lead'
      WHEN 'emma@streamlinehr.com' THEN 'team_lead'
    END,
    25,
    CASE u.email
      WHEN 'oliver@streamlinehr.com' THEN '150000'
      WHEN 'sarah@streamlinehr.com' THEN '120000'
      WHEN 'michael@streamlinehr.com' THEN '130000'
      WHEN 'emma@streamlinehr.com' THEN '110000'
    END,
    'active',
    'full_time',
    d.id
  FROM users u
  CROSS JOIN (SELECT id FROM companies WHERE user_id = 1) c
  JOIN departments d ON d.company_id = c.id
  JOIN teams t ON t.company_id = c.id
  WHERE u.email IN ('oliver@streamlinehr.com', 'sarah@streamlinehr.com', 'michael@streamlinehr.com', 'emma@streamlinehr.com')
  AND (
    (u.email = 'oliver@streamlinehr.com' AND d.name = 'Human Resources' AND t.name = 'HR Team') OR
    (u.email = 'sarah@streamlinehr.com' AND d.name = 'Engineering' AND t.name = 'Engineering Team') OR
    (u.email = 'michael@streamlinehr.com' AND d.name = 'Operations' AND t.name = 'Operations Team') OR
    (u.email = 'emma@streamlinehr.com' AND d.name = 'Human Resources' AND t.name = 'HR Team')
  );

  -- Insert department heads and team leads as managers
  INSERT INTO managers (id, department, level, can_approve_time_off, can_hire, can_edit_salary, max_reports)
  SELECT 
    id,
    CASE email
      WHEN 'oliver@streamlinehr.com' THEN 'Human Resources'
      WHEN 'sarah@streamlinehr.com' THEN 'Engineering'
      WHEN 'michael@streamlinehr.com' THEN 'Operations'
      WHEN 'emma@streamlinehr.com' THEN 'Human Resources'
    END,
    CASE email
      WHEN 'oliver@streamlinehr.com' THEN 'department_head'
      ELSE 'team_lead'
    END,
    TRUE,
    CASE email
      WHEN 'oliver@streamlinehr.com' THEN TRUE
      ELSE FALSE
    END,
    CASE email
      WHEN 'oliver@streamlinehr.com' THEN TRUE
      ELSE FALSE
    END,
    CASE email
      WHEN 'oliver@streamlinehr.com' THEN 30
      ELSE 10
    END
  FROM users
  WHERE email IN ('oliver@streamlinehr.com', 'sarah@streamlinehr.com', 'michael@streamlinehr.com', 'emma@streamlinehr.com');

  -- Update departments with their heads
  UPDATE departments d
  SET head_id = m.id
  FROM managers m
  WHERE m.level = 'department_head'
  AND d.name = m.department;

  -- Insert job listings for the existing company
  INSERT INTO job_listings (
    company_id, 
    title, 
    description, 
    location, 
    industry, 
    type, 
    salary, 
    status,
    created_at
  )
  SELECT 
    c.id,
    j.title,
    j.description,
    j.location,
    j.industry,
    j.type,
    j.salary,
    j.status,
    j.created_at
  FROM companies c
  CROSS JOIN (
    VALUES 
      ('Senior Full Stack Developer', 
       'We are looking for an experienced Full Stack Developer...', 
       'Remote', 
       'Technology', 
       'full-time', 
       '120000', 
       'open',
       NOW() - interval '5 days'),
      ('Product Designer', 
       'Join our design team to create amazing user experiences...', 
       'New York', 
       'Technology', 
       'full-time', 
       '100000', 
       'open',
       NOW() - interval '10 days'),
      ('Sales Representative', 
       'Drive business growth through strategic sales...', 
       'London', 
       'Sales', 
       'full-time', 
       '80000', 
       'open',
       NOW() - interval '15 days')
  ) AS j(title, description, location, industry, type, salary, status, created_at)
  WHERE c.user_id = 1;

  -- Get company_id for applicants
  DO \$\$ 
  DECLARE 
    v_company_id INTEGER;
  BEGIN
    SELECT c.id INTO v_company_id FROM companies c WHERE c.user_id = 1;

    -- Insert applicants for all job listings
    INSERT INTO applicants (
      job_listing_id,
      company_id,
      first_name,
      last_name,
      email,
      resume_path,
      cover_letter_path,
      linkedin_url,
      status,
      applied_date
    )
    SELECT 
      jl.id,
      v_company_id,
      a.first_name,
      a.last_name,
      a.email,
      a.resume_path,
      a.cover_letter_path,
      a.linkedin_url,
      a.status,
      a.applied_date
    FROM job_listings jl
    CROSS JOIN (
      VALUES 
        ('John', 'Doe', 'john.doe@email.com', '/resumes/jd.pdf', '/letters/jd.pdf', 'linkedin.com/in/johndoe', 'pending', NOW() - interval '2 days'),
        ('Sarah', 'Smith', 'sarah.smith@email.com', '/resumes/ss.pdf', '/letters/ss.pdf', 'linkedin.com/in/sarahsmith', 'under_review', NOW() - interval '5 days'),
        ('Michael', 'Johnson', 'michael.j@email.com', '/resumes/mj.pdf', '/letters/mj.pdf', 'linkedin.com/in/michaelj', 'interviewing', NOW() - interval '7 days'),
        ('Emma', 'Wilson', 'emma.w@email.com', '/resumes/ew.pdf', '/letters/ew.pdf', 'linkedin.com/in/emmaw', 'accepted', NOW() - interval '10 days'),
        ('David', 'Brown', 'david.b@email.com', '/resumes/db.pdf', '/letters/db.pdf', 'linkedin.com/in/davidb', 'rejected', NOW() - interval '12 days')
    ) AS a(first_name, last_name, email, resume_path, cover_letter_path, linkedin_url, status, applied_date)
    WHERE jl.company_id = v_company_id;

    -- Insert applicant notes
    INSERT INTO applicant_notes (
      applicant_id,
      user_id,
      content,
      created_at
    )
    SELECT 
      a.id,
      1,
      n.content,
      n.created_at
    FROM applicants a
    CROSS JOIN (
      VALUES 
        ('Strong technical background', NOW() - interval '1 day'),
        ('Good communication skills', NOW() - interval '2 days'),
        ('Great cultural fit', NOW() - interval '3 days'),
        ('Needs more experience', NOW() - interval '4 days'),
        ('Consider for other positions', NOW() - interval '5 days')
    ) AS n(content, created_at)
    WHERE a.company_id = v_company_id;
  END;
  \$\$;

  -- Insert sample applicant activities
  INSERT INTO applicant_activity (
    applicant_id,
    user_id,
    activity_type,
    old_value,
    new_value,
    created_at
  )
  SELECT 
    a.id,
    1, -- Admin user
    act.activity_type,
    act.old_value,
    act.new_value,
    act.created_at
  FROM applicants a
  CROSS JOIN (
    VALUES 
      ('status_change', 'pending', 'under_review', NOW() - interval '2 days'),
      ('note_added', NULL, 'Excellent technical skills', NOW() - interval '2 days 2 hours'),
      ('status_change', 'under_review', 'interviewing', NOW() - interval '1 day'),
      ('interview_scheduled', NULL, '2024-03-20 14:00:00', NOW() - interval '1 day 3 hours'),
      ('feedback_added', NULL, 'Great communication skills', NOW() - interval '12 hours'),
      ('status_change', 'interviewing', 'accepted', NOW() - interval '6 hours'),
      ('document_added', NULL, 'offer_letter.pdf', NOW() - interval '4 hours')
  ) AS act(activity_type, old_value, new_value, created_at)
  WHERE a.company_id = (
    SELECT id FROM companies WHERE user_id = 1
  );

  -- Add some more varied activities for different applicants
  INSERT INTO applicant_activity (
    applicant_id,
    user_id,
    activity_type,
    old_value,
    new_value,
    created_at
  )
  SELECT 
    a.id,
    1,
    'status_change',
    'pending',
    CASE (RANDOM() * 4)::INT
      WHEN 0 THEN 'under_review'
      WHEN 1 THEN 'interviewing'
      WHEN 2 THEN 'accepted'
      ELSE 'rejected'
    END,
    NOW() - (RANDOM() * interval '5 days')
  FROM applicants a
  WHERE a.company_id = (
    SELECT id FROM companies WHERE user_id = 1
  )
  AND a.id % 2 = 0;  -- Add activities for every other applicant

  -- Add some interview feedback
  INSERT INTO applicant_activity (
    applicant_id,
    user_id,
    activity_type,
    old_value,
    new_value,
    created_at
  )
  SELECT 
    a.id,
    1,
    'feedback_added',
    NULL,
    feedback,
    NOW() - (RANDOM() * interval '3 days')
  FROM applicants a
  CROSS JOIN (
    VALUES 
      ('Strong problem-solving abilities'),
      ('Good cultural fit'),
      ('Needs more experience in backend development'),
      ('Excellent project management skills'),
      ('Great team player')
  ) AS f(feedback)
  WHERE a.status = 'interviewing'
  AND a.company_id = (
    SELECT id FROM companies WHERE user_id = 1
  );

  -- Print success message
  SELECT 'Database populated with dummy data successfully!' AS status;
EOSQL

echo "Database population complete!"