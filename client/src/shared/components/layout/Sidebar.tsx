import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../domains/auth/context/AuthContext';
import { FaHome, FaUsers, FaBriefcase, FaUsersCog, FaBell, FaFileAlt, FaComments, FaSignOutAlt } from 'react-icons/fa';

const AuthSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen w-64 bg-indigo-600 text-white flex flex-col fixed">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 border-b border-indigo-500">
        <h1 className="text-xl font-bold text-white">Streamline HR</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow mt-4">
        <ul>
          <li className="px-6 py-4 hover:bg-indigo-500 flex items-center">
            <FaHome className="mr-3" />
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="px-6 py-4 hover:bg-indigo-500 flex items-center">
            <FaUsers className="mr-3" />
            <Link to="/employee-management">Employee Management</Link>
          </li>
          <li className="px-6 py-4 hover:bg-indigo-500 flex items-center">
            <FaBriefcase className="mr-3" />
            <Link to="/talent-insights">Talent Insights</Link>
          </li>
          <li className="px-6 py-4 hover:bg-indigo-500 flex items-center">
            <FaBell className="mr-3" />
            <Link to="/notifications">Notifications</Link>
          </li>
          <li className="px-6 py-4 hover:bg-indigo-500 flex items-center">
            <FaFileAlt className="mr-3" />
            <Link to="/templates">Templates</Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <li className="px-6 py-4 hover:bg-indigo-500 flex items-center">
            <FaComments className="mr-3" />
            <Link to="/support">Support</Link>
        </li>
        <li className="px-6 py-4 hover:bg-indigo-500 flex items-center">
            <FaUsersCog className="mr-3" />
            <Link to="/settings">Settings</Link>
        </li>
        <button
          onClick={handleLogout}
          className="w-full text-left px-6 py-4 hover:bg-indigo-500 flex items-center"
        >
          <FaSignOutAlt className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AuthSidebar;