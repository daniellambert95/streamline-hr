import api from '../../../core/api/apiClient';
import { Manager } from '../types/manager';

export const managerService = {
  getAll: () => 
    api.get<Manager[]>('/api/v1/organization/managers'),
  getById: (id: number) => 
    api.get<Manager>(`/api/v1/employees/${id}`),
  update: (id: number, data: Partial<Manager>) => 
    api.put<Manager>(`/api/v1/employees/${id}`, data),
  create: (managerId: number, departmentId: number, permissions?: {
    can_approve_time_off?: boolean;
    can_hire?: boolean;
    can_edit_salary?: boolean;
  }) => 
    api.post<Manager>('/api/v1/organization/managers', { 
      employee_id: managerId, 
      department_id: departmentId,
      permissions
    }),
  delete: (id: number) => 
    api.delete<Manager>(`/api/v1/employees/managers/${id}`),
  getByDepartment: (departmentId: number) =>
    api.get<Manager[]>(`/api/v1/managers/department/${departmentId}`)
};

