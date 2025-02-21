import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { generateTemporaryPassword } from '../utils/passwords';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface EmployeeFormData {
  // User data
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'employee' | 'recruiter' | 'admin' | null;
  
  // Employee data
  job_title: string;
  team_id: number;
  department_id: number;
  manager_id: number | null;
  starting_date: string;
  mobile_number: string;
  job_level: string;
  salary: string;
  employment_type: 'full_time' | 'part_time' | 'contract';
  is_manager: boolean;
}

interface Department {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
}

interface Manager {
  id: number;
  first_name: string;
  last_name: string;
  job_title: string;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const initialFormData: EmployeeFormData = {
    email: '',
    password: generateTemporaryPassword(),
    first_name: '',
    last_name: '',
    role: null,
    job_title: '',
    team_id: 0,
    department_id: 0,
    manager_id: null,
    starting_date: new Date().toISOString().split('T')[0],
    mobile_number: '',
    job_level: '',
    salary: '',
    employment_type: 'full_time',
    is_manager: false,
  };

  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);

  const [teams, setTeams] = useState<Team[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingNewTeam, setIsAddingNewTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    // Fetch teams and departments on mount
    fetchTeamsAndDepartments();
  }, []);

  const fetchTeamsAndDepartments = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const [teamsRes, deptsRes, managersRes] = await Promise.all([
        fetch('http://localhost:3000/api/teams', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('http://localhost:3000/api/departments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('http://localhost:3000/api/employees/managers', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      const [teamsData, deptsData, managersData] = await Promise.all([
        teamsRes.json(),
        deptsRes.json(),
        managersRes.json()
      ]);

      setTeams(teamsData);
      setDepartments(deptsData);
      setManagers(managersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load form data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3000/api/employees/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create employee');
      }

      const data = await response.json();
      toast.success('Employee added successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error creating employee:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newTeamName })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create team');
      }

      const data = await response.json();
      setTeams(prev => [...prev, data]);
      setFormData(prev => ({ ...prev, team_id: data.id }));
      setNewTeamName('');
      setIsAddingNewTeam(false);
      
      toast.success('Team created successfully');
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create team');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Fixed Header */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-700">Add New Employee</h2>
        </div>

        {/* Scrollable Form Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Role</label>
                <select
                  name="role"
                  value={formData.role || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as EmployeeFormData['role'] }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Employee</option>
                  <option value="admin">Admin</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Job Title</label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Department</label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={(e) => setFormData(prev => ({ ...prev, department_id: Number(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Team</label>
              <select
                name="team_id"
                value={formData.team_id}
                onChange={(e) => setFormData(prev => ({ ...prev, team_id: Number(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>

            <div className="mt-2">
              <button
                type="button"
                onClick={() => setIsAddingNewTeam(!isAddingNewTeam)}
                className="text-blue-600 text-sm hover:underline"
              >
                {isAddingNewTeam ? 'Cancel' : 'Add New Team'}
              </button>
              
              {isAddingNewTeam && (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter new team name"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleCreateNewTeam}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Create Team
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Employment Type</label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={(e) => setFormData(prev => ({ ...prev, employment_type: e.target.value as 'full_time' | 'part_time' | 'contract' }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="full_time">Full-Time</option>
                <option value="part_time">Part-Time</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Salary</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Starting Date</label>
              <input
                type="date"
                name="starting_date"
                value={formData.starting_date}
                onChange={(e) => setFormData(prev => ({ ...prev, starting_date: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Mobile Number</label>
              <input
                type="text"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile_number: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Job Level</label>
              <input
                type="text"
                name="job_level"
                value={formData.job_level}
                onChange={(e) => setFormData(prev => ({ ...prev, job_level: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Manager</label>
              <select
                name="manager_id"
                value={formData.manager_id || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, manager_id: Number(e.target.value) || null }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Manager</option>
                {managers.map(manager => (
                  <option key={manager.id} value={manager.id}>
                    {manager.first_name} {manager.last_name} - {manager.job_title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="is_manager"
                checked={formData.is_manager}
                onChange={(e) => setFormData(prev => ({ ...prev, is_manager: e.target.checked }))}
                className="h-4 w-4"
              />
              <label htmlFor="is_manager" className="text-sm font-medium text-gray-600">
                Assign as Manager
              </label>
            </div>

            <div className="p-6 border-t mt-6">
              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white py-2 rounded mb-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Adding...' : 'Add Employee'}
              </button>
              <button 
                type="button"
                onClick={onClose} 
                className="w-full text-gray-500 text-sm hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;