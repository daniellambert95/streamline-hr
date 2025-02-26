import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../domains/auth/context/AuthContext";
import handleApiError from "../../core/utils/handleApiError";
import { AuthUser } from "../../domains/users/types/user"
import EditProfileForm from "../../domains/employees/components/forms/UpdateProfileForm";
import { toast } from "react-hot-toast";
import { formatDate } from '../../core/utils/dateUtils';

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("public");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user, login, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, []);

  const handleProfileUpdate = async (updatedData: AuthUser) => {
    try {
      // Store the token before updating
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Update the context with new user data
      login(token, updatedData);
      
      // Close the modal and show success message
      setIsEditModalOpen(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      handleApiError(error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      {/* User Header */}
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
          {user.first_name?.[0]}{user.last_name?.[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-gray-600">{user.job_title} at {user.company_name}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mt-6">
        <nav className="flex space-x-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "public" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("public")}
          >
            Public Profile
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "personal" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Information
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "employment" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("employment")}
          >
            Employment Details
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "documents" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("documents")}
          >
            Documents
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Public Profile Tab */}
        {activeTab === "public" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-600">First Name</h3>
              <p className="font-medium">{user.first_name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Last Name</h3>
              <p className="font-medium">{user.last_name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Email</h3>
              <p className="font-medium">{user.email || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Personal Email</h3>
              <p className="font-medium">{user.personal_email || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Date of Birth</h3>
              <p className="font-medium">{formatDate(user.date_of_birth)}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Gender</h3>
              <p className="font-medium">{user.gender || 'N/A'}</p>
            </div>
          </div>
        )}

        {/* Work Tab */}
        {activeTab === "employment" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-600">Job Title</h3>
              <p className="font-medium">{user.job_title || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Department</h3>
              <p className="font-medium">{user.department_name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Team</h3>
              <p className="font-medium">{user.team_name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Manager</h3>
              <p className="font-medium">{user.manager_name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Employment Status</h3>
              <p className="font-medium">{user.employment_status || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Employment Type</h3>
              <p className="font-medium">{user.employment_type || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Job Level</h3>
              <p className="font-medium">{user.job_level || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Starting Date</h3>
              <p className="font-medium">
                {user.starting_date ? new Date(user.starting_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="text-gray-600">Probation End Date</h3>
              <p className="font-medium">
                {user.probation_end_date ? new Date(user.probation_end_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="text-gray-600">Contract End Date</h3>
              <p className="font-medium">
                {user.contract_end_date ? new Date(user.contract_end_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="text-gray-600">Last Promotion Date</h3>
              <p className="font-medium">
                {user.last_promotion_date ? new Date(user.last_promotion_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "personal" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-600">Mobile Number</h3>
              <p className="font-medium">{user.mobile_number || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Address</h3>
              <p className="font-medium">{user.address || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Emergency Contact Name</h3>
              <p className="font-medium">{user.emergency_contact_name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Emergency Contact Phone</h3>
              <p className="font-medium">{user.emergency_contact_phone || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Work Permit Status</h3>
              <p className="font-medium">{user.work_permit_status || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Work Permit Expiry</h3>
              <p className="font-medium">
                {user.work_permit_expiry ? new Date(user.work_permit_expiry).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-600">ID Document</h3>
              {user.id_document ? (
                <a href={user.id_document} target="_blank" rel="noopener noreferrer" 
                   className="text-indigo-600 hover:underline">
                  View ID Document
                </a>
              ) : (
                <p className="font-medium">No ID document uploaded</p>
              )}
            </div>
            <div>
              <h3 className="text-gray-600">Tax ID</h3>
              <p className="font-medium">{user.tax_id || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Health Insurance</h3>
              <p className="font-medium">{user.health_insurance_provider || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Button */}
      <div className="mt-6 text-right">
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"
        >
          Edit Profile
        </button>
      </div>

      <EditProfileForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={user}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default UserProfile;