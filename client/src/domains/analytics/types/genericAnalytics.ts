export interface GenericAnalyticsData {
  totalEmployees: number;
  activeEmployees: number;
  departmentDistribution: Record<string, number>;
  turnoverRate: number;
  avgTenure: number;
  totalTeams: number;
  totalManagers: number;
  newHires: number;
  // Add other analytics fields as needed
} 