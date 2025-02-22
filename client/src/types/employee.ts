export interface Employee {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    job_title?: string;
    team_name?: string;
    manager_name?: string;
    starting_date: string;
    department: string;
    team: string;
    manager: string;
    status: 'active' | 'inactive' | 'onboarding' | 'on_leave';
    role: 'employee' | 'recruiter' | 'admin' | null;
    personal_email?: string;
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'non-binary' | 'prefer_not_to_say';
    marital_status?: string;
    address?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    work_permit_status?: string;
    work_permit_expiry?: string;
    health_insurance_provider?: string;
    tax_id?: string;
    probation_end_date?: string;
    contract_end_date?: string;
    last_promotion_date?: string;
    leave_balance: number;
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
    team_id: number | null;
    department_id: number | null;
    manager_id: number | null;
    starting_date: string;
    mobile_number: string;
    job_level: string;
    salary: string;
    employment_type: 'full_time' | 'part_time' | 'contract';
    is_manager?: boolean;
    status: 'active' | 'inactive' | 'onboarding' | 'on_leave';
    personal_email: string;
    date_of_birth: string | null;
    gender: 'male' | 'female' | 'non-binary' | 'prefer_not_to_say' | null;
    marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null;
    address: string | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    work_permit_status: string | null;
    work_permit_expiry: string | null;
    health_insurance_provider: string | null;
    tax_id: string | null;
    probation_end_date: string | null;
    contract_end_date: string | null;
    last_promotion_date: string | null;
    leave_balance: number | null;
}   