import api from '../index';
import { Manager } from '../../../types/manager';

export const managerService = {
  getAll: () => 
    api.get<Manager[]>('/api/employees/managers'),
    
  create: (managerId: number, departmentId: number) => 
    api.post('/api/managers', { 
      manager_id: managerId, 
      department_id: departmentId 
    }),
    
  update: (id: number, data: Partial<Manager>) => 
    api.put(`/api/managers/${id}`, data),
    
  getByDepartment: (departmentId: number) =>
    api.get<Manager[]>(`/api/managers/department/${departmentId}`)
};

