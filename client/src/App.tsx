import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
// import AuthNavbar from './components/AuthNavBar';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Listings from './pages/Listings';
import Pricing from './pages/Pricing';
import Applicants from './pages/Applicants';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Employees from './pages/Employees';
import AnalyticsPage from './pages/Analytics';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex">
      {/* Sidebar for authenticated users */}
      {isAuthenticated && <Sidebar />}

      {/* Main Content Area */}
      <div
        className={`flex-grow ${
          isAuthenticated ? 'ml-64' : ''
        } p-6 bg-gray-100 min-h-screen`}
      >
        {/* Navbar for unauthenticated users */}
        {!isAuthenticated && <Navbar />}

        {/* Page Content */}
        <main className={isAuthenticated ? 'pt-6' : 'pt-16'}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/applicants/:jobId" element={<Applicants />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;