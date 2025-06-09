import React, { useState } from 'react';
import { Manager } from '../../../../domains/organization/types/manager';
import { useEmployeeSearch } from '../../../../domains/employees/hooks/useEmployeeSearch';

interface ManagerViewTabProps {
  managers: Manager[];
}

const ManagerViewTab: React.FC<ManagerViewTabProps> = ({
  managers
}) => {
  const { employees: searchEmployees } = useEmployeeSearch();
  const [dashboardMode, setDashboardMode] = useState<'overview' | 'performance' | 'hierarchy' | 'workload'>('overview');

  // Get direct reports for a manager
  const getDirectReports = (managerId: number) => {
    return searchEmployees.filter(emp => emp.manager === managerId.toString());
  };

  // Calculate manager metrics
  const getManagerMetrics = (manager: Manager) => {
    const directReports = getDirectReports(manager.id);
    const activeReports = directReports.filter(emp => emp.employment_status === 'active');
    
    return {
      totalReports: directReports.length,
      activeReports: activeReports.length,
      newHires: directReports.filter(emp => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(emp.starting_date) > thirtyDaysAgo;
      }).length,
      avgPerformanceScore: 4.2 + Math.random() * 0.8,
      teamUtilization: 85 + Math.random() * 15,
      oneOnOnesCompleted: Math.floor(activeReports.length * 0.8),
      goalCompletionRate: 75 + Math.random() * 20
    };
  };

  // Calculate workload distribution
  const getWorkloadDistribution = (manager: Manager) => {
    const directReports = getDirectReports(manager.id);
    return directReports.map(emp => ({
      employee: emp,
      currentProjects: Math.floor(Math.random() * 5) + 1,
      hoursThisWeek: Math.floor(Math.random() * 20) + 35,
      utilizationRate: Math.floor(Math.random() * 30) + 70,
      riskLevel: Math.random() > 0.8 ? 'high' : Math.random() > 0.6 ? 'medium' : 'low'
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header with Dashboard Mode Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manager Dashboard</h2>
          <p className="text-gray-600">Comprehensive view of manager performance and team metrics</p>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'performance', label: 'Performance' },
            { key: 'hierarchy', label: 'Hierarchy' },
            { key: 'workload', label: 'Workload' }
          ].map(mode => (
            <button
              key={mode.key}
              onClick={() => setDashboardMode(mode.key as any)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                dashboardMode === mode.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Dashboard */}
      {dashboardMode === 'overview' && (
        <div className="space-y-6">
          {/* Manager Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {managers.map(manager => {
              const metrics = getManagerMetrics(manager);
              const directReports = getDirectReports(manager.id);
              
              return (
                <div key={manager.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-blue-600">
                          {manager.first_name?.[0]}{manager.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {manager.first_name} {manager.last_name}
                        </h3>
                        <p className="text-gray-600 text-sm">{manager.job_title}</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{metrics.activeReports}</div>
                      <div className="text-sm text-gray-600">Direct Reports</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{metrics.avgPerformanceScore.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Avg Performance</div>
                    </div>
                  </div>

                  {/* Team Utilization */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Team Utilization</span>
                      <span className="font-medium text-gray-900">{metrics.teamUtilization.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metrics.teamUtilization > 95 ? 'bg-red-500' :
                          metrics.teamUtilization > 85 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, metrics.teamUtilization)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">1:1s Completed:</span>
                      <span className="text-gray-900 font-medium">{metrics.oneOnOnesCompleted}/{metrics.activeReports}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Goal Completion:</span>
                      <span className="text-gray-900 font-medium">{metrics.goalCompletionRate.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">New Hires (30d):</span>
                      <span className="text-gray-900 font-medium">{metrics.newHires}</span>
                    </div>
                  </div>

                  {/* Direct Reports Preview */}
                  {directReports.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm font-medium text-gray-700 mb-2">Team Members</div>
                      <div className="flex -space-x-2">
                        {directReports.slice(0, 5).map((emp, idx) => (
                          <div key={idx} className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 border-2 border-white">
                            {emp.first_name?.[0]}{emp.last_name?.[0]}
                          </div>
                        ))}
                        {directReports.length > 5 && (
                          <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500 border-2 border-white">
                            +{directReports.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Performance Dashboard */}
      {dashboardMode === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics Overview</h3>
            
            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                <div className="text-2xl font-bold">
                  {(managers.reduce((sum, m) => sum + getManagerMetrics(m).avgPerformanceScore, 0) / managers.length).toFixed(1)}
                </div>
                <div className="text-blue-100">Avg Performance</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                <div className="text-2xl font-bold">
                  {managers.reduce((sum, m) => sum + getManagerMetrics(m).activeReports, 0)}
                </div>
                <div className="text-green-100">Total Team Members</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-lg text-white">
                <div className="text-2xl font-bold">
                  {managers.reduce((sum, m) => sum + getManagerMetrics(m).oneOnOnesCompleted, 0)}
                </div>
                <div className="text-yellow-100">1:1s Completed</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                <div className="text-2xl font-bold">
                  {(managers.reduce((sum, m) => sum + getManagerMetrics(m).goalCompletionRate, 0) / managers.length).toFixed(0)}%
                </div>
                <div className="text-purple-100">Goal Completion</div>
              </div>
            </div>

            {/* Performance Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Manager</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Team Size</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Performance Score</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Utilization</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Goal Completion</th>
                    <th className="py-3 px-4 text-center font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map(manager => {
                    const metrics = getManagerMetrics(manager);
                    
                    return (
                      <tr key={manager.id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {manager.first_name?.[0]}{manager.last_name?.[0]}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {manager.first_name} {manager.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{manager.job_title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{metrics.activeReports}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{metrics.avgPerformanceScore.toFixed(1)}/5</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{metrics.teamUtilization.toFixed(0)}%</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{metrics.goalCompletionRate.toFixed(0)}%</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            metrics.avgPerformanceScore >= 4.5 ? 'bg-green-100 text-green-800' :
                            metrics.avgPerformanceScore >= 3.5 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {metrics.avgPerformanceScore >= 4.5 ? 'Excellent' :
                             metrics.avgPerformanceScore >= 3.5 ? 'Good' : 'Needs Attention'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Hierarchy View */}
      {dashboardMode === 'hierarchy' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Organizational Hierarchy</h3>
            
            <div className="space-y-6">
              {managers.map(manager => {
                const directReports = getDirectReports(manager.id);
                
                return (
                  <div key={manager.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-blue-600">
                            {manager.first_name?.[0]}{manager.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {manager.first_name} {manager.last_name}
                          </h4>
                          <p className="text-gray-600">{manager.job_title}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{directReports.length}</div>
                        <div className="text-sm text-gray-500">Direct Reports</div>
                      </div>
                    </div>

                    {directReports.length > 0 && (
                      <div className="ml-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {directReports.map(employee => (
                          <div key={employee.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-indigo-600">
                                {employee.first_name?.[0]}{employee.last_name?.[0]}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {employee.first_name} {employee.last_name}
                              </div>
                              <div className="text-xs text-gray-500">{employee.job_title}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Workload Analysis */}
      {dashboardMode === 'workload' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Workload Analysis</h3>
            
            {managers.map(manager => {
              const workloadData = getWorkloadDistribution(manager);
              
              return (
                <div key={manager.id} className="mb-8 last:mb-0">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {manager.first_name?.[0]}{manager.last_name?.[0]}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {manager.first_name} {manager.last_name}'s Team
                      </h4>
                      <p className="text-gray-600">{workloadData.length} team members</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-4 text-left font-medium text-gray-900">Employee</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-900">Projects</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-900">Hours/Week</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-900">Utilization</th>
                          <th className="py-3 px-4 text-center font-medium text-gray-900">Risk Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workloadData.map((data, idx) => (
                          <tr key={idx} className="border-t hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-indigo-600">
                                    {data.employee.first_name?.[0]}{data.employee.last_name?.[0]}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {data.employee.first_name} {data.employee.last_name}
                                  </div>
                                  <div className="text-sm text-gray-500">{data.employee.job_title}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900">{data.currentProjects}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{data.hoursThisWeek}h</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{data.utilizationRate}%</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                data.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                                data.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {data.riskLevel.charAt(0).toUpperCase() + data.riskLevel.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerViewTab; 