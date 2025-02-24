import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { AuthUser } from "../../types/user";
import { profileService } from "../../services/api/endpoints/profile";
import { departmentService } from "../../services/api/endpoints/departments";
import { teamService } from "../../services/api/endpoints/teams";
import { Department } from "../../types/department";
import { Team } from "../../types/team";
import handleApiError from "../../utils/handleApiError";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: AuthUser;
  onUpdate: (updatedData: AuthUser) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userData,
  onUpdate,
}) => {
  const { user, login } = useAuth();
  const [form, setForm] = useState<Partial<AuthUser>>({
    // Basic Info
    first_name: "",
    last_name: "",
    email: "",
    personal_email: "",
    date_of_birth: "",
    gender: "prefer_not_to_say",
    marital_status: "single",
    
    // Job Info
    job_title: "",
    job_level: "",
    department: "",
    team_name: "",
    manager_name: "",
    employment_status: "",
    employment_type: "",
    starting_date: new Date(),
    probation_end_date: "",
    contract_end_date: "",
    last_promotion_date: "",
    
    // Contact Info
    mobile_number: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    
    // Work Details
    salary: "",
    leave_balance: 0,
    work_permit_status: "",
    work_permit_expiry: "",
    health_insurance_provider: "",
    tax_id: "",
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [isAddingNewDepartment, setIsAddingNewDepartment] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');

  const [isAddingNewTeam, setIsAddingNewTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  // Fetch both departments and teams on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptResponse, teamResponse] = await Promise.all([
          departmentService.getAll(),
          teamService.getAll()
        ]);
        setDepartments(deptResponse.data);
        setTeams(teamResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userData) {
      setForm({
        ...userData,
        starting_date: userData.starting_date ? new Date(userData.starting_date) : undefined,
        probation_end_date: userData.probation_end_date || undefined,
        contract_end_date: userData.contract_end_date || undefined,
        last_promotion_date: userData.last_promotion_date || undefined,
        work_permit_expiry: userData.work_permit_expiry || undefined,
        gender: userData.gender || undefined,
        marital_status: userData.marital_status || undefined,
        leave_balance: userData.leave_balance ?? undefined,
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get token first
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Check if user exists before updating
      if (!user) {
        throw new Error('No user found');
      }

      const formattedData = {
        ...form,
        leave_balance: form.leave_balance ? Number(form.leave_balance) : undefined,
      };

      // Check if user exists before updating
      if (!user) {
        throw new Error('No user found');
      }

      const { data } = await profileService.update(user.id, formattedData);
      
      // Update the context with new user data
      login(token, data);
      onUpdate(data);
      onClose();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCreateNewDepartment = async () => {
    if (!newDepartmentName.trim()) {
      toast.error('Please enter a department name');
      return;
    }

    try {
      const { data } = await departmentService.create({ name: newDepartmentName });
      setDepartments(prev => [...prev, data]);
      setForm(prev => ({ ...prev, department: data.name }));
      setNewDepartmentName('');
      setIsAddingNewDepartment(false);
      toast.success('Department created successfully');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCreateNewTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    try {
      const { data } = await teamService.create({ name: newTeamName });
      setTeams(prev => [...prev, data]);
      setForm(prev => ({ ...prev, team_name: data.name }));
      setNewTeamName('');
      setIsAddingNewTeam(false);
      toast.success('Team created successfully');
    } catch (error) {
      handleApiError(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="First Name" name="first_name" value={form.first_name || ""} onChange={handleChange} />
              <InputField label="Last Name" name="last_name" value={form.last_name || ""} onChange={handleChange} />
              <InputField label="Email" name="email" type="email" value={form.email || ""} onChange={handleChange} />
              <InputField label="Personal Email" name="personal_email" type="email" value={form.personal_email || ""} onChange={handleChange} />
              <InputField label="Date of Birth" name="date_of_birth" type="date" value={form.date_of_birth || ""} onChange={handleChange} />
              <SelectField 
                label="Gender" 
                name="gender" 
                value={form.gender || ""} 
                onChange={handleChange}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                  { value: 'prefer_not_to_say', label: 'Prefer not to say' }
                ]}
              />
            </div>
          </div>

          {/* Employment Information Section */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4">Employment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Job Title" name="job_title" value={form.job_title || ""} onChange={handleChange} />
              <InputField label="Job Level" name="job_level" value={form.job_level || ""} onChange={handleChange} />
              <div>
                <label className="block text-sm font-medium text-gray-600">Department</label>
                <select
                  name="department"
                  value={form.department || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>

                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewDepartment(!isAddingNewDepartment)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    {isAddingNewDepartment ? 'Cancel' : 'Add New Department'}
                  </button>
                  
                  {isAddingNewDepartment && (
                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        value={newDepartmentName}
                        onChange={(e) => setNewDepartmentName(e.target.value)}
                        placeholder="Enter new department name"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleCreateNewDepartment}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Create Department
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Team</label>
                <select
                  name="team_name"
                  value={form.team_name || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.name}>{team.name}</option>
                  ))}
                </select>

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
              </div>
              <InputField label="Starting Date" name="starting_date" type="date" value={form.starting_date?.toISOString().split('T')[0] || ""} onChange={handleChange} />
              <InputField label="Probation End Date" name="probation_end_date" type="date" value={form.probation_end_date || ""} onChange={handleChange} />
              <InputField label="Contract End Date" name="contract_end_date" type="date" value={form.contract_end_date || ""} onChange={handleChange} />
              <InputField label="Last Promotion Date" name="last_promotion_date" type="date" value={form.last_promotion_date || ""} onChange={handleChange} />
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Mobile Number" name="mobile_number" value={form.mobile_number || ""} onChange={handleChange} />
              <InputField label="Address" name="address" value={form.address || ""} onChange={handleChange} />
              <InputField label="Emergency Contact Name" name="emergency_contact_name" value={form.emergency_contact_name || ""} onChange={handleChange} />
              <InputField label="Emergency Contact Phone" name="emergency_contact_phone" value={form.emergency_contact_phone || ""} onChange={handleChange} />
            </div>
          </div>

          {/* Work Details Section */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4">Work Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Salary" name="salary" value={form.salary || ""} onChange={handleChange} />
              <InputField 
                label="Leave Balance" 
                name="leave_balance" 
                type="number" 
                value={form.leave_balance?.toString() ?? ''}
                onChange={handleChange} 
              />
              <InputField label="Work Permit Status" name="work_permit_status" value={form.work_permit_status || ""} onChange={handleChange} />
              <InputField label="Work Permit Expiry" name="work_permit_expiry" type="date" value={form.work_permit_expiry || ""} onChange={handleChange} />
              <InputField label="Health Insurance Provider" name="health_insurance_provider" value={form.health_insurance_provider || ""} onChange={handleChange} />
              <InputField label="Tax ID" name="tax_id" value={form.tax_id || ""} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
    />
  </div>
);

const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
    >
      <option value="">Select {label}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default EditProfileModal; 