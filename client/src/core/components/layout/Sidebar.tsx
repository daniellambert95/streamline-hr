import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../domains/auth/context/AuthContext';
import { FaHome, FaUsers, FaBriefcase, FaUsersCog, FaFileAlt, FaComments, FaSignOutAlt, FaDollarSign, FaChartLine, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`h-screen ${isCollapsed ? 'w-16' : 'w-64'} bg-indigo-600 text-white flex flex-col fixed transition-all duration-300`}>
      {/* Logo */}
      <div className="flex items-center justify-center h-20 border-b border-indigo-500">
        {isCollapsed ? (
          <h1 className="text-xl font-bold text-white">SHR</h1>
        ) : (
          <h1 className="text-xl font-bold text-white">Streamline HR</h1>
        )}
      </div>

      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute top-5 right-0 transform translate-x-1/2 bg-indigo-500 rounded-full p-1 text-white hover:bg-indigo-400 z-10"
      >
        {isCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
      </button>

      {/* Navigation Links */}
      <nav className="flex-grow mt-4">
        <ul>
          <li className={`px-6 py-4 hover:bg-indigo-500 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <Link to="/dashboard" className="flex items-center">
              <FaHome className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li className={`px-6 py-4 hover:bg-indigo-500 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <Link to="/employee-management" className="flex items-center">
              <FaUsers className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Employee Management</span>}
            </Link>
          </li>
          <li className={`px-6 py-4 hover:bg-indigo-500 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <Link to="/talent-insights" className="flex items-center">
              <FaBriefcase className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Talent Insights</span>}
            </Link>
          </li>
          <li className={`px-6 py-4 hover:bg-indigo-500 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <Link to="/templates" className="flex items-center">
              <FaFileAlt className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Templates</span>}
            </Link>
          </li>
          <li className={`px-6 py-4 hover:bg-indigo-500 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <Link to="/payroll" className="flex items-center">
              <FaDollarSign className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Payroll</span>}
            </Link>
          </li>
          <li className={`px-6 py-4 hover:bg-indigo-500 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <Link to="/performance" className="flex items-center">
              <FaChartLine className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Performance</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <li className={`px-6 py-4 hover:bg-indigo-500 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          <Link to="/support" className="flex items-center">
            <FaComments className={isCollapsed ? '' : 'mr-3'} />
            {!isCollapsed && <span>Support</span>}
          </Link>
        </li>
        <li className={`px-6 py-4 hover:bg-indigo-500 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          <Link to="/settings" className="flex items-center">
            <FaUsersCog className={isCollapsed ? '' : 'mr-3'} />
            {!isCollapsed && <span>Settings</span>}
          </Link>
        </li>
        <button
          onClick={handleLogout}
          className={`w-full text-left px-6 py-4 hover:bg-indigo-500 flex items-center ${isCollapsed ? 'justify-center' : ''}`}
        >
          <FaSignOutAlt className={isCollapsed ? '' : 'mr-3'} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;