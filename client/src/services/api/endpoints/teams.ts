import api from '../index';
import { Team } from '../../../types/team';

// Fix this file so that it follows the first two functions in teamService I think we should use the Team tyope

export const teamService = {
  getAll: () => 
    api.get<Team[]>('/api/v1/teams'),
    
  getById: (id: number) => 
    api.get<Team>(`/api/v1/teams/${id}`),
    
  create: (data: Partial<Team>) => 
    api.post<Team>('/api/v1/teams', data),
    
  update: (id: number, data: Partial<Team>) => 
    api.put<Team>(`/api/v1/teams/${id}`, data),
    
  delete: (id: number) => 
    api.delete<void>(`/api/v1/teams/${id}`)
};
