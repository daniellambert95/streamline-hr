import api from '../index';
import { Employee, EmployeeFormData } from '../../../types/employee';

export const employeeService = {
  getAll: () => 
    api.get<Employee[]>('/api/employees'),
    
  create: (data: EmployeeFormData) => 
    api.post('/api/employees/create', data),
    
  update: (id: number, data: Partial<EmployeeFormData>) => 
    api.put(`/api/employees/${id}`, data),
    
  delete: (id: number) => 
    api.delete(`/api/employees/${id}`)
}; 