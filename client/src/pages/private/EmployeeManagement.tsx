import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import handleApiError from '../../core/utils/handleApiError';
import { Employee } from '../../domains/employees/types/employee';
import { Department } from '../../domains/organization/types/department';
import { Team } from '../../domains/organization/types/team';
import { Manager } from '../../domains/organization/types/manager';
import AddEmployeeForm from '../../domains/employees/components/forms/AddEmployeeForm';
import StatCard from '../../core/components/common/StatCard';
import { employeeService } from '../../domains/employees/services/employees';
import { teamService } from '../../domains/organization/services/teams';
import { departmentService } from '../../domains/organization/services/departments';
import { analyticsService } from '../../domains/analytics/services/analytics';
import { managerService } from '../../domains/organization/services/managers';
import { GenericAnalyticsData } from '../../domains/analytics/types/genericAnalytics';
import { useEmployeeSearch } from '../../domains/employees/hooks/useEmployeeSearch';

const EmployeeManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('directory');
  const [, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState<GenericAnalyticsData>({
    activeEmployees: 0,
    totalTeams: 0,
    totalManagers: 0,
    newHires: 0,
    totalEmployees: 0,
    departmentDistribution: {},
    turnoverRate: 0,
    avgTenure: 0
  });

  const { query, setQuery, employees: searchEmployees, isLoading } = useEmployeeSearch();

  // Fetch data based on active tab
  const fetchData = async () => {
    try {
      switch (activeTab) {
        case 'directory':
          const { data: employeesData } = await employeeService.getAll();
          setEmployees(employeesData);
          break;
        case 'teams':
          const { data: teamsData } = await teamService.getAll();
          setTeams(teamsData);
          const { data: departmentsData } = await departmentService.getAll();
          setDepartments(departmentsData);
          break;
        case 'managers':
          const { data: managersData } = await managerService.getAll();
          setManagers(managersData);
          break;
        case 'analytics':
          const { data: statsData } = await analyticsService.getEmployeeAnalytics();
          setAnalytics(statsData);
          break;
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Add useEffect to trigger fetchData on tab change
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Replace the existing analytics cards with:
  const AnalyticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Employees"
        value={analytics.activeEmployees.toString()}
        subValue="Active employees"
        icon="users"
      />
      <StatCard
        title="Total Teams"
        value={analytics.totalTeams.toString()}
        subValue="Across departments"
        icon="teams"
      />
      <StatCard
        title="Total Managers"
        value={analytics.totalManagers.toString()}
        subValue="Team leads & above"
        icon="managers"
      />
      <StatCard
        title="New Hires"
        value={analytics.newHires.toString()}
        subValue="Last 30 days"
        icon="growth"
      />
    </div>
  );

  const handleAddEmployee = async () => {
    await fetchData(); // Refresh all data
    setIsModalOpen(false);
    toast.success('Employee added successfully');
  };

  const TeamsAndDepartmentsView = ({ teams, departments }: { teams: Team[], departments: Department[] }) => (
    <div className="space-y-6">
      {/* Departments Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Departments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(dept => (
            <div key={dept.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-lg">{dept.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{dept.description || 'No description available'}</p>
              <div className="mt-2 text-sm text-gray-500">
                Created: {new Date(dept.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teams Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => (
            <div key={team.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-lg">{team.name}</h3>
              <p className="text-gray-600 text-sm mt-1">
                Department ID: {team.department_id || 'Not assigned'}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                Created: {new Date(team.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ManagersView = ({ managers }: { managers: Manager[] }) => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Managers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {managers.map(manager => (
          <div key={manager.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-lg">
              {manager.first_name} {manager.last_name}
            </h3>
            <p className="text-gray-600">{manager.job_title}</p>
            <p className="text-gray-500 text-sm">{manager.email}</p>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${manager.can_approve_time_off ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>Can approve time off</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${manager.can_hire ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>Can hire</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${manager.can_edit_salary ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>Can edit salary</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-700">Employee Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
        >
          + Add Employee
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b mt-6">
        <nav className="flex space-x-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'directory' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('directory')}
          >
            Employee Directory
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'teams' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('teams')}
          >
            Teams & Departments
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'managers' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('managers')}
          >
            Manager View
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'lifecycle' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('lifecycle')}
          >
            Employee Lifecycle
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'analytics' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">

        {/* Employee Directory Tab */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            {/* Advanced Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div className="w-full lg:w-1/5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select 
                    className="w-full p-2 border rounded"
                    onChange={(e) => {
                      // Filter by department logic
                      console.log("Filter by department:", e.target.value);
                    }}
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="w-full lg:w-1/5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                  <select 
                    className="w-full p-2 border rounded"
                    onChange={(e) => {
                      // Filter by team logic
                      console.log("Filter by team:", e.target.value);
                    }}
                  >
                    <option value="">All Teams</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="w-full lg:w-1/5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    className="w-full p-2 border rounded"
                    onChange={(e) => {
                      // Filter by status logic
                      console.log("Filter by status:", e.target.value);
                    }}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <div>
                  <button 
                    className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded border hover:bg-gray-100"
                    onClick={() => {
                      // Clear filters logic
                      setQuery('');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded border border-indigo-200 hover:bg-indigo-100 flex items-center"
                    onClick={() => {
                      // Export to CSV logic
                      console.log("Export to CSV");
                    }}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Export CSV
                  </button>
                  
                  <button 
                    className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded border border-indigo-200 hover:bg-indigo-100 flex items-center"
                    onClick={() => {
                      // Print view logic
                      console.log("Print view");
                    }}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                    </svg>
                    Print
                  </button>
                </div>
              </div>
            </div>
            
            {/* Bulk Actions */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button 
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 disabled:opacity-50"
                  disabled={true}  // Would be enabled when items are selected
                >
                  Bulk Edit
                </button>
                
                <button 
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 disabled:opacity-50"
                  disabled={true}  // Would be enabled when items are selected
                >
                  Change Department
                </button>
                
                <button 
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 disabled:opacity-50"
                  disabled={true}  // Would be enabled when items are selected
                >
                  Change Status
                </button>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">
                  Showing {searchEmployees.length} of {searchEmployees.length} employees
                </span>
              </div>
            </div>
            
            {/* Employee Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Job Title</th>
                    <th className="py-3 px-4 text-left">Department</th>
                    <th className="py-3 px-4 text-left">Team</th>
                    <th className="py-3 px-4 text-left">Manager</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-3 px-4 text-center">Loading...</td>
                  </tr>
                ) : searchEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 px-4 text-center text-gray-500">
                      No employees found matching your search criteria
                    </td>
                  </tr>
                ) : (
                  searchEmployees.map((employee) => (
                    <tr key={employee.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee.first_name} {employee.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{employee.job_title || '-'}</td>
                      <td className="py-3 px-4">{employee.department_name || '-'}</td>
                      <td className="py-3 px-4">{employee.team_name || '-'}</td>
                      <td className="py-3 px-4">{employee.manager_name || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 
                            employee.status === 'onboarding' ? 'bg-blue-100 text-blue-800' :
                            employee.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'}`}>
                          {employee.status || 'inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => navigate(`/employee/${employee.id}`)}
                            className="bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-600"
                          >
                            View
                          </button>
                          <button
                            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-200"
                            onClick={() => {
                              // Edit employee logic
                              console.log("Edit employee:", employee.id);
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing page 1 of 1
              </div>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  disabled={true}
                >
                  Previous
                </button>
                <button 
                  className="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  disabled={true}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Teams & Departments Tab */}
        {activeTab === 'teams' && (
          <TeamsAndDepartmentsView teams={teams} departments={departments} />
        )}

        {/* Manager View Tab */}
        {activeTab === 'managers' && (
          <ManagersView managers={managers} />
        )}

        {/* Employee Lifecycle Tab */}
        {activeTab === 'lifecycle' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Employee Lifecycle Management</h2>
              <div className="flex items-center gap-4">
                <select 
                  className="border rounded-lg px-3 py-2"
                  onChange={(e) => {
                    // Fix: In a real implementation, this would fetch specific employee data
                    const selectedId = Number(e.target.value);
                    if (selectedId) {
                    }
                  }}
                >
                  <option value="">Select Employee</option>
                  {searchEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* // Employee Lifecycle content */}
            <div className="text-gray-500 text-center">Employee Lifecycle content coming soon</div>
          </div>
        )}

        {/* analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <AnalyticsCards />
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddEmployeeForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleAddEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeManagement; 