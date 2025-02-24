import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import handleApiError from '../../utils/handleApiError';
import { Employee } from '../../types/employee';
import { Department } from '../../types/department';
import { Team } from '../../types/team';
import { Manager } from '../../types/manager';
import AddEmployeeForm from '../../components/forms/AddEmployeeForm';
import StatCard from '../../components/common/StatCard';
import { employeeService } from '../../services/api/endpoints/employees';
import { teamService } from '../../services/api/endpoints/teams';
import { departmentService } from '../../services/api/endpoints/departments';
import { analyticsService } from '../../services/api/endpoints/emoployeeAnalytics';
import { managerService } from '../../services/api/endpoints/managers';
import { EmployeeAnalyticsData } from '../../types/employeeAnalytics';

const EmployeeManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('directory');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState<EmployeeAnalyticsData>({
    activeEmployees: 0,
    totalTeams: 0,
    totalManagers: 0,
    newHires: 0
  });

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
    <div className="max-w-7xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
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

            {/* Employee Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
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
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-t hover:bg-gray-50">
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
                    <td className="py-3 px-4">{employee.department || '-'}</td>
                    <td className="py-3 px-4">{employee.team_name || '-'}</td>
                    <td className="py-3 px-4">{employee.manager_name || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {employee.status || 'inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => navigate(`/employee/${employee.id}`)}
                        className="bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-600"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
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
          // Employee Lifecycle content
          <div>Employee Lifecycle content coming soon</div>
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