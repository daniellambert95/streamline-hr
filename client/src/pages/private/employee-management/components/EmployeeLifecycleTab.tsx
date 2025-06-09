import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeSearch } from '../../../../domains/employees/hooks/useEmployeeSearch';

interface EmployeeLifecycleTabProps {
  // Add any specific props if needed
}

const EmployeeLifecycleTab: React.FC<EmployeeLifecycleTabProps> = () => {
  const navigate = useNavigate();
  const { employees: searchEmployees } = useEmployeeSearch();
  const [viewMode, setViewMode] = useState<'pipeline' | 'onboarding' | 'progression' | 'retention'>('pipeline');

  // Lifecycle stages
  const lifecycleStages = [
    { key: 'onboarding', label: 'Onboarding', color: 'bg-blue-500' },
    { key: 'probation', label: 'Probation', color: 'bg-yellow-500' },
    { key: 'active', label: 'Active', color: 'bg-green-500' },
    { key: 'development', label: 'Development', color: 'bg-purple-500' },
    { key: 'transition', label: 'Transition', color: 'bg-orange-500' },
    { key: 'offboarding', label: 'Offboarding', color: 'bg-red-500' }
  ];

  // Categorize employees by lifecycle stage
  const getEmployeesByStage = (stage: string) => {
    switch (stage) {
      case 'onboarding':
        return searchEmployees.filter(emp => emp.employment_status === 'onboarding');
      case 'probation':
        return searchEmployees.filter(emp => 
          emp.probation_end_date && new Date(emp.probation_end_date) > new Date()
        );
      case 'active':
        return searchEmployees.filter(emp => 
          emp.employment_status === 'active' && 
          (!emp.probation_end_date || new Date(emp.probation_end_date) <= new Date())
        );
      case 'development':
        return searchEmployees.filter(emp => {
          // Mock: employees in development programs
          return emp.employment_status === 'active' && Math.random() > 0.8;
        });
      case 'transition':
        return searchEmployees.filter(emp => emp.employment_status === 'on_leave');
      case 'offboarding':
        return searchEmployees.filter(emp => emp.employment_status === 'inactive');
      default:
        return [];
    }
  };

  // Generate onboarding progress data
  const getOnboardingProgress = () => {
    const onboardingEmployees = getEmployeesByStage('onboarding');
    return onboardingEmployees.map(emp => {
      const daysSinceStart = Math.floor((new Date().getTime() - new Date(emp.starting_date).getTime()) / (1000 * 3600 * 24));
      const progressPercentage = Math.min(100, (daysSinceStart / 30) * 100); // 30-day onboarding
      
      return {
        employee: emp,
        daysSinceStart,
        progressPercentage,
        completedTasks: Math.floor(progressPercentage / 10),
        totalTasks: 10,
        nextMilestone: progressPercentage < 25 ? 'IT Setup' : 
                     progressPercentage < 50 ? 'Team Introductions' :
                     progressPercentage < 75 ? 'Training Completion' : 'Performance Review',
        riskLevel: progressPercentage < 30 && daysSinceStart > 7 ? 'high' : 
                  progressPercentage < 60 && daysSinceStart > 14 ? 'medium' : 'low'
      };
    });
  };

  // Generate career progression data
  const getCareerProgression = () => {
    const activeEmployees = searchEmployees.filter(emp => emp.employment_status === 'active');
    return activeEmployees.map(emp => {
      const tenure = Math.floor((new Date().getTime() - new Date(emp.starting_date).getTime()) / (1000 * 3600 * 24 * 365));
      const promotionPotential = Math.random();
      
      return {
        employee: emp,
        currentLevel: emp.job_title?.includes('Senior') ? 'Senior' : 
                     emp.job_title?.includes('Lead') ? 'Lead' : 
                     emp.job_title?.includes('Manager') ? 'Manager' : 'Junior',
        tenure,
        skillScore: 3.5 + Math.random() * 1.5,
        promotionReadiness: promotionPotential > 0.7 ? 'Ready' : 
                           promotionPotential > 0.4 ? 'Developing' : 'Not Ready',
        nextRole: emp.job_title?.includes('Senior') ? 'Lead ' + (emp.job_title?.replace('Senior ', '') || '') :
                 emp.job_title?.includes('Lead') ? 'Manager' : 
                 'Senior ' + (emp.job_title || ''),
        developmentGoals: Math.floor(Math.random() * 3) + 1
      };
    });
  };

  // Generate retention risk analysis
  const getRetentionRisk = () => {
    const activeEmployees = searchEmployees.filter(emp => emp.employment_status === 'active');
    return activeEmployees.map(emp => {
      const tenure = Math.floor((new Date().getTime() - new Date(emp.starting_date).getTime()) / (1000 * 3600 * 24 * 365));
      const riskFactors = [];
      let riskScore = 0;

      // Calculate risk factors
      if (tenure > 2) { riskScore += 20; riskFactors.push('Long tenure'); }
      if (Math.random() > 0.8) { riskScore += 30; riskFactors.push('Low engagement'); }
      if (Math.random() > 0.9) { riskScore += 25; riskFactors.push('Compensation below market'); }
      if (Math.random() > 0.85) { riskScore += 15; riskFactors.push('Limited growth opportunities'); }
      if (Math.random() > 0.95) { riskScore += 20; riskFactors.push('Manager relationship issues'); }

      const riskLevel = riskScore > 60 ? 'high' : riskScore > 30 ? 'medium' : 'low';

      return {
        employee: emp,
        riskScore,
        riskLevel,
        riskFactors,
        lastEngagementSurvey: Math.floor(Math.random() * 90) + 1,
        retentionActions: riskLevel === 'high' ? ['Schedule retention interview', 'Review compensation', 'Career development plan'] :
                         riskLevel === 'medium' ? ['Check-in with manager', 'Growth opportunities discussion'] :
                         ['Regular touchbase']
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with View Mode Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Lifecycle Management</h2>
          <p className="text-gray-600">Track employee journey from onboarding to career development</p>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: 'pipeline', label: 'Pipeline' },
            { key: 'onboarding', label: 'Onboarding' },
            { key: 'progression', label: 'Career Progression' },
            { key: 'retention', label: 'Retention Risk' }
          ].map(mode => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key as any)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                viewMode === mode.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline View */}
      {viewMode === 'pipeline' && (
        <div className="space-y-6">
          {/* Pipeline Overview */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Employee Lifecycle Pipeline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {lifecycleStages.map(stage => {
                const stageEmployees = getEmployeesByStage(stage.key);
                
                return (
                  <div key={stage.key} className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">{stage.label}</h4>
                      <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    </div>
                    
                    <div className="text-2xl font-bold text-gray-900 mb-2">{stageEmployees.length}</div>
                    
                    <div className="space-y-2">
                      {stageEmployees.slice(0, 3).map(emp => (
                        <div key={emp.id} className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-indigo-600">
                              {emp.first_name?.[0]}{emp.last_name?.[0]}
                            </span>
                          </div>
                          <span className="text-xs text-gray-600 truncate">
                            {emp.first_name} {emp.last_name}
                          </span>
                        </div>
                      ))}
                      {stageEmployees.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{stageEmployees.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Transitions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Lifecycle Transitions</h3>
            
            <div className="space-y-3">
              {searchEmployees.slice(0, 8).map((emp, idx) => {
                const transitions = [
                  'Started onboarding process',
                  'Completed probation period',
                  'Promoted to Senior position',
                  'Enrolled in leadership development',
                  'Submitted resignation notice',
                  'Completed exit interview'
                ];
                const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
                const daysAgo = Math.floor(Math.random() * 14) + 1;
                
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {emp.first_name?.[0]}{emp.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {emp.first_name} {emp.last_name}
                        </div>
                        <div className="text-sm text-gray-600">{randomTransition}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{daysAgo}d ago</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Onboarding View */}
      {viewMode === 'onboarding' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Onboarding Progress Tracker</h3>
            
            <div className="space-y-4">
              {getOnboardingProgress().map((progress, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {progress.employee.first_name?.[0]}{progress.employee.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {progress.employee.first_name} {progress.employee.last_name}
                        </h4>
                        <p className="text-gray-600">{progress.employee.job_title}</p>
                        <p className="text-sm text-gray-500">Day {progress.daysSinceStart} of onboarding</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      progress.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                      progress.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {progress.riskLevel === 'high' ? 'At Risk' :
                       progress.riskLevel === 'medium' ? 'Attention Needed' : 'On Track'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Onboarding Progress</span>
                      <span className="font-medium text-gray-900">{progress.progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tasks and Milestones */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{progress.completedTasks}/{progress.totalTasks}</div>
                      <div className="text-sm text-gray-600">Tasks Completed</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">{progress.nextMilestone}</div>
                      <div className="text-sm text-gray-600">Next Milestone</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <button
                        onClick={() => navigate(`/employee/${progress.employee.id}`)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Career Progression View */}
      {viewMode === 'progression' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Career Progression Mapping</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Employee</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Current Level</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Tenure</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Skill Score</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Promotion Readiness</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-900">Next Role</th>
                    <th className="py-3 px-4 text-center font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getCareerProgression().slice(0, 10).map((progression, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">
                              {progression.employee.first_name?.[0]}{progression.employee.last_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {progression.employee.first_name} {progression.employee.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{progression.employee.job_title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{progression.currentLevel}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{progression.tenure} years</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{progression.skillScore.toFixed(1)}/5</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          progression.promotionReadiness === 'Ready' ? 'bg-green-100 text-green-800' :
                          progression.promotionReadiness === 'Developing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {progression.promotionReadiness}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{progression.nextRole}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => navigate(`/employee/${progression.employee.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          View Plan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Retention Risk View */}
      {viewMode === 'retention' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Retention Risk Analysis</h3>
            
            {/* Risk Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {['high', 'medium', 'low'].map(riskLevel => {
                const riskData = getRetentionRisk().filter(r => r.riskLevel === riskLevel);
                return (
                  <div key={riskLevel} className={`p-4 rounded-lg ${
                    riskLevel === 'high' ? 'bg-red-50 border border-red-200' :
                    riskLevel === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-green-50 border border-green-200'
                  }`}>
                    <div className="text-2xl font-bold mb-1 ${
                      riskLevel === 'high' ? 'text-red-600' :
                      riskLevel === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }">{riskData.length}</div>
                    <div className="text-sm font-medium text-gray-900 capitalize">{riskLevel} Risk Employees</div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Risk Analysis */}
            <div className="space-y-4">
              {getRetentionRisk()
                .sort((a, b) => b.riskScore - a.riskScore)
                .slice(0, 15)
                .map((risk, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-orange-600">
                          {risk.employee.first_name?.[0]}{risk.employee.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {risk.employee.first_name} {risk.employee.last_name}
                        </h4>
                        <p className="text-gray-600">{risk.employee.job_title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        risk.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                        risk.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {risk.riskLevel.toUpperCase()} RISK
                      </span>
                      <div className="text-sm text-gray-500 mt-1">Score: {risk.riskScore}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Risk Factors</h5>
                      <ul className="space-y-1">
                        {risk.riskFactors.length > 0 ? risk.riskFactors.map((factor, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center">
                            <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                            {factor}
                          </li>
                        )) : (
                          <li className="text-sm text-gray-500">No significant risk factors identified</li>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Recommended Actions</h5>
                      <ul className="space-y-1">
                        {risk.retentionActions.map((action, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Last survey: {risk.lastEngagementSurvey} days ago
                    </div>
                    <button
                      onClick={() => navigate(`/employee/${risk.employee.id}`)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View Employee →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLifecycleTab; 