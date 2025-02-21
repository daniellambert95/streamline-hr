import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Streamline-hr_logo.png';

function AuthNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsAuthenticated } = useAuth(); // Access AuthContext
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    setIsAuthenticated(false); // Update auth state
    window.dispatchEvent(new Event("storage")); // Force storage event to trigger updates across the app
    navigate('/');
  };

  return (
    <nav className="bg-indigo-600 shadow-md fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 lg:h-24">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img className="h-20 w-auto" src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/profile" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
              Profile
            </Link>
            <Link to="talent-insights" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
              Talent Insights
            </Link>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={toggleMenu} type="button" className="text-white hover:text-gray-200 focus:outline-none">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/profile" className="text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium">
              Profile
            </Link>
            <Link to="talent-insights" className="text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium">
              Talent Insights
            </Link>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default AuthNavbar;