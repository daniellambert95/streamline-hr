import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Department } from '../../../../domains/organization/types/department';
import { Team } from '../../../../domains/organization/types/team';
import { useEmployeeSearch } from '../../../../domains/employees/hooks/useEmployeeSearch';

interface TeamsAndDepartmentsTabProps {
  departments: Department[];
  teams: Team[];
}

const TeamsAndDepartmentsTab: React.FC<TeamsAndDepartmentsTabProps> = ({
  departments,
  teams
}) => {
  const navigate = useNavigate();
  const { employees: searchEmployees } = useEmployeeSearch();
  const [currentView, setCurrentView] = useState<'overview' | 'department' | 'team'>('overview');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'chart'>('cards');

  // Filter teams by department
  const getTeamsForDepartment = (departmentId: number) => {
    return teams.filter(team => team.department_id === departmentId);
  };

  // Get employees for team
  const getEmployeesForTeam = (teamName: string) => {
    return searchEmployees.filter(emp => emp.team_name === teamName);
  };

  // Get employees for department
  const getEmployeesForDepartment = (departmentName: string) => {
    return searchEmployees.filter(emp => emp.department_name === departmentName);
  };

  // Calculate department metrics
  const getDepartmentMetrics = (department: Department) => {
    const employees = getEmployeesForDepartment(department.name);
    const departmentTeams = getTeamsForDepartment(department.id);
    
    return {
      headcount: employees.length,
      targetHeadcount: 50, // This would come from backend in real app
      totalSalaryCosts: employees.length * 75000, // Estimated average
      budgetUtilization: 75 + Math.random() * 20, // Percentage
      activeProjects: departmentTeams.length * 2, // Estimated
      performanceScore: 4.2 + Math.random() * 0.8 // Mock score
    };
  };

  // Calculate team metrics
  const getTeamMetrics = (team: Team) => {
    const employees = getEmployeesForTeam(team.name);
    
    return {
      headcount: employees.length,
      rolesBreakdown: {
        senior: Math.floor(employees.length * 0.3),
        mid: Math.floor(employees.length * 0.5),
        junior: Math.floor(employees.length * 0.2)
      },
      averageTenure: 2.5 + Math.random() * 2,
      lastActivity: `Updated project status ${Math.floor(Math.random() * 7)} days ago`
    };
  };

  // Breadcrumb component
  const Breadcrumbs = () => (
    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <button 
        onClick={() => setCurrentView('overview')}
        className="hover:text-primary transition-colors"
      >
        Teams & Departments
      </button>
      {selectedDepartment && (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <button 
            onClick={() => setCurrentView('department')}
            className="hover:text-primary transition-colors"
          >
            {selectedDepartment.name}
          </button>
        </>
      )}
      {selectedTeam && (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-neutral-dark font-medium">{selectedTeam.name}</span>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      {/* Header with View Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-dark">
            {currentView === 'overview' ? 'Organization Overview' :
             currentView === 'department' ? selectedDepartment?.name :
             selectedTeam?.name}
          </h2>
          <p className="text-gray-600">
            {currentView === 'overview' ? 'Manage departments and teams across your organization' :
             currentView === 'department' ? `${getTeamsForDepartment(selectedDepartment?.id || 0).length} teams` :
             `${getEmployeesForTeam(selectedTeam?.name || '').length} team members`}
          </p>
        </div>
        
        {currentView === 'overview' && (
          <div className="flex bg-neutral-light rounded-lg p-1">
            <button 
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-neutral-white text-neutral-dark shadow-sm' 
                  : 'text-gray-600 hover:text-neutral-dark'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                viewMode === 'chart' 
                  ? 'bg-neutral-white text-neutral-dark shadow-sm' 
                  : 'text-gray-600 hover:text-neutral-dark'
              }`}
            >
              Org Chart
            </button>
          </div>
        )}
      </div>

      {/* Overview - Department Cards */}
      {currentView === 'overview' && viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {departments.map(dept => {
            const metrics = getDepartmentMetrics(dept);
            const departmentTeams = getTeamsForDepartment(dept.id);
            
            return (
              <div 
                key={dept.id} 
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedDepartment(dept);
                  setCurrentView('department');
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{dept.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{dept.description || 'No description available'}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{metrics.headcount}</div>
                    <div className="text-sm text-gray-600">Employees</div>
                    <div className="text-xs text-green-600">Target: {metrics.targetHeadcount}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{departmentTeams.length}</div>
                    <div className="text-sm text-gray-600">Teams</div>
                  </div>
                </div>

                {/* Budget Utilization */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Budget Utilization</span>
                    <span className="font-medium text-gray-900">{metrics.budgetUtilization.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        metrics.budgetUtilization > 90 ? 'bg-red-500' :
                        metrics.budgetUtilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, metrics.budgetUtilization)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Footer Stats */}
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-gray-500">Salary Costs: </span>
                    <span className="font-medium text-gray-900">${(metrics.totalSalaryCosts / 1000).toFixed(0)}k</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Performance: </span>
                    <span className="font-medium text-gray-900">{metrics.performanceScore.toFixed(1)}/5</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Overview - Org Chart View */}
      {currentView === 'overview' && viewMode === 'chart' && (
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="space-y-8">
            {departments.map(dept => {
              const departmentTeams = getTeamsForDepartment(dept.id);
              
              return (
                <div key={dept.id} className="border-l-4 border-indigo-500 pl-6">
                  <div 
                    className="flex items-center justify-between bg-indigo-50 p-4 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setCurrentView('department');
                    }}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-900">{dept.name}</h3>
                      <p className="text-indigo-700 text-sm">{getEmployeesForDepartment(dept.name).length} employees • {departmentTeams.length} teams</p>
                    </div>
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  <div className="mt-4 ml-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {departmentTeams.map(team => {
                      const teamEmployees = getEmployeesForTeam(team.name);
                      
                      return (
                        <div 
                          key={team.id}
                          className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDepartment(dept);
                            setSelectedTeam(team);
                            setCurrentView('team');
                          }}
                        >
                          <h4 className="font-medium text-gray-900">{team.name}</h4>
                          <p className="text-sm text-gray-600">{teamEmployees.length} members</p>
                          {teamEmployees.length > 0 && (
                            <div className="flex -space-x-2 mt-2">
                              {teamEmployees.slice(0, 3).map((emp, idx) => (
                                <div key={idx} className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 border-2 border-white">
                                  {emp.first_name?.[0]}{emp.last_name?.[0]}
                                </div>
                              ))}
                              {teamEmployees.length > 3 && (
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500 border-2 border-white">
                                  +{teamEmployees.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Department View - Team Cards */}
      {currentView === 'department' && selectedDepartment && (
        <div className="space-y-6">
          {/* Department Summary */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold mb-2">{selectedDepartment.name} Overview</h3>
                <p className="text-indigo-100">{selectedDepartment.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{getEmployeesForDepartment(selectedDepartment.name).length}</div>
                <div className="text-indigo-100">Total Employees</div>
              </div>
            </div>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {getTeamsForDepartment(selectedDepartment.id).map(team => {
              const metrics = getTeamMetrics(team);
              const teamEmployees = getEmployeesForTeam(team.name);
              const manager = teamEmployees.find(emp => emp.manager_name === null); // Simplified manager detection

              return (
                <div 
                  key={team.id}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedTeam(team);
                    setCurrentView('team');
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{team.name}</h4>
                      <p className="text-gray-600 text-sm">{metrics.headcount} members</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Manager Info */}
                  {manager && (
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {manager.first_name?.[0]}{manager.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{manager.first_name} {manager.last_name}</div>
                        <div className="text-xs text-gray-600">Team Manager</div>
                      </div>
                    </div>
                  )}

                  {/* Role Breakdown */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Team Composition</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Senior</span>
                        <span className="text-gray-900">{metrics.rolesBreakdown.senior}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Mid-level</span>
                        <span className="text-gray-900">{metrics.rolesBreakdown.mid}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Junior</span>
                        <span className="text-gray-900">{metrics.rolesBreakdown.junior}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="border-t pt-3">
                    <div className="text-xs text-gray-500">{metrics.lastActivity}</div>
                    <div className="text-xs text-gray-500 mt-1">Avg. tenure: {metrics.averageTenure.toFixed(1)} years</div>
                  </div>

                  {/* Team Members Preview */}
                  {teamEmployees.length > 0 && (
                    <div className="flex -space-x-2 mt-3">
                      {teamEmployees.slice(0, 4).map((emp, idx) => (
                        <div key={idx} className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 border-2 border-white">
                          {emp.first_name?.[0]}{emp.last_name?.[0]}
                        </div>
                      ))}
                      {teamEmployees.length > 4 && (
                        <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500 border-2 border-white">
                          +{teamEmployees.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Team View - Team Members */}
      {currentView === 'team' && selectedTeam && (
        <div className="space-y-6">
          {/* Team Header */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedTeam.name}</h3>
                <p className="text-gray-600">Part of {selectedDepartment?.name} Department</p>
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Add Member
              </button>
            </div>
          </div>

          {/* Team Members List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">Team Members</h4>
            </div>
            <div className="divide-y divide-gray-200">
              {getEmployeesForTeam(selectedTeam.name).map(employee => (
                <div key={employee.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {employee.first_name?.[0]}{employee.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{employee.job_title}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${employee.employment_status === 'active' ? 'bg-green-100 text-green-800' : 
                          employee.employment_status === 'onboarding' ? 'bg-blue-100 text-blue-800' :
                          employee.employment_status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {employee.employment_status}
                      </span>
                      <button
                        onClick={() => navigate(`/employee/${employee.id}`)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        View Profile
                      </button>
                    </div>
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

export default TeamsAndDepartmentsTab; 