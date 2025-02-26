import api from '../index';
import { Department } from '../../../types/department';

// getById: (id: number) => api.get(`/api/departments/${id}`),

export const departmentService = {
  getAll: () => 
    api.get<Department[]>('/api/v1/organization/departments'),
    
  getById: (id: number) => 
    api.get<Department>(`/api/v1/organization/departments/${id}`),
    
  create: (data: Partial<Department>) => 
    api.post<Department>('/api/v1/organization/departments', data),
    
  update: (id: number, data: Partial<Department>) => 
    api.put<Department>(`/api/v1/organization/departments/${id}`, data),
    
  delete: (id: number) => 
    api.delete<void>(`/api/v1/organization/departments/${id}`)
};
