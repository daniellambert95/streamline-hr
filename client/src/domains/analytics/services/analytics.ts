import api from '../../../core/api/apiClient';
import { GenericAnalyticsData } from '../types/genericAnalytics';

export const analyticsService = {
  getEmployeeAnalytics: () => 
    api.get<GenericAnalyticsData>('/api/v1/analytics/employee-analytics'),
  
  // Add other analytics-related API calls
}; 