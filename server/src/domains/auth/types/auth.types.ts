import { UserRole } from '../../users/types/user.types';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  company_id: number;
  company_name: string;
}

export interface SignupForm {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  company_name: string;
  subscription?: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface LoginForm {
  email: string;
  password: string;
} 