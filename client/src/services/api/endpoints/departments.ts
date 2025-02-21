import api from '../index';
import { Department } from '../../../types/department';

export const departmentService = {
  getAll: () => 
    api.get<Department[]>('/api/departments'),
    
  create: (name: string) => 
    api.post('/api/departments', { name }),
    
  update: (id: number, data: Partial<Department>) => 
    api.put(`/api/departments/${id}`, data),
    
  delete: (id: number) => 
    api.delete(`/api/departments/${id}`)
};
