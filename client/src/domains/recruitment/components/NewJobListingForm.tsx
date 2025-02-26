import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { jobService } from '../services/recruitment';
import handleApiError from '../../../shared/utils/handleApiError';

interface NewJobListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewJobListingModal: React.FC<NewJobListingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const initialFormState = {
    title: '',
    description: '',
    location: '',
    type: 'full-time' as const,
    salary: '',
    status: 'open' as const,
  };

  const [form, setForm] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await jobService.create(form);
      toast.success('Job listing created successfully!');
      setForm(initialFormState);
      onSuccess();
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  if (!isOpen) return null; // Don't render if modal is not open

  return (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
    <div 
      className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col m-4" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Fixed Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-700">Create New Job Listing</h2>
      </div>

      {/* Scrollable Form Area */}
      <div className="p-6 overflow-y-auto flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Existing form fields with consistent styling */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Job Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
            ></textarea>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Job Type
            </label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
            >
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
              Salary
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-6 border-t">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-2"
            >
              Create Job Listing
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

export default NewJobListingModal;