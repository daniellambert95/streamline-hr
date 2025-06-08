import api from '../../../core/api/apiClient';
import { JobListing } from '../types/job';
import { Applicant } from '../types/applicant';

export const jobService = {
  getAll: () => 
    api.get<JobListing[]>('/api/v1/recruitment/jobs'),
    
  create: (data: Partial<JobListing>) => 
    api.post<JobListing>('/api/v1/recruitment/jobs', data),
    
  update: (id: number, data: Partial<JobListing>) => 
    api.put<JobListing>(`/api/v1/recruitment/jobs/${id}`, data),
    
  delete: (id: number) => 
    api.delete<void>(`/api/v1/recruitment/jobs/${id}`),
  
  // Add the missing updateStatus method
  updateStatus: (id: string, status: string) =>
    api.patch<JobListing>(`/api/v1/recruitment/jobs/${id}/status`, { status }),
  
  // Get all public jobs
  getPublicJobs: () => {
    return api.get<JobListing[]>('/api/public/jobs');
  },
  
  // Get a specific public job by ID
  getPublicJobById: (jobId: string) => {
    return api.get<JobListing>(`/api/public/jobs/${jobId}`);
  },
  
  // Get a company-specific public job
  getCompanyPublicJobById: (companyName: string, jobId: string) => {
    return api.get<JobListing>(`/api/public/${companyName}/jobs/${jobId}`);
  },
  
  // Submit a job application
  submitApplication: (formData: FormData) => {
    return api.post('/api/public/job-applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
}; 

export const applicantService = {
  getAll: () =>
    api.get<Applicant[]>('/api/v1/recruitment/applicants'),
    
  // Add the submitApplication method to applicantService
  submitApplication: (formData: FormData) => {
    return api.post('/api/public/job-applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
