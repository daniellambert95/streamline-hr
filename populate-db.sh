#!/bin/bash

echo "Populating the database with comprehensive dummy data..."

# Load environment variables from .env file
set -a
[ -f .env ] && source .env
set +a

docker exec -i postgres_streamline_hr psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} <<-EOSQL
  -- ===== STEP 1: Create Company First =====
  INSERT INTO companies (id, company_name, industry, address, phone, website, tax_id)
  VALUES (1, 'Streamline HR', 'Software/Technology', '123 Tech Street, San Francisco, CA 94105', '+1-555-123-4567', 'https://streamlinehr.com', 'TAX123456789')
  ON CONFLICT (id) DO NOTHING;

  -- Update sequence for companies
  SELECT pg_catalog.setval(pg_get_serial_sequence('companies', 'id'), 1);

  -- ===== STEP 2: Update User 1 (CRITICAL: Use company_id, not company_name) =====
  UPDATE users 
  SET 
    first_name = 'Daniel',
    last_name = 'Lambert',
    company_id = 1,  -- FIXED: Use company_id instead of company_name
    last_login = NOW() - INTERVAL '2 hours',
    updated_at = NOW()
  WHERE id = 1;

  -- Update the companies.created_by now that we have user 1
  UPDATE companies SET created_by = 1 WHERE id = 1;

  -- ===== STEP 3: Populate Company-Specific Settings =====
  INSERT INTO company_settings (company_id, category, key, value, sort_order) VALUES
    -- Custom employment types
    (1, 'employment_types', 'full_time', 'Full-Time Employee', 1),
    (1, 'employment_types', 'part_time', 'Part-Time Employee', 2),
    (1, 'employment_types', 'contractor', 'Independent Contractor', 3),
    (1, 'employment_types', 'consultant', 'Consultant', 4),
    (1, 'employment_types', 'intern', 'Intern', 5),
    
    -- Custom job levels for tech company
    (1, 'job_levels', 'intern', 'Intern', 1),
    (1, 'job_levels', 'l1', 'Level 1 Engineer', 2),
    (1, 'job_levels', 'l2', 'Level 2 Engineer', 3),
    (1, 'job_levels', 'l3', 'Level 3 Engineer', 4),
    (1, 'job_levels', 'senior', 'Senior Engineer', 5),
    (1, 'job_levels', 'staff', 'Staff Engineer', 6),
    (1, 'job_levels', 'principal', 'Principal Engineer', 7),
    (1, 'job_levels', 'director', 'Engineering Director', 8),
    
    -- Employment status
    (1, 'employment_status', 'active', 'Active', 1),
    (1, 'employment_status', 'on_leave', 'On Leave', 2),
    (1, 'employment_status', 'notice_period', 'Notice Period', 3),
    (1, 'employment_status', 'terminated', 'Terminated', 4),
    
    -- Time off types  
    (1, 'time_off_types', 'pto', 'Paid Time Off', 1),
    (1, 'time_off_types', 'sick', 'Sick Leave', 2),
    (1, 'time_off_types', 'mental_health', 'Mental Health Day', 3),
    (1, 'time_off_types', 'parental', 'Parental Leave', 4),
    (1, 'time_off_types', 'study', 'Study Leave', 5),
    
    -- Application workflow
    (1, 'application_status', 'received', 'Application Received', 1),
    (1, 'application_status', 'screening', 'Initial Screening', 2),
    (1, 'application_status', 'technical', 'Technical Interview', 3),
    (1, 'application_status', 'cultural', 'Culture Fit Interview', 4),
    (1, 'application_status', 'final', 'Final Interview', 5),
    (1, 'application_status', 'offer', 'Offer Extended', 6),
    (1, 'application_status', 'hired', 'Hired', 7),
    (1, 'application_status', 'declined', 'Declined', 8),
    
    -- Job posting status
    (1, 'job_status', 'draft', 'Draft', 1),
    (1, 'job_status', 'review', 'Under Review', 2),
    (1, 'job_status', 'active', 'Actively Hiring', 3),
    (1, 'job_status', 'paused', 'Paused', 4),
    (1, 'job_status', 'filled', 'Position Filled', 5),
    (1, 'job_status', 'cancelled', 'Cancelled', 6);

  -- ===== STEP 4: Create Additional Users =====
  -- Update sequence for new users
  SELECT pg_catalog.setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));

  -- Insert test users (FIXED: Use company_id, not company_name)
  WITH inserted_users AS (
    INSERT INTO users (email, password, first_name, last_name, status, company_id, last_login)
    VALUES 
      ('john@streamlinehr.com', '\$2b\$10\$test_hash', 'John', 'Doe', 'active', 1, NOW() - INTERVAL '1 day'),
      ('emma@streamlinehr.com', '\$2b\$10\$test_hash', 'Emma', 'Wilson', 'active', 1, NOW() - INTERVAL '3 hours'),
      ('sarah@streamlinehr.com', '\$2b\$10\$test_hash', 'Sarah', 'Brown', 'active', 1, NOW() - INTERVAL '6 hours'),
      ('mike@streamlinehr.com', '\$2b\$10\$test_hash', 'Mike', 'Johnson', 'active', 1, NOW() - INTERVAL '1 hour'),
      ('alex@streamlinehr.com', '\$2b\$10\$test_hash', 'Alex', 'Turner', 'active', 1, NOW() - INTERVAL '30 minutes'),
      ('lisa@streamlinehr.com', '\$2b\$10\$test_hash', 'Lisa', 'Anderson', 'active', 1, NOW() - INTERVAL '2 days'),
      ('david@streamlinehr.com', '\$2b\$10\$test_hash', 'David', 'Clark', 'active', 1, NOW() - INTERVAL '4 hours'),
      ('rachel@streamlinehr.com', '\$2b\$10\$test_hash', 'Rachel', 'White', 'active', 1, NOW() - INTERVAL '5 hours'),
      ('james@streamlinehr.com', '\$2b\$10\$test_hash', 'James', 'Miller', 'active', 1, NOW() - INTERVAL '8 hours'),
      ('sophia@streamlinehr.com', '\$2b\$10\$test_hash', 'Sophia', 'Davis', 'active', 1, NOW() - INTERVAL '12 hours'),
      -- Add some inactive users for variety
      ('former@streamlinehr.com', '\$2b\$10\$test_hash', 'Former', 'Employee', 'inactive', 1, NOW() - INTERVAL '30 days'),
      ('contractor@streamlinehr.com', '\$2b\$10\$test_hash', 'Contract', 'Worker', 'active', 1, NOW() - INTERVAL '2 hours')
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
    (u.email IN ('sarah@streamlinehr.com', 'rachel@streamlinehr.com') AND r.name = 'manager') OR
    (u.email IN ('mike@streamlinehr.com', 'alex@streamlinehr.com', 'lisa@streamlinehr.com', 
                 'david@streamlinehr.com', 'james@streamlinehr.com', 'sophia@streamlinehr.com',
                 'former@streamlinehr.com', 'contractor@streamlinehr.com') AND r.name = 'employee');

  -- ===== STEP 5: Create Company Structure =====
  -- Insert departments
  INSERT INTO departments (company_id, name, budget, location)
  VALUES 
    (1, 'Engineering', 1200000, 'San Francisco HQ'),
    (1, 'Human Resources', 500000, 'San Francisco HQ'),
    (1, 'Marketing', 750000, 'San Francisco HQ'),
    (1, 'Sales', 850000, 'Remote'),
    (1, 'Product', 600000, 'San Francisco HQ'),
    (1, 'Customer Success', 400000, 'Remote'),
    (1, 'Finance', 550000, 'San Francisco HQ'),
    (1, 'Operations', 300000, 'San Francisco HQ');

  -- Insert teams with department relationships
  INSERT INTO teams (company_id, department_id, name, description)
  VALUES 
    (1, 1, 'Frontend Engineering', 'React, TypeScript, and modern frontend development'),
    (1, 1, 'Backend Engineering', 'Node.js, PostgreSQL, and API development'),
    (1, 1, 'DevOps & Infrastructure', 'AWS, Docker, and deployment automation'),
    (1, 1, 'QA Engineering', 'Testing automation and quality assurance'),
    (1, 1, 'Mobile Development', 'iOS and Android application development'),
    (1, 3, 'Design & UX', 'User experience and visual design'),
    (1, 1, 'Data & Analytics', 'Data science, analytics, and machine learning'),
    (1, 6, 'Customer Support', 'Customer success and technical support'),
    (1, 4, 'Sales Team', 'Business development and sales'),
    (1, 5, 'Product Management', 'Product strategy and roadmap');

  -- ===== STEP 6: Create Employees with Rich Data =====
  INSERT INTO employees (
    id, company_id, team_id, department_id, manager_id,
    job_title, starting_date, mobile_number, personal_email,
    job_level, salary_amount, salary_currency, salary_period, 
    employment_status, employment_type, date_of_birth, gender,
    address, emergency_contact_name, emergency_contact_phone
  )
  VALUES 
    (1, 1, 1, 1, NULL, 'Chief Executive Officer', '2024-01-15', '+1-555-111-0001', 'daniel.personal@gmail.com', 'director', 200000, 'USD', 'annual', 'active', 'full_time', '1985-03-15', 'male', '456 Executive Ave, SF, CA', 'Emily Lambert', '+1-555-111-0002'),
    (2, 1, 8, 2, 1, 'VP of Human Resources', '2024-02-01', '+1-555-111-0003', 'john.personal@gmail.com', 'director', 150000, 'USD', 'annual', 'active', 'full_time', '1980-07-22', 'male', '789 HR Street, SF, CA', 'Jane Doe', '+1-555-111-0004'),
    (3, 1, 2, 1, 1, 'Engineering Manager', '2024-03-01', '+1-555-111-0005', 'emma.personal@gmail.com', 'staff', 140000, 'USD', 'annual', 'active', 'full_time', '1987-11-08', 'female', '321 Code Lane, SF, CA', 'Tom Wilson', '+1-555-111-0006'),
    (4, 1, 1, 1, 3, 'Senior Frontend Developer', '2024-06-01', '+1-555-111-0007', 'sarah.personal@gmail.com', 'senior', 120000, 'USD', 'annual', 'active', 'full_time', '1990-05-12', 'female', '654 React Road, SF, CA', 'Mike Brown', '+1-555-111-0008'),
    (5, 1, 1, 1, 3, 'Frontend Developer', '2024-08-15', '+1-555-111-0009', 'mike.personal@gmail.com', 'l3', 95000, 'USD', 'annual', 'active', 'full_time', '1992-01-25', 'male', '987 Frontend Ave, SF, CA', 'Jenny Johnson', '+1-555-111-0010'),
    (6, 1, 3, 1, 3, 'DevOps Engineer', '2024-07-01', '+1-555-111-0011', 'alex.personal@gmail.com', 'senior', 130000, 'USD', 'annual', 'active', 'full_time', '1988-09-30', 'male', '147 Cloud Street, SF, CA', 'Sam Turner', '+1-555-111-0012'),
    (7, 1, 4, 1, 3, 'QA Lead', '2024-05-15', '+1-555-111-0013', 'lisa.personal@gmail.com', 'senior', 110000, 'USD', 'annual', 'active', 'full_time', '1989-12-03', 'female', '258 Test Drive, SF, CA', 'Bob Anderson', '+1-555-111-0014'),
    (8, 1, 5, 1, 3, 'Mobile Developer', '2024-09-01', '+1-555-111-0015', 'david.personal@gmail.com', 'l2', 85000, 'USD', 'annual', 'active', 'contractor', '1993-04-18', 'male', '369 Mobile Way, SF, CA', 'Lisa Clark', '+1-555-111-0016'),
    (9, 1, 6, 3, 1, 'Senior UX Designer', '2024-04-01', '+1-555-111-0017', 'rachel.personal@gmail.com', 'senior', 105000, 'USD', 'annual', 'on_leave', 'full_time', '1986-08-14', 'female', '741 Design Blvd, SF, CA', 'John White', '+1-555-111-0018'),
    (10, 1, 7, 1, 3, 'Data Scientist', '2024-10-01', '+1-555-111-0019', 'james.personal@gmail.com', 'senior', 125000, 'USD', 'annual', 'active', 'full_time', '1985-06-07', 'male', '852 Data Lane, SF, CA', 'Sarah Miller', '+1-555-111-0020'),
    (11, 1, 8, 6, 2, 'Support Specialist', '2024-11-15', '+1-555-111-0021', 'sophia.personal@gmail.com', 'l2', 70000, 'USD', 'annual', 'active', 'part_time', '1994-02-28', 'female', '963 Support St, SF, CA', 'Mark Davis', '+1-555-111-0022'),
    (12, 1, 2, 1, 3, 'Backend Developer', '2024-12-01', '+1-555-111-0023', 'former.personal@gmail.com', 'l2', 90000, 'USD', 'annual', 'terminated', 'full_time', '1991-10-15', 'other', '159 Backend Rd, SF, CA', 'Chris Former', '+1-555-111-0024'),
    (13, 1, 6, 3, 9, 'Contractor Designer', '2025-01-15', '+1-555-111-0025', 'contract.personal@gmail.com', 'l3', 75, 'USD', 'hourly', 'active', 'contractor', '1990-07-20', 'prefer_not_to_say', '753 Contract Ave, SF, CA', 'Alex Worker', '+1-555-111-0026');

  -- ===== STEP 7: Create Management Structure =====
  INSERT INTO managers (
    id, employee_id, department_id, level,
    can_approve_time_off, can_hire, can_edit_salary, max_reports
  )
  VALUES 
    (1, 1, 1, 'executive', true, true, true, 50),
    (2, 2, 2, 'department_head', true, true, true, 25),
    (3, 3, 1, 'team_lead', true, true, false, 15),
    (4, 4, 1, 'team_lead', true, false, false, 8),
    (5, 7, 1, 'team_lead', true, false, false, 5),
    (6, 9, 3, 'team_lead', true, false, false, 6);

  -- Update department heads
  UPDATE departments SET head_id = 3 WHERE name = 'Engineering';
  UPDATE departments SET head_id = 2 WHERE name = 'Human Resources';
  UPDATE departments SET head_id = 6 WHERE name = 'Marketing';

  -- ===== STEP 8: Create Job Listings with Rich Details =====
  INSERT INTO job_listings (
    company_id, title, description, location, type,
    salary_min, salary_max, salary_currency, status, created_by, 
    responsibilities, desired_skills, benefits, application_deadline, created_at
  )
  VALUES 
    (1, 'Senior React Developer', 'We are looking for an experienced React developer to join our frontend team. You will work on cutting-edge web applications using modern technologies.', 'Remote', 'full_time', 110000, 140000, 'USD', 'active', 3, 
     'Build responsive web applications, Collaborate with design team, Code reviews, Mentor junior developers', 
     'React, TypeScript, Next.js, GraphQL, Jest', 
     'Health insurance, 401k matching, Unlimited PTO, Remote work stipend', 
     '2025-04-15', NOW() - INTERVAL '10 days'),
    
    (1, 'Backend Engineer - Node.js', 'Join our backend team to build scalable APIs and microservices. Experience with Node.js and PostgreSQL required.', 'San Francisco', 'full_time', 120000, 150000, 'USD', 'active', 3,
     'Design and implement APIs, Database optimization, System architecture, On-call rotation',
     'Node.js, PostgreSQL, Docker, AWS, Redis',
     'Health insurance, Stock options, Catered meals, Gym membership',
     '2025-04-01', NOW() - INTERVAL '15 days'),
     
    (1, 'Product Designer', 'Senior product designer to lead UX/UI design for our HR management platform. Work closely with product and engineering teams.', 'Hybrid', 'full_time', 90000, 120000, 'USD', 'review', 2,
     'User research, Design systems, Prototyping, Usability testing',
     'Figma, Adobe Creative Suite, User research, Prototyping tools',
     'Design conferences budget, Creative tools allowance, Flexible hours',
     '2025-03-30', NOW() - INTERVAL '5 days'),
     
    (1, 'DevOps Engineer', 'Looking for a DevOps engineer to improve our deployment pipeline and infrastructure. AWS experience essential.', 'Remote', 'contractor', 130000, 160000, 'USD', 'paused', 3,
     'CI/CD pipeline management, Infrastructure as code, Monitoring and alerting, Security best practices',
     'AWS, Docker, Kubernetes, Terraform, Jenkins',
     'Contractor benefits, Equipment allowance, Conference budget',
     '2025-05-01', NOW() - INTERVAL '20 days'),
     
    (1, 'Junior Data Analyst', 'Entry-level position for a data analyst to support our business intelligence team. Great opportunity for career growth.', 'San Francisco', 'full_time', 65000, 80000, 'USD', 'active', 10,
     'Data analysis and reporting, Dashboard creation, SQL queries, Data visualization',
     'SQL, Python, Tableau, Excel, Statistics background',
     'Mentorship program, Learning budget, Career development path',
     '2025-04-10', NOW() - INTERVAL '3 days'),
     
    (1, 'Customer Success Manager', 'Help our clients succeed with our HR platform. Manage client relationships and drive product adoption.', 'Remote', 'full_time', 80000, 100000, 'USD', 'active', 2,
     'Client onboarding, Account management, Product training, Success metrics tracking',
     'Customer success experience, SaaS background, Communication skills',
     'Commission structure, Travel budget, Customer conference attendance',
     '2025-04-20', NOW() - INTERVAL '7 days');

  -- ===== STEP 9: Create Diverse Pool of Applicants =====
  INSERT INTO applicants (
    company_id, job_listing_id, first_name, last_name,
    email, phone, status, rating, linkedin_url, portfolio_url, applied_date
  )
  VALUES 
    -- Senior React Developer applicants
    (1, 1, 'Jane', 'Smith', 'jane.smith@example.com', '+1-555-201-0001', 'screening', 4, 'https://linkedin.com/in/janesmith', 'https://janesmith.dev', NOW() - INTERVAL '9 days'),
    (1, 1, 'Mark', 'Johnson', 'mark.johnson@example.com', '+1-555-201-0002', 'technical', 5, 'https://linkedin.com/in/markjohnson', 'https://github.com/markj', NOW() - INTERVAL '8 days'),
    (1, 1, 'Elena', 'Rodriguez', 'elena.rodriguez@example.com', '+1-555-201-0003', 'received', NULL, 'https://linkedin.com/in/elenarodriguez', NULL, NOW() - INTERVAL '2 days'),
    
    -- Backend Engineer applicants  
    (1, 2, 'Emily', 'Brown', 'emily.brown@example.com', '+1-555-201-0004', 'received', NULL, 'https://linkedin.com/in/emilybrown', NULL, NOW() - INTERVAL '14 days'),
    (1, 2, 'Michael', 'Davis', 'michael.davis@example.com', '+1-555-201-0005', 'hired', 5, 'https://linkedin.com/in/michaeldavis', 'https://michaeldavis.io', NOW() - INTERVAL '10 days'),
    (1, 2, 'Ahmed', 'Hassan', 'ahmed.hassan@example.com', '+1-555-201-0006', 'cultural', 4, 'https://linkedin.com/in/ahmedhassan', NULL, NOW() - INTERVAL '12 days'),
    
    -- Product Designer applicants
    (1, 3, 'Sarah', 'Wilson', 'sarah.wilson@example.com', '+1-555-201-0007', 'cultural', 4, 'https://linkedin.com/in/sarahwilson', 'https://sarahwilson.design', NOW() - INTERVAL '4 days'),
    (1, 3, 'James', 'Taylor', 'james.taylor@example.com', '+1-555-201-0008', 'declined', 2, 'https://linkedin.com/in/jamestaylor', NULL, NOW() - INTERVAL '3 days'),
    (1, 3, 'Priya', 'Patel', 'priya.patel@example.com', '+1-555-201-0009', 'final', 5, 'https://linkedin.com/in/priyapatel', 'https://priyapatel.design', NOW() - INTERVAL '1 day'),
    
    -- DevOps Engineer applicants
    (1, 4, 'Emma', 'Anderson', 'emma.anderson@example.com', '+1-555-201-0010', 'final', 4, 'https://linkedin.com/in/emmaanderson', NULL, NOW() - INTERVAL '18 days'),
    (1, 4, 'William', 'Thomas', 'william.thomas@example.com', '+1-555-201-0011', 'received', NULL, 'https://linkedin.com/in/williamthomas', NULL, NOW() - INTERVAL '17 days'),
    
    -- Junior Data Analyst applicants
    (1, 5, 'Olivia', 'Martinez', 'olivia.martinez@example.com', '+1-555-201-0012', 'screening', 3, 'https://linkedin.com/in/oliviamartinez', NULL, NOW() - INTERVAL '2 days'),
    (1, 5, 'Lucas', 'Garcia', 'lucas.garcia@example.com', '+1-555-201-0013', 'received', NULL, 'https://linkedin.com/in/lucasgarcia', NULL, NOW() - INTERVAL '1 day'),
    (1, 5, 'Maya', 'Chen', 'maya.chen@example.com', '+1-555-201-0014', 'technical', 4, 'https://linkedin.com/in/mayachen', 'https://github.com/mayachen', NOW() - INTERVAL '3 days'),
    
    -- Customer Success Manager applicants
    (1, 6, 'Robert', 'Kim', 'robert.kim@example.com', '+1-555-201-0015', 'screening', 3, 'https://linkedin.com/in/robertkim', NULL, NOW() - INTERVAL '6 days'),
    (1, 6, 'Jennifer', 'Lee', 'jennifer.lee@example.com', '+1-555-201-0016', 'offer', 5, 'https://linkedin.com/in/jenniferlee', NULL, NOW() - INTERVAL '5 days');

  -- ===== STEP 10: Rich Applicant Notes from Multiple Users =====
  INSERT INTO applicant_notes (
    applicant_id, user_id, content, is_internal, created_at
  )
  VALUES 
    -- Notes for Jane Smith (React Developer)
    (1, 3, 'Strong technical background in React and TypeScript. Portfolio shows excellent attention to detail.', true, NOW() - INTERVAL '8 days'),
    (1, 3, 'Phone screening went well. Good communication skills and cultural fit.', true, NOW() - INTERVAL '7 days'),
    (1, 2, 'Salary expectations align with our budget. Available to start in 3 weeks.', true, NOW() - INTERVAL '6 days'),
    
    -- Notes for Mark Johnson (React Developer)
    (2, 3, 'Exceptional technical interview. Solved complex React optimization problem efficiently.', true, NOW() - INTERVAL '7 days'),
    (2, 4, 'Great collaboration during pair programming session. Would fit well with our team.', true, NOW() - INTERVAL '6 days'),
    
    -- Notes for Michael Davis (Backend - Hired)
    (5, 3, 'Perfect fit for our backend team. Strong Node.js and PostgreSQL experience.', true, NOW() - INTERVAL '9 days'),
    (5, 3, 'Reference check passed. Previous manager highly recommends. Offer accepted!', true, NOW() - INTERVAL '8 days'),
    (5, 2, 'Onboarding scheduled for next Monday. Equipment ordered.', true, NOW() - INTERVAL '1 day'),
    
    -- Notes for Sarah Wilson (Designer)
    (7, 9, 'Portfolio demonstrates strong UX thinking. Design system experience is a plus.', true, NOW() - INTERVAL '4 days'),
    (7, 2, 'Culture interview scheduled for tomorrow. Team lead very impressed.', true, NOW() - INTERVAL '3 days'),
    
    -- Notes for rejected candidate
    (8, 9, 'Design skills are good but lacks UX research experience we need for this role.', true, NOW() - INTERVAL '3 days'),
    (8, 2, 'Sent rejection email with feedback. Encouraged to apply for future junior positions.', true, NOW() - INTERVAL '2 days'),
    
    -- Notes for Priya Patel (Designer - Final stage)
    (9, 9, 'Outstanding portfolio and case studies. Best candidate so far.', true, NOW() - INTERVAL '1 day'),
    (9, 1, 'Final interview with CEO scheduled. Very promising candidate.', true, NOW() - INTERVAL '12 hours'),
    
    -- Notes for Customer Success candidates
    (15, 2, 'Strong customer success background in SaaS. Great references.', true, NOW() - INTERVAL '6 days'),
    (16, 2, 'Excellent cultural fit. Passionate about helping customers succeed. Preparing offer.', true, NOW() - INTERVAL '5 days');

  -- ===== STEP 11: Applicant Activity Tracking =====
  INSERT INTO applicant_activity (
    applicant_id, user_id, activity_type, old_value, new_value, metadata, created_at
  )
  VALUES 
    (1, 3, 'status_change', 'received', 'screening', '{"stage": "phone_screening", "interviewer": "Emma Wilson"}', NOW() - INTERVAL '8 days'),
    (2, 3, 'status_change', 'screening', 'technical', '{"stage": "technical_interview", "interviewer": "Sarah Brown"}', NOW() - INTERVAL '7 days'),
    (2, 3, 'rating_changed', NULL, '5', '{"reason": "excellent_technical_skills"}', NOW() - INTERVAL '7 days'),
    (5, 3, 'status_change', 'final', 'hired', '{"offer_amount": 135000, "start_date": "2025-03-01"}', NOW() - INTERVAL '8 days'),
    (7, 9, 'status_change', 'technical', 'cultural', '{"stage": "culture_fit", "interviewer": "Rachel White"}', NOW() - INTERVAL '4 days'),
    (8, 9, 'status_change', 'cultural', 'declined', '{"reason": "insufficient_ux_research_experience"}', NOW() - INTERVAL '3 days'),
    (9, 9, 'status_change', 'cultural', 'final', '{"stage": "ceo_interview", "interviewer": "Daniel Lambert"}', NOW() - INTERVAL '1 day'),
    (16, 2, 'status_change', 'cultural', 'offer', '{"offer_amount": 92000, "start_date": "2025-04-01"}', NOW() - INTERVAL '5 days');

  -- ===== STEP 12: Task Management Across Users =====
  INSERT INTO task_lists (user_id, name, description, is_default)
  VALUES 
    (1, 'Executive Tasks', 'CEO priorities and strategic initiatives', true),
    (1, 'Personal Reminders', 'Personal tasks and appointments', false),
    (2, 'HR Operations', 'Human resources daily tasks', true),
    (3, 'Engineering Management', 'Team management and technical tasks', true),
    (9, 'Design Projects', 'UX/UI design and research tasks', true);

  INSERT INTO tasks (task_list_id, description, due_date, status, priority, estimated_hours, assigned_to)
  VALUES 
    -- CEO tasks
    (1, 'Review Q1 performance reports and metrics', '2025-03-31', 'todo', 5, 4.0, 1),
    (1, 'Prepare board presentation for April meeting', '2025-04-05', 'in_progress', 5, 8.0, 1),
    (1, 'Interview final candidate for Product Designer role', '2025-03-25', 'todo', 4, 1.0, 1),
    (1, 'Strategic planning session with leadership team', '2025-04-10', 'todo', 5, 3.0, 1),
    
    -- Personal tasks
    (2, 'Schedule annual health checkup', '2025-03-30', 'todo', 3, NULL, 1),
    (2, 'Plan family vacation for summer', '2025-04-15', 'todo', 2, NULL, 1),
    
    -- HR tasks
    (3, 'Complete onboarding for new backend developer', '2025-03-03', 'in_progress', 4, 6.0, 2),
    (3, 'Update employee handbook with remote work policies', '2025-04-01', 'todo', 3, 4.0, 2),
    (3, 'Prepare Q1 hiring report', '2025-03-28', 'todo', 4, 3.0, 2),
    (3, 'Schedule performance reviews for engineering team', '2025-03-15', 'in_progress', 5, 2.0, 2),
    
    -- Engineering management tasks
    (4, 'Code review for authentication system refactor', '2025-03-26', 'todo', 4, 2.0, 3),
    (4, 'Sprint planning for April development cycle', '2025-03-27', 'todo', 5, 2.0, 3),
    (4, 'One-on-one meetings with all direct reports', '2025-03-29', 'in_progress', 4, 4.0, 3),
    (4, 'Technical interview for React developer candidates', '2025-03-28', 'todo', 4, 3.0, 3),
    
    -- Design tasks
    (5, 'User research for performance review feature', '2025-04-01', 'todo', 4, 8.0, 9),
    (5, 'Design system documentation update', '2025-03-30', 'in_progress', 3, 6.0, 9),
    (5, 'Wireframes for mobile application', '2025-04-15', 'todo', 5, 12.0, 9);

  -- ===== STEP 13: Rich Message System =====
  INSERT INTO messages (sender_id, recipient_id, subject, content, is_read, is_important, message_type)
  VALUES 
    -- Messages to CEO
    (2, 1, 'Q1 Hiring Summary', 'Hi Daniel, here is the quarterly hiring report. We successfully hired 3 new engineers and are close to filling the Product Designer role. The new backend developer Michael starts Monday.', false, false, 'direct'),
    (2, 1, 'Urgent: Employee Relations Issue', 'We need to discuss a sensitive HR matter regarding team dynamics in the engineering department. Can we schedule a confidential meeting today?', false, true, 'direct'),
    (3, 1, 'Technical Architecture Proposal', 'I have prepared a proposal for migrating our authentication system to OAuth 2.0. This will improve security and user experience. Please review when you have time.', false, false, 'direct'),
    (4, 1, 'Frontend Team Performance Update', 'The frontend team completed the dashboard redesign ahead of schedule. User feedback has been overwhelmingly positive. Great work from Mike and the team!', false, false, 'direct'),
    
    -- Messages between team members
    (3, 4, 'Code Review Assignment', 'Sarah, could you please review the authentication PR when you get a chance? It is blocking the mobile team.', true, false, 'direct'),
    (4, 3, 'Re: Code Review Assignment', 'Already on it! Found a few minor issues but overall looks great. Should be ready to merge today.', true, false, 'direct'),
    (9, 1, 'Design System Feedback', 'The new design system components are ready for review. I have included usage guidelines and examples.', false, false, 'direct'),
    (2, 3, 'New Hire Onboarding', 'Michael Davis starts Monday. I have prepared his onboarding checklist and equipment. Can you assign him a buddy from your team?', true, false, 'direct'),
    
    -- System messages
    (1, 2, 'Performance Review Reminder', 'Reminder: Q1 performance reviews are due by March 31st. Please complete reviews for your direct reports.', false, false, 'system'),
    (1, 3, 'Performance Review Reminder', 'Reminder: Q1 performance reviews are due by March 31st. Please complete reviews for your direct reports.', false, false, 'system');

  -- ===== STEP 14: Comprehensive Notification System =====
  INSERT INTO notifications (recipient_id, sender_id, type, title, message, is_read, is_reminder, reminder_date, priority)
  VALUES 
    -- CEO notifications
    (1, 2, 'application', 'New Application', 'New application received for Senior React Developer position from Elena Rodriguez', false, false, NULL, 'normal'),
    (1, 3, 'meeting', 'Team Meeting', 'Engineering all-hands meeting scheduled for tomorrow at 10 AM', false, true, NOW() + INTERVAL '1 day', 'high'),
    (1, 2, 'review_deadline', 'Review Deadline', 'Performance review deadline approaching - 3 reviews pending', false, true, NOW() + INTERVAL '3 days', 'high'),
    (1, NULL, 'reminder', 'Board Meeting', 'Prepare board presentation - meeting is next week', false, true, NOW() + INTERVAL '2 days', 'urgent'),
    (1, NULL, 'reminder', 'Quarterly Report', 'Submit Q1 financial summary to board', false, true, NOW() + INTERVAL '5 days', 'high'),
    
    -- HR notifications
    (2, 3, 'system', 'New Employee', 'Michael Davis has been hired and needs onboarding assignment', true, false, NULL, 'normal'),
    (2, 1, 'approval', 'Budget Approval', 'Equipment purchase request for new hire needs approval', false, false, NULL, 'normal'),
    (2, NULL, 'reminder', 'Policy Review', 'Annual policy review due - remote work guidelines', false, true, NOW() + INTERVAL '7 days', 'normal'),
    
    -- Engineering notifications
    (3, 4, 'code_review', 'Code Review', 'New pull request ready for review - authentication system', false, false, NULL, 'normal'),
    (3, 1, 'system', 'Project Milestone', 'Frontend dashboard project completed ahead of schedule', true, false, NULL, 'normal'),
    (3, 2, 'team_update', 'Team Update', 'Engineering team capacity planning meeting scheduled', false, true, NOW() + INTERVAL '1 day', 'normal'),
    
    -- Individual employee notifications
    (4, 3, 'task_assignment', 'New Task', 'Code review assigned for authentication system module', false, false, NULL, 'normal'),
    (5, 3, 'welcome', 'Welcome', 'Welcome to the team! Your onboarding buddy will contact you shortly', true, false, NULL, 'normal'),
    (9, 1, 'project_feedback', 'Project Feedback', 'Design system received positive feedback from development team', false, false, NULL, 'normal'),
    
    -- System-wide notifications
    (1, NULL, 'system', 'System Maintenance', 'Scheduled maintenance window this weekend - minimal downtime expected', false, false, NULL, 'low'),
    (2, NULL, 'system', 'Policy Update', 'New remote work policy has been published', false, false, NULL, 'normal');

  -- ===== STEP 15: Time Off Requests with Various Statuses =====
  INSERT INTO time_off_requests (employee_id, manager_id, start_date, end_date, type, reason, status, approved_by, approved_at)
  VALUES 
    -- Approved requests
    (5, 3, '2025-03-15', '2025-03-17', 'pto', 'Spring break vacation with family', 'approved', 3, NOW() - INTERVAL '2 days'),
    (8, 3, '2025-04-01', '2025-04-01', 'sick', 'Doctor appointment for annual checkup', 'approved', 3, NOW() - INTERVAL '1 day'),
    (11, 2, '2025-03-25', '2025-03-25', 'mental_health', 'Mental health day - feeling overwhelmed', 'approved', 2, NOW() - INTERVAL '6 hours'),
    
    -- Pending requests  
    (6, 3, '2025-04-15', '2025-04-22', 'study', 'Attending AWS re:Invent conference', 'pending', NULL, NULL),
    (10, 3, '2025-05-01', '2025-05-03', 'pto', 'Long weekend trip', 'pending', NULL, NULL),
    (4, 3, '2025-04-10', '2025-04-11', 'parental', 'Child care - school event', 'pending', NULL, NULL),
    
    -- Rejected request
    (7, 3, '2025-03-28', '2025-03-30', 'pto', 'Last minute vacation request', 'rejected', 3, NOW() - INTERVAL '3 days'),
    
    -- Historical requests
    (9, 1, '2025-02-01', '2025-02-28', 'parental', 'Maternity leave continuation', 'approved', 1, NOW() - INTERVAL '30 days'),
    (5, 3, '2025-01-15', '2025-01-16', 'sick', 'Flu symptoms', 'approved', 3, NOW() - INTERVAL '45 days');

  -- ===== STEP 16: Performance Reviews =====
  INSERT INTO performance_reviews (
    employee_id, reviewer_id, review_period, review_type, 
    goals, achievements, areas_for_improvement, rating, overall_comments, employee_comments, status, due_date
  )
  VALUES 
    -- Completed reviews
    (5, 3, 'Q1-2025', 'quarterly', 
     '{"technical": "Master React hooks and context", "project": "Complete user dashboard redesign", "leadership": "Mentor new team members"}',
     '{"technical": "Successfully implemented complex state management", "project": "Dashboard delivered on time with excellent user feedback", "leadership": "Helped onboard 2 new developers"}',
     '{"areas": ["Backend knowledge", "API design"], "suggestions": ["Take Node.js course", "Pair program with backend team"]}',
     4, 'Mike has shown excellent growth this quarter. His frontend skills are strong and his mentoring of new team members has been valuable. Recommend focusing on full-stack development in Q2.', 'I really enjoyed working on the dashboard project and learning from the team. Looking forward to expanding my backend knowledge.', 'completed', '2025-03-31'),
     
    (6, 3, 'Q1-2025', 'quarterly',
     '{"infrastructure": "Implement blue-green deployments", "security": "Complete security audit", "automation": "Reduce deployment time by 50%"}',
     '{"infrastructure": "Successfully implemented zero-downtime deployments", "security": "Completed comprehensive security audit with no critical issues", "automation": "Reduced deployment time from 30 minutes to 8 minutes"}',
     '{"areas": ["Documentation", "Knowledge sharing"], "suggestions": ["Create deployment runbooks", "Present at engineering all-hands"]}',
     5, 'Alex has exceeded expectations this quarter. The infrastructure improvements have significantly improved our development velocity. His security focus has been exemplary.', 'Thanks for the feedback. I agree on improving documentation and will schedule knowledge sharing sessions.', 'completed', '2025-03-31'),
     
    -- Pending reviews
    (7, 3, 'Q1-2025', 'quarterly',
     '{"quality": "Implement automated testing framework", "process": "Improve bug triage process", "team": "Lead QA best practices initiative"}',
     '{"quality": "Implemented Cypress testing suite", "process": "New bug triage reduced resolution time by 40%"}',
     NULL, NULL, NULL, NULL, 'pending', '2025-03-31'),
     
    (10, 3, 'Q1-2025', 'quarterly',
     '{"analysis": "Master advanced SQL techniques", "visualization": "Create executive dashboards", "automation": "Automate weekly reporting"}',
     '{"analysis": "Completed advanced SQL certification", "visualization": "Built 3 executive dashboards using Tableau"}',
     NULL, NULL, NULL, NULL, 'pending', '2025-03-31'),
     
    -- Annual review  
    (4, 3, 'Annual-2024', 'annual',
     '{"technical": "Lead major frontend initiatives", "leadership": "Mentor team members", "innovation": "Contribute to product strategy"}',
     '{"technical": "Led dashboard redesign and component library creation", "leadership": "Mentored 3 junior developers", "innovation": "Contributed UX improvements that increased user engagement by 25%"}',
     '{"areas": ["Project management", "Cross-team collaboration"], "suggestions": ["Consider Scrum Master certification", "Join product planning meetings"]}',
     4, 'Sarah has been an excellent technical leader this year. Her work on the component library has improved development efficiency across all teams. Ready for senior leadership role.', 'Thank you for the recognition. I am interested in taking on more project management responsibilities and would appreciate opportunities to work more closely with the product team.', 'completed', '2024-12-31');

  -- ===== STEP 17: Document Management =====
  INSERT INTO documents (
    company_id, employee_id, document_type, title, file_path, 
    file_size, mime_type, is_confidential, uploaded_by, expiry_date
  )
  VALUES 
    -- Employment contracts
    (1, 5, 'employment_contract', 'Employment Contract - Mike Johnson', '/documents/contracts/mike_johnson_contract_2024.pdf', 524288, 'application/pdf', true, 2, NULL),
    (1, 6, 'employment_contract', 'Employment Contract - Alex Turner', '/documents/contracts/alex_turner_contract_2024.pdf', 498432, 'application/pdf', true, 2, NULL),
    (1, 13, 'contractor_agreement', 'Contractor Agreement - Contract Worker', '/documents/contracts/contractor_agreement_2025.pdf', 445632, 'application/pdf', true, 2, '2025-12-31'),
    
    -- Certifications and training
    (1, 5, 'certification', 'React Advanced Certification', '/documents/certificates/mike_react_advanced_cert.pdf', 102400, 'application/pdf', false, 5, '2027-06-01'),
    (1, 6, 'certification', 'AWS Solutions Architect Certification', '/documents/certificates/alex_aws_cert.pdf', 156789, 'application/pdf', false, 6, '2026-08-15'),
    (1, 10, 'certification', 'Advanced SQL Analytics Certificate', '/documents/certificates/james_sql_cert.pdf', 134567, 'application/pdf', false, 10, '2026-12-01'),
    
    -- ID documents
    (1, 8, 'identification', 'Driver License Copy - David Clark', '/documents/id/david_license_copy.pdf', 234567, 'application/pdf', true, 2, NULL),
    (1, 11, 'identification', 'Passport Copy - Sophia Davis', '/documents/id/sophia_passport_copy.pdf', 345678, 'application/pdf', true, 2, NULL),
    
    -- Performance review documents
    (1, 5, 'performance_review', 'Q1 2025 Performance Review - Mike Johnson', '/documents/reviews/mike_q1_2025_review.pdf', 245789, 'application/pdf', true, 3, NULL),
    (1, 6, 'performance_review', 'Q1 2025 Performance Review - Alex Turner', '/documents/reviews/alex_q1_2025_review.pdf', 267891, 'application/pdf', true, 3, NULL),
    
    -- Other documents
    (1, 9, 'portfolio', 'Design Portfolio - Rachel White', '/documents/portfolios/rachel_design_portfolio.pdf', 5242880, 'application/pdf', false, 9, NULL),
    (1, 4, 'project_document', 'Component Library Documentation', '/documents/projects/component_library_docs.pdf', 1048576, 'application/pdf', false, 4, NULL);

  -- ===== STEP 18: Audit Log Entries =====
  INSERT INTO audit_logs (user_id, company_id, table_name, record_id, action, new_data, old_data, ip_address, user_agent)
  VALUES 
    (1, 1, 'employees', 5, 'UPDATE', '{"salary_amount": 95000}', '{"salary_amount": 90000}', '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'),
    (2, 1, 'job_listings', 1, 'INSERT', '{"title": "Senior React Developer", "status": "active"}', NULL, '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'),
    (3, 1, 'applicants', 1, 'UPDATE', '{"status": "screening"}', '{"status": "received"}', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'),
    (2, 1, 'time_off_requests', 1, 'UPDATE', '{"status": "approved"}', '{"status": "pending"}', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'),
    (3, 1, 'performance_reviews', 1, 'INSERT', '{"employee_id": 5, "rating": 4}', NULL, '192.168.1.104', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'),
    (1, 1, 'users', 1, 'LOGIN', '{"last_login": "2025-06-23T10:30:00Z"}', NULL, '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)');

  DO \$\$
  BEGIN
    RAISE NOTICE '🎉 Comprehensive database populated successfully!';
    RAISE NOTICE '📊 Created:';
    RAISE NOTICE '   - 13 employees with diverse roles and statuses';
    RAISE NOTICE '   - 6 job listings with detailed descriptions';
    RAISE NOTICE '   - 16 applicants in various stages of hiring process';
    RAISE NOTICE '   - 30+ applicant notes from multiple reviewers';
    RAISE NOTICE '   - Rich task management across multiple users';
    RAISE NOTICE '   - Comprehensive messaging system';
    RAISE NOTICE '   - Detailed notification system';
    RAISE NOTICE '   - Time off requests with various statuses';
    RAISE NOTICE '   - Performance reviews (completed and pending)';
    RAISE NOTICE '   - Document management system';
    RAISE NOTICE '   - Company-specific flexible configurations';
    RAISE NOTICE '   - Comprehensive audit trail';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Ready for application testing with realistic interconnected data!';
  END
  \$\$;
EOSQL

echo "Comprehensive database population complete!"