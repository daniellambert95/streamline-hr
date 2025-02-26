import { UserRole } from '../../users/types/user.types';

export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  company_id?: number;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

// Auth-specific types
export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  company_id?: number;
} 