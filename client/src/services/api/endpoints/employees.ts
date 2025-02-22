import api from '../index';
import { Employee, EmployeeFormData } from '../../../types/employee';

export const employeeService = {
  getAll: () => 
    api.get<Employee[]>('/api/v1/employees'),
    
  getById: (id: number) => 
    api.get<Employee>(`/api/v1/employees/${id}`),
    
  create: (data: EmployeeFormData) => 
    api.post<Employee>('/api/v1/employees/create', data),
    
  update: (id: number, data: Partial<Employee>) => 
    api.put<Employee>(`/api/v1/employees/${id}`, data),
    
  delete: (id: number) => 
    api.delete<void>(`/api/v1/employees/${id}`),
    
  getManagers: () => 
    api.get<Employee[]>('/api/v1/employees/managers')
}; 