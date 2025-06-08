import { UserRole, AuthUser } from '../../users/types/user';

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
  setUser: (user: AuthUser | null) => void;
  login: (token: string, userData: AuthUser) => Promise<void>;
  logout: () => void;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
  refreshProfile: () => Promise<void>;
}
