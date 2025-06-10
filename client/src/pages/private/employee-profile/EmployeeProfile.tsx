import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  HiPencil,
  HiArrowLeft,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiCalendar,
  HiUser,
  HiOfficeBuilding,
  HiIdentification
} from 'react-icons/hi';
import { Employee } from '../../../domains/employees/types/employee';
import { employeeService } from '../../../domains/employees/services/employees';
import handleApiError from '../../../core/utils/handleApiError';

const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data } = await employeeService.getById(parseInt(id));
        setEmployee(data);
      } catch (error) {
        handleApiError(error);
        toast.error('Failed to load employee profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

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
        <p className="text-gray-600 mb-6">The employee profile you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/employee-management')}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Back to Employee Management
        </button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'onboarding':
        return 'bg-blue-100 text-blue-800';
      case 'on_leave':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-neutral-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/employee-management')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <HiArrowLeft className="w-6 h-6" />
            </button>
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary-700">
                {employee.first_name[0]}{employee.last_name[0]}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {employee.first_name} {employee.last_name}
              </h1>
              <p className="text-gray-600">{employee.job_title || 'No job title'}</p>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.employment_status)}`}>
                  {employee.employment_status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(`/employee-management/edit/${employee.id}`)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <HiPencil className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HiUser className="w-5 h-5" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <HiMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Work Email</p>
                    <p className="text-gray-900">{employee.email}</p>
                  </div>
                </div>
                {employee.personal_email && (
                  <div className="flex items-center gap-3">
                    <HiMail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Personal Email</p>
                      <p className="text-gray-900">{employee.personal_email}</p>
                    </div>
                  </div>
                )}
                {employee.date_of_birth && (
                  <div className="flex items-center gap-3">
                    <HiCalendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-gray-900">{formatDate(employee.date_of_birth)}</p>
                    </div>
                  </div>
                )}
                {employee.gender && (
                  <div className="flex items-center gap-3">
                    <HiUser className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="text-gray-900 capitalize">{employee.gender.replace('_', ' ')}</p>
                    </div>
                  </div>
                )}
                {employee.marital_status && (
                  <div className="flex items-center gap-3">
                    <HiIdentification className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Marital Status</p>
                      <p className="text-gray-900">{employee.marital_status}</p>
                    </div>
                  </div>
                )}
                {employee.address && (
                  <div className="flex items-center gap-3">
                    <HiLocationMarker className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-900">{employee.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            {(employee.emergency_contact_name || employee.emergency_contact_phone) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <HiPhone className="w-5 h-5" />
                  Emergency Contact
                </h3>
                <div className="space-y-4">
                  {employee.emergency_contact_name && (
                    <div>
                      <p className="text-sm text-gray-500">Contact Name</p>
                      <p className="text-gray-900">{employee.emergency_contact_name}</p>
                    </div>
                  )}
                  {employee.emergency_contact_phone && (
                    <div>
                      <p className="text-sm text-gray-500">Contact Phone</p>
                      <p className="text-gray-900">{employee.emergency_contact_phone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Work Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HiOfficeBuilding className="w-5 h-5" />
                Work Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="text-gray-900">{employee.department_name || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Team</p>
                  <p className="text-gray-900">{employee.team_name || employee.team || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Manager</p>
                  <p className="text-gray-900">{employee.manager_name || employee.manager || 'No manager assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-gray-900">{formatDate(employee.starting_date)}</p>
                </div>
                {employee.probation_end_date && (
                  <div>
                    <p className="text-sm text-gray-500">Probation End Date</p>
                    <p className="text-gray-900">{formatDate(employee.probation_end_date)}</p>
                  </div>
                )}
                {employee.contract_end_date && (
                  <div>
                    <p className="text-sm text-gray-500">Contract End Date</p>
                    <p className="text-gray-900">{formatDate(employee.contract_end_date)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Leave Balance</p>
                  <p className="text-gray-900">{employee.leave_balance} days</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-4">
                {employee.work_permit_status && (
                  <div>
                    <p className="text-sm text-gray-500">Work Permit Status</p>
                    <p className="text-gray-900">{employee.work_permit_status}</p>
                  </div>
                )}
                {employee.work_permit_expiry && (
                  <div>
                    <p className="text-sm text-gray-500">Work Permit Expiry</p>
                    <p className="text-gray-900">{formatDate(employee.work_permit_expiry)}</p>
                  </div>
                )}
                {employee.health_insurance_provider && (
                  <div>
                    <p className="text-sm text-gray-500">Health Insurance Provider</p>
                    <p className="text-gray-900">{employee.health_insurance_provider}</p>
                  </div>
                )}
                {employee.tax_id && (
                  <div>
                    <p className="text-sm text-gray-500">Tax ID</p>
                    <p className="text-gray-900">{employee.tax_id}</p>
                  </div>
                )}
                {employee.last_promotion_date && (
                  <div>
                    <p className="text-sm text-gray-500">Last Promotion Date</p>
                    <p className="text-gray-900">{formatDate(employee.last_promotion_date)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile; 