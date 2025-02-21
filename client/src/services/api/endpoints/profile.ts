import api from '../index';
import { AuthUser } from '../../../types/user';

export const profileService = {
  update: (id: number, data: Partial<AuthUser>) => 
    api.put(`/api/employees/${id}`, data),
    
  get: () => 
    api.get<AuthUser>('/api/employees/profile')
}; 