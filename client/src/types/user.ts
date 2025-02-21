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
    holiday_time?: string;
    mobile_number?: string;
    starting_date?: string;
    id_document?: string;
    emergency_contact?: string;
}