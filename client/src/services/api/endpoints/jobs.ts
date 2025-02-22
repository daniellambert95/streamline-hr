import api from '../index';
import { JobListing } from '../../../types/job';

export const jobService = {
  getAll: () => 
    api.get<JobListing[]>('/api/v1/jobs'),
    
  create: (data: Partial<JobListing>) => 
    api.post<JobListing>('/api/v1/jobs', data),
    
  update: (id: number, data: Partial<JobListing>) => 
    api.put<JobListing>(`/api/v1/jobs/${id}`, data),
    
  delete: (id: number) => 
    api.delete<void>(`/api/v1/jobs/${id}`)
}; 