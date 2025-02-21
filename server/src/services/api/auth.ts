import api from '.';
import { LoginForm, SignupForm } from '../../types/auth';

export const authService = {
  login: (data: LoginForm) => 
    api.post('/api/users/login', data),
  
  signup: (data: SignupForm) => 
    api.post('/api/users/signup', data),
    
  googleAuth: () => 
    api.get('/api/auth/google')
}; 