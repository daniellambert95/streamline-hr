import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  HiArrowLeft,
  HiSave,
  HiX,
  HiUser,
  HiOfficeBuilding,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiCalendar,
  HiIdentification
} from 'react-icons/hi';
import { Employee } from '../../../domains/employees/types/employee';
import { Department } from '../../../domains/organization/types/department';
import { Team } from '../../../domains/organization/types/team';
import { Manager } from '../../../domains/organization/types/manager';
import { employeeService } from '../../../domains/employees/services/employees';
import { departmentService } from '../../../domains/organization/services/departments';
import { teamService } from '../../../domains/organization/services/teams';
import { managerService } from '../../../domains/organization/services/managers';
import handleApiError from '../../../core/utils/handleApiError';

const EditEmployee: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    job_title: '',
    department_name: '',
    team_name: '',
    manager_name: '',
    employment_status: 'active' as 'active' | 'inactive' | 'onboarding' | 'on_leave',
    personal_email: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    work_permit_status: '',
    work_permit_expiry: '',
    health_insurance_provider: '',
    tax_id: '',
    probation_end_date: '',
    contract_end_date: '',
    last_promotion_date: '',
    leave_balance: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const [
          { data: employeeData },
          { data: departmentsData },
          { data: teamsData },
          { data: managersData }
        ] = await Promise.all([
          employeeService.getById(parseInt(id)),
          departmentService.getAll(),
          teamService.getAll(),
          managerService.getAll()
        ]);

        setEmployee(employeeData);
        setDepartments(departmentsData);
        setTeams(teamsData);
        setManagers(managersData);

        // Populate form with employee data
        setFormData({
          first_name: employeeData.first_name || '',
          last_name: employeeData.last_name || '',
          email: employeeData.email || '',
          job_title: employeeData.job_title || '',
          department_name: employeeData.department_name || '',
          team_name: employeeData.team_name || employeeData.team || '',
          manager_name: employeeData.manager_name || employeeData.manager || '',
          employment_status: employeeData.employment_status || 'active',
          personal_email: employeeData.personal_email || '',
          date_of_birth: employeeData.date_of_birth || '',
          gender: employeeData.gender || '',
          marital_status: employeeData.marital_status || '',
          address: employeeData.address || '',
          emergency_contact_name: employeeData.emergency_contact_name || '',
          emergency_contact_phone: employeeData.emergency_contact_phone || '',
          work_permit_status: employeeData.work_permit_status || '',
          work_permit_expiry: employeeData.work_permit_expiry || '',
          health_insurance_provider: employeeData.health_insurance_provider || '',
          tax_id: employeeData.tax_id || '',
          probation_end_date: employeeData.probation_end_date || '',
          contract_end_date: employeeData.contract_end_date || '',
          last_promotion_date: employeeData.last_promotion_date || '',
          leave_balance: employeeData.leave_balance || 0
        });
      } catch (error) {
        handleApiError(error);
        toast.error('Failed to load employee data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee || !id) return;

    setIsSaving(true);
    try {
      // Clean and prepare the data for submission
      const updateData = {
        ...formData,
        // Convert empty strings to undefined for optional fields
        personal_email: formData.personal_email || undefined,
        date_of_birth: formData.date_of_birth || undefined,
        gender: formData.gender || undefined,
        marital_status: formData.marital_status || undefined,
        address: formData.address || undefined,
        emergency_contact_name: formData.emergency_contact_name || undefined,
        emergency_contact_phone: formData.emergency_contact_phone || undefined,
        work_permit_status: formData.work_permit_status || undefined,
        work_permit_expiry: formData.work_permit_expiry || undefined,
        health_insurance_provider: formData.health_insurance_provider || undefined,
        tax_id: formData.tax_id || undefined,
        probation_end_date: formData.probation_end_date || undefined,
        contract_end_date: formData.contract_end_date || undefined,
        last_promotion_date: formData.last_promotion_date || undefined,
        // Convert string numbers to actual numbers
        leave_balance: parseInt(formData.leave_balance.toString()) || 0
      };

      console.log('Submitting employee update:', updateData);
      
      await employeeService.update(parseInt(id), updateData as Partial<Employee>);
      toast.success('Employee updated successfully');
      navigate(`/employee-profile/${employee.id}`);
    } catch (error) {
      console.error('Employee update error:', error);
      handleApiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto bg-neutral-white shadow-lg rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="max-w-4xl mx-auto bg-neutral-white shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Employee Not Found</h2>
        <p className="text-gray-600 mb-6">The employee you're trying to edit doesn't exist.</p>
        <button
          onClick={() => navigate('/employee-management')}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Back to Employee Management
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-neutral-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/employee-profile/${employee.id}`)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <HiArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Employee Profile
              </h1>
              <p className="text-gray-600">
                {employee.first_name} {employee.last_name}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(`/employee-profile/${employee.id}`)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <HiX className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              form="edit-employee-form"
              disabled={isSaving}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <HiSave className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <form id="edit-employee-form" onSubmit={handleSubmit} className="p-6">
        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HiUser className="w-5 h-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Email
                </label>
                <input
                  type="email"
                  name="personal_email"
                  value={formData.personal_email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formatDateForInput(formData.date_of_birth)}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marital Status
                </label>
                <input
                  type="text"
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleInputChange}
                  placeholder="e.g., Single, Married, Divorced"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HiOfficeBuilding className="w-5 h-5" />
              Work Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Status
                </label>
                <select
                  name="employment_status"
                  value={formData.employment_status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  name="department_name"
                  value={formData.department_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team
                </label>
                <select
                  name="team_name"
                  value={formData.team_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.name}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager
                </label>
                <select
                  name="manager_name"
                  value={formData.manager_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Manager</option>
                  {managers.map(manager => (
                    <option key={manager.id} value={`${manager.first_name} ${manager.last_name}`}>
                      {manager.first_name} {manager.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Balance (days)
                </label>
                <input
                  type="number"
                  name="leave_balance"
                  value={formData.leave_balance}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Probation End Date
                </label>
                <input
                  type="date"
                  name="probation_end_date"
                  value={formatDateForInput(formData.probation_end_date)}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract End Date
                </label>
                <input
                  type="date"
                  name="contract_end_date"
                  value={formatDateForInput(formData.contract_end_date)}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Promotion Date
                </label>
                <input
                  type="date"
                  name="last_promotion_date"
                  value={formatDateForInput(formData.last_promotion_date)}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HiPhone className="w-5 h-5" />
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HiIdentification className="w-5 h-5" />
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Permit Status
                </label>
                <input
                  type="text"
                  name="work_permit_status"
                  value={formData.work_permit_status}
                  onChange={handleInputChange}
                  placeholder="e.g., Valid, Expired, Not Required"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Permit Expiry
                </label>
                <input
                  type="date"
                  name="work_permit_expiry"
                  value={formatDateForInput(formData.work_permit_expiry)}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Insurance Provider
                </label>
                <input
                  type="text"
                  name="health_insurance_provider"
                  value={formData.health_insurance_provider}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID
                </label>
                <input
                  type="text"
                  name="tax_id"
                  value={formData.tax_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee; 