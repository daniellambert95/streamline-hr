import api from '../../../core/api/apiClient';
import { LoginForm, SignupForm } from '../types/auth';

export const authService = {
  login: (data: LoginForm) => 
    api.post('/api/v1/auth/login', data),
  
  signup: (data: SignupForm) => 
    api.post('/api/v1/auth/signup', data),
    
  googleAuth: () => 
    api.get('/api/v1/auth/google')
}; 
