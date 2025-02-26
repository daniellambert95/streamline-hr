export type UserRole = 'employee' | 'recruiter' | 'admin' | 'manager';

export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  company_name: string;
  company_id?: number;
  status: 'active' | 'inactive';
  subscription: string;
  user_image_path?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserCreationDTO {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  company_name: string;
  subscription?: string;
  user_image_path?: string;
}

export interface UserUpdateDTO {
  first_name?: string;
  last_name?: string;
  email?: string;
  status?: 'active' | 'inactive';
  user_image_path?: string;
  subscription?: string;
}
