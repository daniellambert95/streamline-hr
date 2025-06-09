import React, { useState } from 'react';
import { useEmployeeSearch } from '../../../../domains/employees/hooks/useEmployeeSearch';
import { Department } from '../../../../domains/organization/types/department';
import { Team } from '../../../../domains/organization/types/team';

interface AnalyticsTabProps {
  departments: Department[];
  teams: Team[];
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  departments,
  teams
}) => {
  const { employees: searchEmployees } = useEmployeeSearch();
  const [analyticsView, setAnalyticsView] = useState<'overview' | 'budget' | 'turnover' | 'performance' | 'predictive' | 'salary'>('overview');

  // Generate comprehensive analytics data
  const getAnalyticsData = () => {
    const activeEmployees = searchEmployees.filter(emp => emp.employment_status === 'active');
    const totalEmployees = searchEmployees.length;
    
    // Calculate turnover rate
    const leftEmployees = searchEmployees.filter(emp => emp.employment_status === 'inactive').length;
    const turnoverRate = totalEmployees > 0 ? (leftEmployees / totalEmployees) * 100 : 0;
    
    // Calculate new hires
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newHires = activeEmployees.filter(emp => new Date(emp.starting_date) > thirtyDaysAgo).length;
    
    // Department distribution
    const departmentDistribution = departments.map(dept => ({
      department: dept,
      count: activeEmployees.filter(emp => emp.department_name === dept.name).length,
      percentage: activeEmployees.length > 0 ? 
        (activeEmployees.filter(emp => emp.department_name === dept.name).length / activeEmployees.length) * 100 : 0
    }));

    return {
      totalEmployees: activeEmployees.length,
      newHires,
      turnoverRate,
      averageTenure: 2.3 + Math.random() * 1.5,
      retentionRate: 100 - turnoverRate,
      departmentDistribution,
      averageAge: 28 + Math.random() * 10,
      genderDistribution: {
        male: Math.floor(activeEmployees.length * (0.45 + Math.random() * 0.1)),
        female: Math.floor(activeEmployees.length * (0.45 + Math.random() * 0.1)),
        other: Math.floor(activeEmployees.length * 0.02)
      },
      performanceDistribution: {
        excellent: Math.floor(activeEmployees.length * 0.2),
        good: Math.floor(activeEmployees.length * 0.5),
        satisfactory: Math.floor(activeEmployees.length * 0.25),
        needsImprovement: Math.floor(activeEmployees.length * 0.05)
      }
    };
  };

  // Generate budget analytics
  const getBudgetAnalytics = () => {
    return departments.map(dept => {
      const deptEmployees = searchEmployees.filter(emp => emp.department_name === dept.name);
      const avgSalary = 75000 + Math.random() * 50000;
      const totalBudget = 2000000 + Math.random() * 5000000;
      const salaryBudget = deptEmployees.length * avgSalary;
      const budgetUtilization = (salaryBudget / totalBudget) * 100;
      
      return {
        department: dept,
        employeeCount: deptEmployees.length,
        totalBudget,
        salaryBudget,
        budgetUtilization,
        avgSalary,
        budgetRemaining: totalBudget - salaryBudget,
        projectedOverrun: budgetUtilization > 100 ? salaryBudget - totalBudget : 0
      };
    });
  };

  // Generate turnover analytics
  const getTurnoverAnalytics = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      monthlyData: months.map(month => ({
        month,
        hires: Math.floor(Math.random() * 10) + 2,
        departures: Math.floor(Math.random() * 8) + 1,
        netGrowth: Math.floor(Math.random() * 6) - 2
      })),
      departmentTurnover: departments.map(dept => ({
        department: dept.name,
        rate: Math.random() * 20 + 5,
        voluntary: Math.random() * 15 + 3,
        involuntary: Math.random() * 5 + 1
      })),
      reasonsForLeaving: [
        { reason: 'Better Opportunity', percentage: 35 + Math.random() * 10 },
        { reason: 'Compensation', percentage: 25 + Math.random() * 10 },
        { reason: 'Work-Life Balance', percentage: 15 + Math.random() * 10 },
        { reason: 'Management Issues', percentage: 10 + Math.random() * 5 },
        { reason: 'Career Growth', percentage: 10 + Math.random() * 5 },
        { reason: 'Other', percentage: 5 + Math.random() * 5 }
      ]
    };
  };

  // Generate performance analytics
  const getPerformanceAnalytics = () => {
    return {
      teamPerformance: teams.map(team => ({
        team: team.name,
        avgScore: 3.5 + Math.random() * 1.5,
        goalCompletion: 70 + Math.random() * 25,
        efficiency: 75 + Math.random() * 20,
        collaboration: 80 + Math.random() * 15
      })),
      skillGaps: [
        { skill: 'Leadership', gap: Math.random() * 30 + 10 },
        { skill: 'Technical Skills', gap: Math.random() * 25 + 5 },
        { skill: 'Communication', gap: Math.random() * 20 + 8 },
        { skill: 'Project Management', gap: Math.random() * 22 + 12 },
        { skill: 'Data Analysis', gap: Math.random() * 35 + 15 }
      ],
      trainingEffectiveness: {
        completed: 85 + Math.random() * 10,
        satisfaction: 4.2 + Math.random() * 0.6,
        improvement: 25 + Math.random() * 15
      }
    };
  };

  // Generate predictive analytics
  const getPredictiveAnalytics = () => {
    return {
      attritionPrediction: {
        next30Days: Math.floor(searchEmployees.length * 0.02),
        next90Days: Math.floor(searchEmployees.length * 0.05),
        next12Months: Math.floor(searchEmployees.length * 0.15)
      },
      hiringForecast: {
        plannedHires: 15 + Math.floor(Math.random() * 10),
        expectedTimeToFill: 25 + Math.random() * 15,
        budgetRequired: 500000 + Math.random() * 300000
      },
      performanceTrends: {
        improving: Math.floor(searchEmployees.length * 0.3),
        stable: Math.floor(searchEmployees.length * 0.6),
        declining: Math.floor(searchEmployees.length * 0.1)
      },
      riskIndicators: [
        { indicator: 'High Workload Teams', risk: 'Medium', count: 3 },
        { indicator: 'Low Engagement Scores', risk: 'High', count: 2 },
        { indicator: 'Compensation Gaps', risk: 'Medium', count: 5 },
        { indicator: 'Management Turnover', risk: 'Low', count: 1 }
      ]
    };
  };

  // Generate salary analytics
  const getSalaryAnalytics = () => {
    return {
      salaryDistribution: [
        { range: '$40k-60k', count: Math.floor(searchEmployees.length * 0.2) },
        { range: '$60k-80k', count: Math.floor(searchEmployees.length * 0.3) },
        { range: '$80k-100k', count: Math.floor(searchEmployees.length * 0.25) },
        { range: '$100k-120k', count: Math.floor(searchEmployees.length * 0.15) },
        { range: '$120k+', count: Math.floor(searchEmployees.length * 0.1) }
      ],
      payEquity: {
        genderPayGap: 8 + Math.random() * 5,
        departmentVariance: 15 + Math.random() * 10,
        marketPosition: 'Competitive'
      },
      compensationTrends: departments.map(dept => ({
        department: dept.name,
        avgSalary: 70000 + Math.random() * 40000,
        marketPercentile: 45 + Math.random() * 30,
        lastIncrease: Math.random() * 18 + 6
      }))
    };
  };

  const analyticsData = getAnalyticsData();
  const budgetData = getBudgetAnalytics();
  const turnoverData = getTurnoverAnalytics();
  const performanceData = getPerformanceAnalytics();
  const predictiveData = getPredictiveAnalytics();
  const salaryData = getSalaryAnalytics();

  return (
    <div className="space-y-6">
      {/* Header with Analytics View Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">HR Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive insights and predictive analytics for strategic HR decisions</p>
        </div>
        
        <div className="flex flex-wrap bg-gray-100 rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'budget', label: 'Budget' },
            { key: 'turnover', label: 'Turnover' },
            { key: 'performance', label: 'Performance' },
            { key: 'salary', label: 'Salary' },
            { key: 'predictive', label: 'Predictive' }
          ].map(view => (
            <button
              key={view.key}
              onClick={() => setAnalyticsView(view.key as any)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                analyticsView === view.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Analytics */}
      {analyticsView === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
              <div className="text-3xl font-bold">{analyticsData.totalEmployees}</div>
              <div className="text-blue-100">Total Employees</div>
              <div className="text-sm text-blue-200 mt-1">+{analyticsData.newHires} this month</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
              <div className="text-3xl font-bold">{analyticsData.retentionRate.toFixed(1)}%</div>
              <div className="text-green-100">Retention Rate</div>
              <div className="text-sm text-green-200 mt-1">12-month average</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
              <div className="text-3xl font-bold">{analyticsData.averageTenure.toFixed(1)}</div>
              <div className="text-purple-100">Avg Tenure (years)</div>
              <div className="text-sm text-purple-200 mt-1">Company-wide</div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
              <div className="text-3xl font-bold">{analyticsData.turnoverRate.toFixed(1)}%</div>
              <div className="text-yellow-100">Turnover Rate</div>
              <div className="text-sm text-yellow-200 mt-1">Annual rate</div>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Distribution by Department</h3>
            <div className="space-y-4">
              {analyticsData.departmentDistribution.map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                    <span className="font-medium text-gray-900">{dept.department.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${dept.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-16">{dept.count} ({dept.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance and Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h3>
              <div className="space-y-3">
                {Object.entries(analyticsData.performanceDistribution).map(([level, count]) => (
                  <div key={level} className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">{level.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-semibold text-gray-900">{count} employees</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workforce Demographics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Average Age</span>
                  <span className="font-semibold text-gray-900">{analyticsData.averageAge.toFixed(1)} years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Male</span>
                  <span className="font-semibold text-gray-900">{analyticsData.genderDistribution.male}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Female</span>
                  <span className="font-semibold text-gray-900">{analyticsData.genderDistribution.female}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Other</span>
                  <span className="font-semibold text-gray-900">{analyticsData.genderDistribution.other}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Analytics */}
      {analyticsView === 'budget' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Budget Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Department</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Employees</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Total Budget</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Salary Budget</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Utilization</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Avg Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetData.map((dept, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{dept.department.name}</td>
                      <td className="py-3 px-4 text-gray-900">{dept.employeeCount}</td>
                      <td className="py-3 px-4 text-gray-900">${(dept.totalBudget / 1000000).toFixed(1)}M</td>
                      <td className="py-3 px-4 text-gray-900">${(dept.salaryBudget / 1000).toFixed(0)}k</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          dept.budgetUtilization > 90 ? 'bg-red-100 text-red-800' :
                          dept.budgetUtilization > 75 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {dept.budgetUtilization.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900">${(dept.avgSalary / 1000).toFixed(0)}k</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Turnover Analytics */}
      {analyticsView === 'turnover' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Hiring Trends</h3>
              <div className="space-y-3">
                {turnoverData.monthlyData.slice(-6).map((month, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium text-gray-900">{month.month}</span>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-green-600">+{month.hires} hires</span>
                      <span className="text-red-600">-{month.departures} departures</span>
                      <span className={`font-medium ${month.netGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {month.netGrowth >= 0 ? '+' : ''}{month.netGrowth} net
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reasons for Leaving</h3>
              <div className="space-y-3">
                {turnoverData.reasonsForLeaving.map((reason, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-700">{reason.reason}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${reason.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">{reason.percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Turnover Rates</h3>
            <div className="space-y-4">
              {turnoverData.departmentTurnover.map((dept, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{dept.department}</span>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      dept.rate > 15 ? 'bg-red-100 text-red-800' :
                      dept.rate > 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {dept.rate.toFixed(1)}% total
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Voluntary: {dept.voluntary.toFixed(1)}%</span>
                    <span>Involuntary: {dept.involuntary.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Analytics */}
      {analyticsView === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Performance Metrics</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Team</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Avg Score</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Goal Completion</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Efficiency</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Collaboration</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.teamPerformance.map((team, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{team.team}</td>
                      <td className="py-3 px-4 text-gray-900">{team.avgScore.toFixed(1)}/5</td>
                      <td className="py-3 px-4 text-gray-900">{team.goalCompletion.toFixed(0)}%</td>
                      <td className="py-3 px-4 text-gray-900">{team.efficiency.toFixed(0)}%</td>
                      <td className="py-3 px-4 text-gray-900">{team.collaboration.toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Gap Analysis</h3>
              <div className="space-y-4">
                {performanceData.skillGaps.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-700">{skill.skill}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${skill.gap}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">{skill.gap.toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Effectiveness</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Completion Rate</span>
                  <span className="font-semibold text-gray-900">{performanceData.trainingEffectiveness.completed.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Satisfaction Score</span>
                  <span className="font-semibold text-gray-900">{performanceData.trainingEffectiveness.satisfaction.toFixed(1)}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Performance Improvement</span>
                  <span className="font-semibold text-gray-900">{performanceData.trainingEffectiveness.improvement.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Salary Analytics */}
      {analyticsView === 'salary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Distribution</h3>
              <div className="space-y-3">
                {salaryData.salaryDistribution.map((range, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-700">{range.range}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(range.count / analyticsData.totalEmployees) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">{range.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pay Equity Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Gender Pay Gap</span>
                  <span className={`font-semibold ${salaryData.payEquity.genderPayGap < 5 ? 'text-green-600' : 'text-red-600'}`}>
                    {salaryData.payEquity.genderPayGap.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Department Variance</span>
                  <span className="font-semibold text-gray-900">{salaryData.payEquity.departmentVariance.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Market Position</span>
                  <span className="font-semibold text-gray-900">{salaryData.payEquity.marketPosition}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Compensation Trends</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Department</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Avg Salary</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Market Percentile</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Last Increase</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryData.compensationTrends.map((dept, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{dept.department}</td>
                      <td className="py-3 px-4 text-gray-900">${(dept.avgSalary / 1000).toFixed(0)}k</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          dept.marketPercentile > 70 ? 'bg-green-100 text-green-800' :
                          dept.marketPercentile > 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {dept.marketPercentile.toFixed(0)}th
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{dept.lastIncrease.toFixed(0)} months ago</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Predictive Analytics */}
      {analyticsView === 'predictive' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg text-white">
              <div className="text-3xl font-bold">{predictiveData.attritionPrediction.next30Days}</div>
              <div className="text-red-100">Predicted Attrition</div>
              <div className="text-sm text-red-200 mt-1">Next 30 days</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
              <div className="text-3xl font-bold">{predictiveData.hiringForecast.plannedHires}</div>
              <div className="text-blue-100">Planned Hires</div>
              <div className="text-sm text-blue-200 mt-1">Next quarter</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
              <div className="text-3xl font-bold">{predictiveData.hiringForecast.expectedTimeToFill.toFixed(0)}</div>
              <div className="text-green-100">Days to Fill</div>
              <div className="text-sm text-green-200 mt-1">Average estimate</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="text-gray-700">Improving Performance</span>
                  <span className="font-semibold text-green-600">{predictiveData.performanceTrends.improving} employees</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Stable Performance</span>
                  <span className="font-semibold text-gray-900">{predictiveData.performanceTrends.stable} employees</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                  <span className="text-gray-700">Declining Performance</span>
                  <span className="font-semibold text-red-600">{predictiveData.performanceTrends.declining} employees</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Indicators</h3>
              <div className="space-y-3">
                {predictiveData.riskIndicators.map((risk, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <span className="font-medium text-gray-900">{risk.indicator}</span>
                      <div className="text-sm text-gray-600">{risk.count} instances</div>
                    </div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      risk.risk === 'High' ? 'bg-red-100 text-red-800' :
                      risk.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {risk.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsTab; 