import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  HiUpload, 
  HiDownload, 
  HiX, 
  HiEye, 
  HiPencil, 
  HiPlus,
  HiUsers
} from 'react-icons/hi';
import { Employee } from '../../../../domains/employees/types/employee';
import { Department } from '../../../../domains/organization/types/department';
import { Team } from '../../../../domains/organization/types/team';
import { useEmployeeSearch } from '../../../../domains/employees/hooks/useEmployeeSearch';

interface EmployeeDirectoryTabProps {
  departments: Department[];
  teams: Team[];
  setIsModalOpen: (open: boolean) => void;
}

const EmployeeDirectoryTab: React.FC<EmployeeDirectoryTabProps> = ({
  departments,
  teams,
  setIsModalOpen
}) => {
  const navigate = useNavigate();
  const { employees: searchEmployees } = useEmployeeSearch();
  
  // Enhanced state management
  const [query, setQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isProfilePreviewOpen, setIsProfilePreviewOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Enhanced utility functions
  const handleEmployeeSelect = (employeeId: number, checked: boolean) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, employeeId]);
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  };

  const toggleQuickFilter = (filter: string) => {
    setQuickFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearAllFilters = () => {
    setQuery('');
    setDepartmentFilter('');
    setTeamFilter('');
    setStatusFilter('');
    setQuickFilters([]);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Job Title', 'Department', 'Team', 'Manager', 'Status'],
      ...filteredEmployees.map(emp => [
        `${emp.first_name} ${emp.last_name}`,
        emp.email || '',
        emp.job_title || '',
        emp.department_name || '',
        emp.team_name || '',
        emp.manager_name || '',
        emp.employment_status || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const openEmployeePreview = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsProfilePreviewOpen(true);
  };

  // Enhanced filtering logic
  const filteredEmployees = searchEmployees.filter(employee => {
    // Department filter
    if (departmentFilter) {
      const selectedDept = departments.find(d => d.id.toString() === departmentFilter);
      if (selectedDept && employee.department_name !== selectedDept.name) {
        return false;
      }
    }
    
    // Team filter
    if (teamFilter) {
      const selectedTeam = teams.find(t => t.id.toString() === teamFilter);
      if (selectedTeam && employee.team_name !== selectedTeam.name) {
        return false;
      }
    }
    
    // Status filter
    if (statusFilter && employee.employment_status !== statusFilter) {
      return false;
    }
    
    // Quick filters
    if (quickFilters.length > 0) {
      const matchesQuickFilter = quickFilters.some(filter => {
        switch (filter) {
          case 'new-hires': {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(employee.starting_date) > thirtyDaysAgo;
          }
          case 'active': {
            return employee.employment_status === 'active';
          }
          case 'on-leave': {
            return employee.employment_status === 'on_leave';
          }
          case 'probation': {
            return employee.probation_end_date && new Date(employee.probation_end_date) > new Date();
          }
          default: {
            return true;
          }
        }
      });
      if (!matchesQuickFilter) return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Bulk Import */}
      <div className="flex justify-between items-center bg-neutral-white p-4 rounded-lg shadow">
        <div>
          <h2 className="text-xl font-semibold text-neutral-dark">Employee Directory</h2>
          <p className="text-sm text-gray-600 mt-1">Manage and view all employees in your organization</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="bg-accent-blue text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 flex items-center gap-2 transition-colors"
          >
            <HiUpload className="w-4 h-4" />
            Bulk Import
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-600 flex items-center gap-2 transition-colors"
          >
            <HiPlus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-neutral-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-neutral-dark mb-3">Quick Filters</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'active', label: 'Active', count: filteredEmployees.filter(e => e.employment_status === 'active').length },
            { key: 'new-hires', label: 'New Hires (30d)', count: filteredEmployees.filter(e => {
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return new Date(e.starting_date) > thirtyDaysAgo;
            }).length },
            { key: 'on-leave', label: 'On Leave', count: filteredEmployees.filter(e => e.employment_status === 'on_leave').length },
            { key: 'probation', label: 'Probation', count: filteredEmployees.filter(e => e.probation_end_date && new Date(e.probation_end_date) > new Date()).length }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => toggleQuickFilter(filter.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                quickFilters.includes(filter.key)
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-neutral-white border-neutral-medium text-neutral-dark hover:bg-neutral-light'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Search and Filter */}
      <div className="bg-neutral-white p-4 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-neutral-dark mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, job title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 border border-neutral-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div className="w-full lg:w-1/5">
            <label className="block text-sm font-medium text-neutral-dark mb-1">Department</label>
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full p-3 border border-neutral-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full lg:w-1/5">
            <label className="block text-sm font-medium text-neutral-dark mb-1">Team</label>
            <select 
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full p-3 border border-neutral-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full lg:w-1/5">
            <label className="block text-sm font-medium text-neutral-dark mb-1">Status</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-3 border border-neutral-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
          <button 
            onClick={clearAllFilters}
            className="bg-neutral-light text-neutral-dark px-4 py-2 rounded-lg border border-neutral-medium hover:bg-gray-200 transition-colors"
          >
            Clear All Filters
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={exportToCSV}
              className="bg-primary-50 text-primary px-4 py-2 rounded-lg border border-primary-200 hover:bg-primary-100 flex items-center gap-2 transition-colors"
            >
              <HiDownload className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>
      
      {/* View Mode Toggle and Results Count */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Showing {filteredEmployees.length} of {searchEmployees.length} employees
          </span>
          {(query || departmentFilter || teamFilter || statusFilter || quickFilters.length > 0) && (
            <span className="text-xs text-primary bg-primary-50 px-2 py-1 rounded-full">
              Filtered
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-dark">View:</span>
          <div className="flex bg-neutral-light rounded-lg p-1">
            <button 
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-neutral-white text-neutral-dark shadow-sm' 
                  : 'text-gray-600 hover:text-neutral-dark'
              }`}
            >
              Table
            </button>
            <button 
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-neutral-white text-neutral-dark shadow-sm' 
                  : 'text-gray-600 hover:text-neutral-dark'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>
      
      {/* Employee Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto bg-neutral-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-neutral-light">
              <tr>
                <th className="py-3 px-4 text-left">
                  <input 
                    type="checkbox" 
                    checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-neutral-medium focus:ring-primary focus:border-primary" 
                  />
                </th>
                <th className="py-3 px-4 text-left font-medium text-neutral-dark">Name</th>
                <th className="py-3 px-4 text-left font-medium text-neutral-dark">Job Title</th>
                <th className="py-3 px-4 text-left font-medium text-neutral-dark">Department</th>
                <th className="py-3 px-4 text-left font-medium text-neutral-dark">Team</th>
                <th className="py-3 px-4 text-left font-medium text-neutral-dark">Manager</th>
                <th className="py-3 px-4 text-left font-medium text-neutral-dark">Status</th>
                <th className="py-3 px-4 text-center font-medium text-neutral-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 px-4 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <HiUsers className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-xl font-medium text-gray-900 mb-2">No employees found</p>
                      <p className="text-gray-500">Try adjusting your search criteria or add some employees.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee: Employee) => (
                  <tr key={employee.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <input 
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={(e) => handleEmployeeSelect(employee.id, e.target.checked)}
                        className="rounded border-neutral-medium focus:ring-primary focus:border-primary" 
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-700">
                            {employee.first_name[0]}{employee.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-neutral-dark">{employee.first_name} {employee.last_name}</p>
                          <p className="text-sm text-gray-600">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{employee.job_title}</td>
                    <td className="py-3 px-4 text-gray-700">{employee.department_name}</td>
                    <td className="py-3 px-4 text-gray-700">{employee.team_name || employee.team || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-700">{employee.manager || employee.manager_name || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.employment_status === 'active' 
                          ? 'bg-accent-green bg-opacity-20 text-green-800' :
                        employee.employment_status === 'inactive' 
                          ? 'bg-gray-100 text-gray-800' :
                        employee.employment_status === 'onboarding' 
                          ? 'bg-accent-blue bg-opacity-20 text-blue-800' :
                          'bg-accent-orange bg-opacity-20 text-orange-800'
                      }`}>
                        {employee.employment_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => navigate(`/employee-profile/${employee.id}`)}
                        className="bg-primary-50 text-primary px-3 py-1 rounded text-sm hover:bg-primary-100 transition-colors flex items-center gap-1"
                      >
                        <HiEye className="w-3 h-3" />
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/employee-management/edit/${employee.id}`)}
                        className="bg-neutral-light text-neutral-dark px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        <HiPencil className="w-3 h-3" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.length === 0 ? (
            <div className="col-span-full flex flex-col items-center py-12">
              <HiUsers className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-xl font-medium text-gray-900 mb-2">No employees found</p>
              <p className="text-gray-500 text-center">Try adjusting your search criteria or add some employees.</p>
            </div>
          ) : (
            filteredEmployees.map((employee: Employee) => (
              <div key={employee.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary-700">
                        {employee.first_name[0]}{employee.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <button 
                        onClick={() => openEmployeePreview(employee)}
                        className="font-medium text-gray-900 hover:text-primary-700 cursor-pointer"
                      >
                        {employee.first_name} {employee.last_name}
                      </button>
                      <p className="text-sm text-gray-500">{employee.job_title}</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={(e) => handleEmployeeSelect(employee.id, e.target.checked)}
                    className="rounded border-neutral-medium focus:ring-primary focus:border-primary" 
                  />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Department:</span>
                    <span className="text-gray-900 font-medium">{employee.department_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Team:</span>
                    <span className="text-gray-900 font-medium">{employee.team_name || employee.team || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Manager:</span>
                    <span className="text-gray-900 font-medium">{employee.manager || employee.manager_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${employee.employment_status === 'active' ? 'bg-accent-green bg-opacity-20 text-green-800' : 
                        employee.employment_status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        employee.employment_status === 'onboarding' ? 'bg-accent-blue bg-opacity-20 text-blue-800' :
                        'bg-accent-orange bg-opacity-20 text-orange-800'}`}>
                      {employee.employment_status}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => navigate(`/employee-profile/${employee.id}`)}
                    className="flex-1 bg-primary-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-primary-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <HiEye className="w-4 h-4" />
                    View Profile
                  </button>
                  <button
                    className="flex-1 bg-neutral-light text-neutral-dark px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                    onClick={() => navigate(`/employee-management/edit/${employee.id}`)}
                  >
                    <HiPencil className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Import Employees via CSV</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <HiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">Drop CSV file here or click to upload</span>
                    <input id="csv-upload" name="csv-upload" type="file" accept=".csv" className="sr-only" />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">CSV files up to 10MB</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium">Required CSV columns:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>first_name, last_name, email</li>
                  <li>job_title, department_name, team_name</li>
                  <li>starting_date (YYYY-MM-DD format)</li>
                </ul>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success('CSV import feature coming soon!');
                    setIsImportModalOpen(false);
                  }}
                  className="flex-1 bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Profile Preview Modal */}
      {isProfilePreviewOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-primary-700">
                    {selectedEmployee.first_name[0]}{selectedEmployee.last_name[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </h3>
                  <p className="text-gray-600">{selectedEmployee.job_title}</p>
                  <p className="text-sm text-gray-500">{selectedEmployee.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsProfilePreviewOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Work Information</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Department:</span>
                    <span className="ml-2 font-medium">{selectedEmployee.department_name || 'Not assigned'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Team:</span>
                    <span className="ml-2 font-medium">{selectedEmployee.team_name || 'Not assigned'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Manager:</span>
                    <span className="ml-2 font-medium">{selectedEmployee.manager_name || 'Not assigned'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Start Date:</span>
                    <span className="ml-2 font-medium">
                      {new Date(selectedEmployee.starting_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${selectedEmployee.employment_status === 'active' ? 'bg-accent-green bg-opacity-20 text-green-800' : 
                        selectedEmployee.employment_status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        selectedEmployee.employment_status === 'onboarding' ? 'bg-accent-blue bg-opacity-20 text-blue-800' :
                        'bg-accent-orange bg-opacity-20 text-orange-800'}`}>
                      {selectedEmployee.employment_status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Personal Email:</span>
                    <span className="ml-2 font-medium">{selectedEmployee.personal_email || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Date of Birth:</span>
                    <span className="ml-2 font-medium">
                      {selectedEmployee.date_of_birth ? new Date(selectedEmployee.date_of_birth).toLocaleDateString() : 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Emergency Contact:</span>
                    <span className="ml-2 font-medium">{selectedEmployee.emergency_contact_name || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Leave Balance:</span>
                    <span className="ml-2 font-medium">{selectedEmployee.leave_balance || 0} days</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  navigate(`/employee-profile/${selectedEmployee.id}`);
                  setIsProfilePreviewOpen(false);
                }}
                className="bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                View Full Profile
              </button>
              <button
                onClick={() => setIsProfilePreviewOpen(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDirectoryTab; 