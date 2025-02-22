export type UserRole = 'admin' | 'recruiter' | 'employee';

export interface AuthUser {
  // User data
    id: number;
    email: string;
    role: UserRole;
    first_name: string;
    last_name: string;
    company_name: string;
    // Employee data
    job_title?: string;
    job_level?: string;
    team_name?: string;
    manager_name?: string;
    industry?: string;
    salary?: string;
    leave_balance?: number;
    mobile_number?: string;
    starting_date?: string;
    id_document?: string;
    personal_email?: string;
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'non-binary' | 'prefer_not_to_say';
    marital_status?: 'single' | 'married' | 'divorced' | 'widowed';
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
}