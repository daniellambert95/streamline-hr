import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import handleApiError from '../../../core/utils/handleApiError';
import { Department } from '../../../domains/organization/types/department';
import { Team } from '../../../domains/organization/types/team';
import { Manager } from '../../../domains/organization/types/manager';
import AddEmployeeForm from '../../../domains/employees/components/forms/AddEmployeeForm';
import { teamService } from '../../../domains/organization/services/teams';
import { departmentService } from '../../../domains/organization/services/departments';
import { managerService } from '../../../domains/organization/services/managers';
import EmployeeDirectoryTab from './components/EmployeeDirectoryTab';
import TeamsAndDepartmentsTab from './components/TeamsAndDepartmentsTab';
import ManagerViewTab from './components/ManagerViewTab';
import EmployeeLifecycleTab from './components/EmployeeLifecycleTab';
import AnalyticsTab from './components/AnalyticsTab';

const EmployeeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data based on active tab
  const fetchData = async () => {
    try {
      switch (activeTab) {
        case 'teams': {
          const { data: teamsData } = await teamService.getAll();
          setTeams(teamsData);
          const { data: departmentsData } = await departmentService.getAll();
          setDepartments(departmentsData);
          break;
        }
        case 'managers': {
          const { data: managersData } = await managerService.getAll();
          setManagers(managersData);
          break;
        }
        default: {
          // Always fetch basic data needed by most tabs
          const { data: departmentsData } = await departmentService.getAll();
          setDepartments(departmentsData);
          const { data: teamsData } = await teamService.getAll();
          setTeams(teamsData);
          break;
        }
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAddEmployee = async () => {
    await fetchData(); // Refresh all data
    setIsModalOpen(false);
    toast.success('Employee added successfully');
  };

  return (
    <div className="max-w-7xl mx-auto bg-neutral-white shadow-lg rounded-lg p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-dark">Employee Management</h1>
      </div>

      {/* Tabs */}
      <div className="border-b mt-6">
        <nav className="flex space-x-6">
          <button
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === 'directory' ? 'border-b-2 border-primary text-primary' : 'text-neutral-dark hover:text-primary'
            }`}
            onClick={() => setActiveTab('directory')}
          >
            Employee Directory
          </button>
          <button
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === 'teams' ? 'border-b-2 border-primary text-primary' : 'text-neutral-dark hover:text-primary'
            }`}
            onClick={() => setActiveTab('teams')}
          >
            Teams & Departments
          </button>
          <button
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === 'managers' ? 'border-b-2 border-primary text-primary' : 'text-neutral-dark hover:text-primary'
            }`}
            onClick={() => setActiveTab('managers')}
          >
            Manager View
          </button>
          <button
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === 'lifecycle' ? 'border-b-2 border-primary text-primary' : 'text-neutral-dark hover:text-primary'
            }`}
            onClick={() => setActiveTab('lifecycle')}
          >
            Employee Lifecycle
          </button>
          <button
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === 'analytics' ? 'border-b-2 border-primary text-primary' : 'text-neutral-dark hover:text-primary'
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
          <EmployeeDirectoryTab 
            departments={departments}
            teams={teams}
            setIsModalOpen={setIsModalOpen}
          />
        )}

        {/* Teams & Departments Tab */}
        {activeTab === 'teams' && (
          <TeamsAndDepartmentsTab
            departments={departments}
            teams={teams}
          />
        )}

        {/* Manager View Tab */}
        {activeTab === 'managers' && (
          <ManagerViewTab
            managers={managers}
          />
        )}

        {/* Employee Lifecycle Tab */}
        {activeTab === 'lifecycle' && (
          <EmployeeLifecycleTab />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsTab
            departments={departments}
            teams={teams}
          />
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