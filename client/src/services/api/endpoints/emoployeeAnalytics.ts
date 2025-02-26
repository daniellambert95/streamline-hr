import api from '../index';
import { EmployeeAnalyticsData } from '../../../types/employeeAnalytics';

export const analyticsService = {
  getEmployeeAnalytics: () => 
    api.get<EmployeeAnalyticsData>('/api/v1/analytics/employee-analytics'),
};
