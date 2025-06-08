import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../domains/auth/context/AuthContext';
import { FaHome, FaUsers, FaBriefcase, FaUsersCog, FaFileAlt, FaComments, FaSignOutAlt, FaDollarSign, FaChartLine, FaCaretDown, FaCaretUp, FaUserTie, FaLightbulb, FaBars } from 'react-icons/fa';
import { useState } from 'react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [recruitmentOpen, setRecruitmentOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleRecruitmentDropdown = () => {
    setRecruitmentOpen(!recruitmentOpen);
  };

  return (
    <div className={`h-screen ${isCollapsed ? 'w-16' : 'w-64'} bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl transition-all duration-300 fixed z-30 flex flex-col`}>
      {/* Header with Logo */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200/50">
        {isCollapsed ? (
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 bg-gradient-to-r from-white to-primary-100 rounded-xl flex items-center justify-center mx-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            title="Expand sidebar"
          >
            <img src="/streamline_icon.svg" alt="StreamlineHR Logo" className="w-6 h-6" />
          </button>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-white to-primary-100 rounded-xl flex items-center justify-center shadow-lg">
              <img src="/streamline_icon.svg" alt="StreamlineHR Logo" className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-indigo-600">StreamlineHR</h1>
            </div>
          </div>
        )}
        
        {/* Hamburger Toggle Button - Only show when not collapsed */}
        {!isCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300"
            title="Collapse sidebar"
          >
            <FaBars size={16} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/dashboard" 
              className={`group flex items-center ${isCollapsed ? 'px-2 py-4 justify-center' : 'px-3 py-3'} rounded-xl transition-all duration-300 hover:bg-indigo-50 hover:shadow-sm`}
            >
              <div className={`${isCollapsed ? 'w-10 h-10' : 'w-8 h-8'}  rounded-lg flex items-center justify-center transition-all duration-300`}>
                <FaHome className={`text-indigo-600 ${isCollapsed ? 'text-lg' : 'text-sm'} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              {!isCollapsed && <span className="ml-3 font-medium text-gray-700 group-hover:text-indigo-700">Dashboard</span>}
            </Link>
          </li>
          
          <li>
            <Link 
              to="/employee-management" 
              className={`group flex items-center ${isCollapsed ? 'px-2 py-4 justify-center' : 'px-3 py-3'} rounded-xl transition-all duration-300 hover:bg-indigo-50 hover:shadow-sm`}
            >
              <div className={`${isCollapsed ? 'w-10 h-10' : 'w-8 h-8'}  rounded-lg flex items-center justify-center transition-all duration-300`}>
                <FaUsers className={`text-indigo-600 ${isCollapsed ? 'text-lg' : 'text-sm'} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              {!isCollapsed && <span className="ml-3 font-medium text-gray-700 group-hover:text-indigo-700">Employee Management</span>}
            </Link>
          </li>
          
          {/* Recruitment Dropdown */}
          <li className="relative">
            <div 
              className={`group flex items-center ${isCollapsed ? 'px-2 py-4 justify-center' : 'px-3 py-3 justify-between'} rounded-xl transition-all duration-300 hover:bg-indigo-50 hover:shadow-sm cursor-pointer`}
              onClick={isCollapsed ? () => navigate('/recruitment') : toggleRecruitmentDropdown}
            >
              <div className="flex items-center">
                <div className={`${isCollapsed ? 'w-10 h-10' : 'w-8 h-8'}  rounded-lg flex items-center justify-center transition-all duration-300`}>
                  <FaBriefcase className={`text-indigo-600 ${isCollapsed ? 'text-lg' : 'text-sm'} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                {!isCollapsed && <span className="ml-3 font-medium text-gray-700 group-hover:text-indigo-700">Recruitment</span>}
              </div>
              {!isCollapsed && (
                <div className="transition-transform duration-300 text-gray-400">
                  {recruitmentOpen ? <FaCaretUp size={14} /> : <FaCaretDown size={14} />}
                </div>
              )}
            </div>
            
            {/* Dropdown Menu */}
            {!isCollapsed && recruitmentOpen && (
              <ul className="mt-2 ml-4 space-y-1 border-l border-gray-200 pl-4">
                <li>
                  <Link 
                    to="/recruitment" 
                    className="flex items-center px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-50 group"
                  >
                    <div className="w-6 h-6 bg-indigo-50 rounded flex items-center justify-center group-hover: transition-all duration-300">
                      <FaBriefcase size={12} className="text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-600 group-hover:text-indigo-600">Talent Acquisition</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/job-management" 
                    className="flex items-center px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-50 group"
                  >
                    <div className="w-6 h-6 bg-indigo-50 rounded flex items-center justify-center group-hover: transition-all duration-300">
                      <FaFileAlt size={12} className="text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-600 group-hover:text-indigo-600">Job Management</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/talent-pool" 
                    className="flex items-center px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-50 group"
                  >
                    <div className="w-6 h-6 bg-indigo-50 rounded flex items-center justify-center group-hover: transition-all duration-300">
                      <FaUserTie size={12} className="text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-600 group-hover:text-indigo-600">Talent Pool</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/talent-insights" 
                    className="flex items-center px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-50 group"
                  >
                    <div className="w-6 h-6 bg-indigo-50 rounded flex items-center justify-center group-hover: transition-all duration-300">
                      <FaLightbulb size={12} className="text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-600 group-hover:text-indigo-600">Talent Insights</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
          
          <li>
            <Link 
              to="/templates" 
              className={`group flex items-center ${isCollapsed ? 'px-2 py-4 justify-center' : 'px-3 py-3'} rounded-xl transition-all duration-300 hover:bg-indigo-50 hover:shadow-sm`}
            >
              <div className={`${isCollapsed ? 'w-10 h-10' : 'w-8 h-8'}  rounded-lg flex items-center justify-center transition-all duration-300`}>
                <FaFileAlt className={`text-indigo-600 ${isCollapsed ? 'text-lg' : 'text-sm'} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              {!isCollapsed && <span className="ml-3 font-medium text-gray-700 group-hover:text-indigo-700">Templates</span>}
            </Link>
          </li>
          
          <li>
            <Link 
              to="/payroll" 
              className={`group flex items-center ${isCollapsed ? 'px-2 py-4 justify-center' : 'px-3 py-3'} rounded-xl transition-all duration-300 hover:bg-indigo-50 hover:shadow-sm`}
            >
              <div className={`${isCollapsed ? 'w-10 h-10' : 'w-8 h-8'}  rounded-lg flex items-center justify-center transition-all duration-300`}>
                <FaDollarSign className={`text-indigo-600 ${isCollapsed ? 'text-lg' : 'text-sm'} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              {!isCollapsed && <span className="ml-3 font-medium text-gray-700 group-hover:text-indigo-700">Payroll</span>}
            </Link>
          </li>
          
          <li>
            <Link 
              to="/performance" 
              className={`group flex items-center ${isCollapsed ? 'px-2 py-4 justify-center' : 'px-3 py-3'} rounded-xl transition-all duration-300 hover:bg-indigo-50 hover:shadow-sm`}
            >
              <div className={`${isCollapsed ? 'w-10 h-10' : 'w-8 h-8'}  rounded-lg flex items-center justify-center transition-all duration-300`}>
                <FaChartLine className={`text-indigo-600 ${isCollapsed ? 'text-lg' : 'text-sm'} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              {!isCollapsed && <span className="ml-3 font-medium text-gray-700 group-hover:text-indigo-700">Performance</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-gray-200/50 px-3 py-4">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/support" 
              className={`group flex items-center ${isCollapsed ? 'px-2 py-4 justify-center' : 'px-3 py-3'} rounded-xl transition-all duration-300 hover:bg-indigo-50 hover:shadow-sm`}
            >
              <div className={`${isCollapsed ? 'w-10 h-10' : 'w-8 h-8'}  rounded-lg flex items-center justify-center transition-all duration-300`}>
                <FaComments className={`text-indigo-600 ${isCollapsed ? 'text-lg' : 'text-sm'} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              {!isCollapsed && <span className="ml-3 font-medium text-gray-700 group-hover:text-indigo-700">Support</span>}
            </Link>
          </li>
          
          <li>
            <Link 
              to="/settings" 
              className={`group flex items-center ${isCollapsed ? 'px-2 py-4 justify-center' : 'px-3 py-3'} rounded-xl transition-all duration-300 hover:bg-indigo-50 hover:shadow-sm`}
            >
              <div className={`${isCollapsed ? 'w-10 h-10' : 'w-8 h-8'}  rounded-lg flex items-center justify-center transition-all duration-300`}>
                <FaUsersCog className={`text-indigo-600 ${isCollapsed ? 'text-lg' : 'text-sm'} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              {!isCollapsed && <span className="ml-3 font-medium text-gray-700 group-hover:text-indigo-700">Settings</span>}
            </Link>
          </li>
          
          <li>
            <button
              onClick={handleLogout}
              className={`group w-full flex items-center ${isCollapsed ? 'px-2 py-4 justify-center' : 'px-3 py-3'} rounded-xl transition-all duration-300 hover:bg-red-50 hover:shadow-sm`}
            >
              <div className={`${isCollapsed ? 'w-10 h-10' : 'w-8 h-8'} bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-all duration-300`}>
                <FaSignOutAlt className={`text-red-600 ${isCollapsed ? 'text-lg' : 'text-sm'} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              {!isCollapsed && <span className="ml-3 font-medium text-gray-700 group-hover:text-red-700">Logout</span>}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;