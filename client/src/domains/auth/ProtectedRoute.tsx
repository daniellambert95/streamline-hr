import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { UserRole } from '../users/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !hasPermission(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}; 