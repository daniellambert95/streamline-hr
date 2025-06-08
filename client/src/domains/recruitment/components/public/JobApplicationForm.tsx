import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { applicantService } from '../../services/recruitment';
import handleApiError from '../../../../core/utils/handleApiError';
import FileUpload from '../../../../core/components/common/FileUpload';

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  onSuccess: () => void;
}

interface ApplicationFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cover_letter: string;
  linkedin_url?: string;
  portfolio_url?: string;
  referral_source?: string;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ jobId, jobTitle, onSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ApplicationFormData>();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

  const onSubmit = async (data: ApplicationFormData) => {
    if (!resumeFile) {
      setResumeError('Please upload your resume');
      return;
    }

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('job_id', jobId);
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('cover_letter', data.cover_letter);
      formData.append('resume', resumeFile);
      
      if (data.linkedin_url) formData.append('linkedin_url', data.linkedin_url);
      if (data.portfolio_url) formData.append('portfolio_url', data.portfolio_url);
      if (data.referral_source) formData.append('referral_source', data.referral_source);

      // Submit application
      await applicantService.submitApplication(formData);
      
      // Show success message
      toast.success('Your application has been submitted successfully!');
      
      // Call success callback
      onSuccess();
    } catch (error) {
      handleApiError(error);
      toast.error('There was an error submitting your application. Please try again.');
    }
  };

  const handleFileChange = (file: File | null) => {
    setResumeFile(file);
    setResumeError(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              You are applying for <strong>{jobTitle}</strong>. Please fill out the form below to submit your application.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="first_name"
            type="text"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.first_name ? 'border-red-300' : ''}`}
            {...register('first_name', { required: 'First name is required' })}
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            id="last_name"
            type="text"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.last_name ? 'border-red-300' : ''}`}
            {...register('last_name', { required: 'Last name is required' })}
          />
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.email ? 'border-red-300' : ''}`}
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.phone ? 'border-red-300' : ''}`}
            {...register('phone', { required: 'Phone number is required' })}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* LinkedIn URL */}
      <div>
        <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
          LinkedIn Profile URL
        </label>
        <input
          id="linkedin_url"
          type="url"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="https://linkedin.com/in/yourprofile"
          {...register('linkedin_url')}
        />
      </div>

      {/* Portfolio URL */}
      <div>
        <label htmlFor="portfolio_url" className="block text-sm font-medium text-gray-700">
          Portfolio/Website URL
        </label>
        <input
          id="portfolio_url"
          type="url"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="https://yourportfolio.com"
          {...register('portfolio_url')}
        />
      </div>

      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Resume <span className="text-red-500">*</span>
        </label>
        <div className="mt-1">
          <FileUpload
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            maxSize={5}
            label="Upload your resume (PDF, DOC, DOCX up to 5MB)"
          />
          {resumeError && (
            <p className="mt-1 text-sm text-red-600">{resumeError}</p>
          )}
        </div>
      </div>

      {/* Cover Letter */}
      <div>
        <label htmlFor="cover_letter" className="block text-sm font-medium text-gray-700">
          Cover Letter <span className="text-red-500">*</span>
        </label>
        <textarea
          id="cover_letter"
          rows={5}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.cover_letter ? 'border-red-300' : ''}`}
          placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
          {...register('cover_letter', { required: 'Cover letter is required' })}
        ></textarea>
        {errors.cover_letter && (
          <p className="mt-1 text-sm text-red-600">{errors.cover_letter.message}</p>
        )}
      </div>

      {/* Referral Source */}
      <div>
        <label htmlFor="referral_source" className="block text-sm font-medium text-gray-700">
          How did you hear about this position?
        </label>
        <select
          id="referral_source"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          {...register('referral_source')}
        >
          <option value="">Select an option</option>
          <option value="company_website">Company Website</option>
          <option value="linkedin">LinkedIn</option>
          <option value="indeed">Indeed</option>
          <option value="glassdoor">Glassdoor</option>
          <option value="referral">Employee Referral</option>
          <option value="job_board">Other Job Board</option>
          <option value="social_media">Social Media</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </form>
  );
};

export default JobApplicationForm; 