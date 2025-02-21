export interface Employee {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    job_title?: string;
    team_name?: string;
    manager_name?: string;
    starting_date: string;
}

export interface EmployeeFormData {
    // User data
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: 'employee' | 'recruiter' | 'admin' | null;

    // Employee data
    job_title: string;
    team_id: number;
    department_id: number;
    manager_id: number | null;
    starting_date: string;
    mobile_number: string;
    job_level: string;
    salary: string;
    employment_type: 'full_time' | 'part_time' | 'contract';
    is_manager: boolean;
}   