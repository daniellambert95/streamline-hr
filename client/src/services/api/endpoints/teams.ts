import api from '../index';
import { Team } from '../../../types/team';

// Fix this file so that it follows the first two functions in teamService I think we should use the Team tyope

export const teamService = {
  getAll: () => 
    api.get<Team[]>('/api/teams'),
    
  getById: (id: number) => 
    api.get<Team>(`/api/teams/${id}`),
    
  create: (data: Partial<Team>) => 
    api.post<Team>('/api/teams', data),
    
  update: (id: number, data: Partial<Team>) => 
    api.put<Team>(`/api/teams/${id}`, data),
    
  delete: (id: number) => 
    api.delete<void>(`/api/teams/${id}`)
};
