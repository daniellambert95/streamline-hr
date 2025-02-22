import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { AuthUser } from "../../types/user";
import api from "../../services/api";

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
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    job_title: "",
    mobile_number: "",
    job_level: "",
    team_name: "",
    salary: "",
    leave_balance: "",
    starting_date: "",
  });

  useEffect(() => {
    if (userData) {
      setForm({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        job_title: userData.job_title || "",
        mobile_number: userData.mobile_number || "",
        job_level: userData.job_level || "",
        team_name: userData.team_name || "",
        salary: userData.salary?.toString() || "",
        leave_balance: userData.leave_balance?.toString() || "",
        starting_date: userData.starting_date ? new Date(userData.starting_date).toISOString().split('T')[0] : "",
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      console.error('User ID is undefined');
      toast.error('User ID is missing');
      return;
    }

    try {
      const { data } = await api.put(`/api/v1/employees/${user.id}`, form);
      const token = localStorage.getItem('token');
      if (token) {
        login(token, data);
      }
      onClose();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="text"
                name="mobile_number"
                value={form.mobile_number}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                name="job_title"
                value={form.job_title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Level</label>
              <input
                type="text"
                name="job_level"
                value={form.job_level}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Salary</label>
              <input
                type="text"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Leave Balance</label>
              <input
                type="number"
                name="leave_balance"
                value={form.leave_balance}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Starting Date</label>
            <input
              type="date"
              name="starting_date"
              value={form.starting_date}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
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

export default EditProfileModal; 