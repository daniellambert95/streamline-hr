import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './core/components/layout/Sidebar';
import Navbar from './core/components/layout/Navbar';
import { AuthProvider, useAuth } from './domains/auth/context/AuthContext';
import { ProtectedRoute } from './domains/auth/ProtectedRoute';
import Home from './pages/public/Home';
import Dashboard from './pages/private/Dashboard';
import UserProfile from './pages/private/UserProfile';
import TalentInsights from './pages/private/TalentInsights';
import Pricing from './pages/public/Pricing';
import Applicants from './pages/private/Applicants';
import Signup from './pages/public/Signup';
import Login from './pages/public/Login';
import EmployeeManagement from './pages/private/EmployeeManagement';
import { Toaster } from 'react-hot-toast';
import PayrollManagement from './pages/private/Payroll';
import PerformanceReviews from './pages/private/Performance';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Define public routes
  const publicRoutes = ['/', '/login', '/signup', '/pricing'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  return (
    <div className="flex">
      {/* Sidebar for authenticated users */}
      {isAuthenticated && <Sidebar />}

      {/* Main Content Area */}
      <div
        className={`flex-grow ${isAuthenticated ? 'ml-64' : ''} p-6 bg-gray-100 min-h-screen`}
      >
        {/* Navbar for public routes */}
        {isPublicRoute && <Navbar />}

        {/* Page Content */}
        <main className={isPublicRoute ? 'pt-16' : 'pt-6'}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />

            <Route path="/talent-insights" element={
              <ProtectedRoute allowedRoles={['admin', 'recruiter']}>
                <TalentInsights />
              </ProtectedRoute>
            } />

            <Route path="/applicants/:jobId" element={
              <ProtectedRoute allowedRoles={['admin', 'recruiter']}>
                <Applicants />
              </ProtectedRoute>
            } />

            <Route 
              path="/employee-management" 
              element={
                <ProtectedRoute>
                  <EmployeeManagement />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/payroll" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <PayrollManagement />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/performance" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <PerformanceReviews />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;