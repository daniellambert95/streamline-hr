import api from '../index';
import { JobListing } from '../../../types/job';

export const jobService = {
  getAll: () => 
    api.get<JobListing[]>('/api/jobs'),
    
  create: (data: Partial<JobListing>) => 
    api.post<JobListing>('/api/jobs', data),
    
  update: (id: number, data: Partial<JobListing>) => 
    api.put<JobListing>(`/api/jobs/${id}`, data),
    
  delete: (id: number) => 
    api.delete<void>(`/api/jobs/${id}`)
}; 