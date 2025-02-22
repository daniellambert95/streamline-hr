import api from '../index';
import { EmployeeAnalyticsData } from '../../../types/employeeAnalytics';

export const analyticsService = {
  getEmployeeAnalytics: () => 
    api.get<EmployeeAnalyticsData>('/api/employee-management/analytics'),
};
