import { UserRole, AuthUser } from '../types/user';

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  company_name: string;
  subscription: string;
  first_name: string;
  last_name: string;
} 

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (token: string, userData: AuthUser) => void;
  logout: () => void;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
}
