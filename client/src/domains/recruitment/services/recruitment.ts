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
    api.delete<void>(`/api/v1/recruitment/jobs/${id}`)
}; 

export const applicantService = {
  getAll: () =>
    api.get<Applicant[]>('/api/v1/recruitment/applicants'),
    
    
};
