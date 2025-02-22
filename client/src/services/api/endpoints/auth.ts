import api from '../index';
import { LoginForm, SignupForm } from '../../../types/auth';

export const authService = {
  login: (data: LoginForm) => 
    api.post('/api/v1/users/login', data),
  
  signup: (data: SignupForm) => 
    api.post('/api/v1/users/signup', data),
    
  googleAuth: () => 
    api.get('/api/v1/auth/google')
}; 