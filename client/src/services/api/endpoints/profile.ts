import api from '../index';
import { AuthUser } from '../../../types/user';

export const profileService = {
  update: (id: number, data: Partial<AuthUser>) => {
    console.log('Profile service update called with:', { id, data }); // Debug log
    console.log('Making PUT request to:', `/api/v1/employees/${id}`);
    return api.put(`/api/v1/employees/${id}`, {
      ...data,
      id: id
    });
  },
  
  get: () => api.get<AuthUser>('/api/v1/employees/profile')
}; 