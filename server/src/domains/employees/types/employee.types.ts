export interface Employee {
  id: number;
  company_id: number;
  department_id?: number;
  team_id?: number;
  manager_id?: number;
  job_title: string;
  starting_date: Date;
  employment_status: 'active' | 'inactive' | 'on_leave';
  employment_type: 'full_time' | 'part_time' | 'contract';
  salary: string;
  mobile_number?: string;
  job_level?: string;
  leave_balance?: number;
  bank_details?: string;
  id_document?: string;
  personal_email?: string;
  date_of_birth?: Date;
  gender?: string;
  marital_status?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  work_permit_status?: string;
  work_permit_expiry?: Date;
  health_insurance_provider?: string;
  tax_id?: string;
  probation_end_date?: Date;
  contract_end_date?: Date;
  last_promotion_date?: Date;
  
  // Joined fields
  email?: string;
  first_name?: string;
  last_name?: string;
  department_name?: string;
  team_name?: string;
  manager_name?: string;
  company_name?: string;
}

export interface EmployeeFormData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  company_id: number;
  department_id?: number;
  team_id?: number;
  job_title: string;
  starting_date: Date;
  employment_status?: 'active' | 'inactive' | 'on_leave';
  employment_type?: 'full_time' | 'part_time' | 'contract';
  salary?: string;
  role?: string;
  manager_id?: number;
} 