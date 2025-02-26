import { useState, useEffect, useMemo } from 'react';
import { Employee } from '../types/employee';
import { employeeService } from '../services/employees';
import handleApiError from '../../../core/utils/handleApiError';

export const useEmployeeSearch = (initialQuery: string = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const { data } = await employeeService.getAll();
        setEmployees(data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => 
      employee.first_name.toLowerCase().includes(query.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(query.toLowerCase()) ||
      employee.email.toLowerCase().includes(query.toLowerCase())
    );
  }, [employees, query]);

  return {
    query,
    setQuery,
    employees: filteredEmployees,
    isLoading
  };
}; 