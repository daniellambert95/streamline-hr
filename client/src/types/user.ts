export type UserRole = 'admin' | 'recruiter' | 'employee' | 'manager';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  company_id?: number;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface AuthUser extends User {
  company_name?: string;
  job_title?: string;
  job_level?: string;
  starting_date?: Date;
  mobile_number?: string;
  salary?: string;
  leave_balance?: number;
  team_name?: string;
  team_id?: string;
  manager_name?: string;
  department_name?: string;
  department_id?: string;
  employment_status?: string;
  employment_type?: string;
  industry?: string;
  id_document?: string;
  personal_email?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
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