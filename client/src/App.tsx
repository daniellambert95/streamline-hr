import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './core/components/layout/Sidebar';
import Navbar from './core/components/layout/Navbar';
import { AuthProvider, useAuth } from './domains/auth/context/AuthContext';
import { SidebarProvider, useSidebar } from './core/context/SidebarContext';
import { ProtectedRoute } from './domains/auth/ProtectedRoute';
import Home from './pages/public/Home';
import Dashboard from './pages/private/Dashboard';
import UserProfile from './pages/private/UserProfile';
import Recruitment from './pages/private/Recruitment';
import JobManagement from "./pages/private/JobManagement";
import TalentPool from "./pages/private/TalentPool";
import TalentInsights from "./pages/private/TalentInsights";
import Pricing from './pages/public/Pricing';
import Applicants from './pages/private/Applicants';
import About from './pages/public/About';
import Signup from './pages/public/Signup';
import Login from './pages/public/Login';
import Reviews from './pages/public/Reviews';
import Features from './pages/public/Features';
import Docs from './pages/public/Docs';
import NotFound from './pages/public/NotFound';
import EmployeeManagement from './pages/private/employee-management/EmployeeManagement';
import EmployeeProfile from './pages/private/employee-profile/EmployeeProfile';
import EditEmployee from './pages/private/employee-edit/EditEmployee';
import { Toaster } from 'react-hot-toast';
import PayrollManagement from './pages/private/Payroll';
import PerformanceReviews from './pages/private/Performance';
// import CareerJobDetails from './pages/public/CareerJobDetails';
// import CareersPage from './pages/public/CareersPage';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();
  
  // Define private/protected routes (routes that should show sidebar instead of navbar)
  const privateRoutes = ['/dashboard', '/profile', '/recruitment', '/job-management', '/talent-pool', '/talent-insights', '/applicants', '/employee-management', '/employee-profile', '/payroll', '/performance'];
  const isPrivateRoute = isAuthenticated && privateRoutes.some(route => location.pathname.startsWith(route));
  const showNavbar = !isPrivateRoute;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for authenticated users */}
      {isAuthenticated && <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />}

      {/* Main Content Area */}
      <div
        className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ${
          isAuthenticated ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') : ''
        }`}
      >
        {/* Navbar for public routes */}
        {showNavbar && <Navbar />}

        {/* Page Content */}
        <main className={isAuthenticated ? '' : ''}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/features" element={<Features />} />
            <Route path="/docs" element={<Docs />} />
            {/* <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} /> */}
            <Route path="/pricing" element={<Pricing />} />

             {/* Company-specific career pages */}
            {/* <Route path="/:companyName/careers" element={<CareersPage />} />
            <Route path="/:companyName/careers/:jobId/:jobSlug" element={<CareerJobDetails />} /> */}

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
            
            <Route path="/recruitment" element={
              <ProtectedRoute>
                <Recruitment />
              </ProtectedRoute>
            } />

            <Route path="/job-management" element={
              <ProtectedRoute>
                <JobManagement />
              </ProtectedRoute>
            } />

            <Route path="/talent-pool" element={
              <ProtectedRoute>
                <TalentPool />
              </ProtectedRoute>
            } />

            <Route path="/talent-insights" element={
              <ProtectedRoute>
                <TalentInsights />
              </ProtectedRoute>
            } />

            <Route path="/applicants" element={
              <ProtectedRoute>
                <Applicants />
              </ProtectedRoute>
            } />

            <Route path="/employee-management" element={
              <ProtectedRoute>
                <EmployeeManagement />
              </ProtectedRoute>
            } />

            <Route path="/employee-profile/:id" element={
              <ProtectedRoute>
                <EmployeeProfile />
              </ProtectedRoute>
            } />

            <Route path="/employee-management/edit/:id" element={
              <ProtectedRoute>
                <EditEmployee />
              </ProtectedRoute>
            } />

            <Route path="/payroll" element={
              <ProtectedRoute>
                <PayrollManagement />
              </ProtectedRoute>
            } />

            <Route path="/performance" element={
              <ProtectedRoute>
                <PerformanceReviews />
              </ProtectedRoute>
            } />

            {/* 404 Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <AppContent />
          <Toaster position="top-right" />
        </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;