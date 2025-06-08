import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { JobListing } from '../types/job';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface JobViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobListing;
  onStatusChange: (status: string) => Promise<void>;
}

const JobViewModal: React.FC<JobViewModalProps> = ({ isOpen, onClose, job, onStatusChange }) => {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  
  // Define status options based on the database schema
  const statusOptions = [
    'open', 
    'closed', 
    '1st round', 
    '2nd round', 
    '3rd round', 
    'offer sent', 
    'pending approval'
  ];

  if (!job) return null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case '1st round':
      case '2nd round':
      case '3rd round': return 'bg-blue-100 text-blue-800';
      case 'offer sent': return 'bg-purple-100 text-purple-800';
      case 'pending approval': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start">
            <Dialog.Title className="text-2xl font-bold text-gray-900">
              {job.title}
            </Dialog.Title>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mt-2 flex items-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
            
            <button 
              onClick={() => setIsChangingStatus(!isChangingStatus)}
              className="ml-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              Change
            </button>
          </div>
          
          {/* Status Change Dropdown */}
          {isChangingStatus && (
            <div className="mt-2">
              <select 
                value={job.status}
                onChange={(e) => {
                  onStatusChange(e.target.value);
                  setIsChangingStatus(false);
                }}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Job Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Job Details</h3>
              <div className="mt-2 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="mt-1 text-sm text-gray-900">{job.location || 'Remote'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="mt-1 text-sm text-gray-900">{job.type || 'Full-time'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Salary</p>
                  <p className="mt-1 text-sm text-gray-900">{job.salary || 'Competitive'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Hours</p>
                  <p className="mt-1 text-sm text-gray-900">{job.hours || 'Standard (40h/week)'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Industry</p>
                  <p className="mt-1 text-sm text-gray-900">{job.industry || 'Technology'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Dates</h3>
              <div className="mt-2 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Posted</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(job.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <div className="mt-2 prose prose-indigo max-w-none">
              <div dangerouslySetInnerHTML={{ __html: job.description || 'No description provided.' }} />
            </div>
          </div>

          {/* Responsibilities */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">Responsibilities</h3>
            <div className="mt-2 prose prose-indigo max-w-none">
              <div dangerouslySetInnerHTML={{ __html: job.responsibilities || 'No specific responsibilities listed.' }} />
            </div>
          </div>

          {/* Requirements */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">Requirements</h3>
            <div className="mt-2 prose prose-indigo max-w-none">
              <div dangerouslySetInnerHTML={{ __html: job.qualifications || 'No specific requirements listed.' }} />
            </div>
          </div>

          {/* Benefits */}
          {job.benefits && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Benefits</h3>
              <div className="mt-2 prose prose-indigo max-w-none">
                <div dangerouslySetInnerHTML={{ __html: job.benefits }} />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-between">
            <div>
              <button
                onClick={() => window.location.href = `/applicants?job_id=${job.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View All Applicants
              </button>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.href = `/job/edit/${job.id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Job
              </button>
              
              {job.status === 'open' ? (
                <button
                  onClick={() => onStatusChange('closed')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Close Job
                </button>
              ) : (
                <button
                  onClick={() => onStatusChange('open')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Reopen Job
                </button>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default JobViewModal; 