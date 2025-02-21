export type UserRole = 'employee' | 'recruiter' | 'admin';

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