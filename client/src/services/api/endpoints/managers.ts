import api from '../index';
import { Manager } from '../../../types/manager';

export const managerService = {
  getAll: () => 
    api.get<Manager[]>('/api/v1/employees/managers'),
  getById: (id: number) => 
    api.get<Manager>(`/api/v1/employees/${id}`),
  update: (id: number, data: Partial<Manager>) => 
    api.put<Manager>(`/api/v1/employees/${id}`, data),
  create: (managerId: number, departmentId: number) => 
    api.post<Manager>('/api/v1/employees/managers', { 
      manager_id: managerId, 
      department_id: departmentId 
    }),
  delete: (id: number) => 
    api.delete<Manager>(`/api/v1/employees/managers/${id}`),
  getByDepartment: (departmentId: number) =>
    api.get<Manager[]>(`/api/v1/managers/department/${departmentId}`)
};

