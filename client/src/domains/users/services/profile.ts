import api from '../../../core/api/apiClient';
import { AuthUser } from '../types/user';

export const profileService = {
  getFullProfile: async () => {
    const { data } = await api.get<AuthUser>('/api/v1/employees/profile');
    return data;
  },
  
  update: (data: Partial<AuthUser>) => {
    return api.put('/api/v1/employees/profile', data);
  },
  
  get: () => api.get<AuthUser>('/api/v1/employees/profile')
}; 