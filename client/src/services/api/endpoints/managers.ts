import api from '../index';
import { Manager } from '../../../types/manager';

export const managerService = {
  getAll: () => 
    api.get<Manager[]>('/api/employees/managers'),
  getById: (id: number) => 
    api.get<Manager>(`/api/employees/${id}`),
  update: (id: number, data: Partial<Manager>) => 
    api.put<Manager>(`/api/employees/${id}`, data),
  create: (managerId: number, departmentId: number) => 
    api.post<Manager>('/api/employees/managers', { 
      manager_id: managerId, 
      department_id: departmentId 
    }),
  delete: (id: number) => 
    api.delete<Manager>(`/api/employees/managers/${id}`),
  getByDepartment: (departmentId: number) =>
    api.get<Manager[]>(`/api/managers/department/${departmentId}`)
};

