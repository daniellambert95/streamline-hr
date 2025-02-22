import api from '../index';
import { Employee, EmployeeFormData } from '../../../types/employee';

export const employeeService = {
  getAll: () => 
    api.get<Employee[]>('/api/employees'),
    
  getById: (id: number) => 
    api.get<Employee>(`/api/employees/${id}`),
    
  create: (data: Partial<Employee>) => 
    api.post<EmployeeFormData>('/api/employees/create', data),
    
  update: (id: number, data: Partial<Employee>) => 
    api.put<Employee>(`/api/employees/${id}`, data),
    
  delete: (id: number) => 
    api.delete<void>(`/api/employees/${id}`),
    
  getManagers: () => 
    api.get<Employee[]>('/api/employees/managers')
}; 