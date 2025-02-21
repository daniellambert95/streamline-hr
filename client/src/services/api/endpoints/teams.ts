import api from '../index';
import { Team } from '../../../types/team';

export const teamService = {
  getAll: () => 
    api.get<Team[]>('/api/teams'),
    
  create: (name: string) => 
    api.post('/api/teams', { name }),
    
};
