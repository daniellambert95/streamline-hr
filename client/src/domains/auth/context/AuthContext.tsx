import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { UserRole, AuthUser } from '../../users/types/user';
import { AuthContextType } from '../types/auth';
import { profileService } from '../../users/services/profile';
import api from '../../../core/api/apiClient';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  setUser: () => {},
  login: async () => {},
  logout: () => {},
  hasPermission: () => false,
  refreshProfile: async () => {}
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const login = async (token: string, basicUserData: AuthUser) => {
    try {
      // Store token first
      localStorage.setItem('token', token);
      
      // Set initial data
      setIsAuthenticated(true);
      setUser(basicUserData);
      
      // Fetch complete profile in one go
      const response = await api.get('/api/v1/dashboard/data');
      const completeProfile = response.data.user;
      
      // Update with complete data
      localStorage.setItem('user', JSON.stringify(completeProfile));
      setUser(completeProfile);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const hasPermission = (allowedRoles: UserRole[]) => {
    return user ? allowedRoles.includes(user.role) : false;
  };

  const refreshProfile = async () => {
    try {
      const data = await profileService.getFullProfile();
      if (data) {
        const token = localStorage.getItem('token');
        if (token) {
          // Preserve any existing user data that isn't included in the profile response
          setUser(prevUser => ({
            ...prevUser,
            ...data
          }));
          localStorage.setItem('user', JSON.stringify({
            ...user,
            ...data
          }));
        }
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        setIsAuthenticated(!!e.newValue);
      }
      if (e.key === 'user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasPermission, refreshProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};