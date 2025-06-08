import React from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { FaPlus, FaCalendarAlt, FaFileAlt, FaUsers, FaClipboardList, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  action: () => void;
  color: string;
  roles: string[];
}

const QuickActionsPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: 'post-job',
      icon: <FaPlus className="text-lg" />,
      label: 'Post New Job',
      description: 'Create a new job listing',
      action: () => navigate('/job-management'),
      color: 'from-emerald-500 to-green-500',
      roles: ['admin', 'recruiter']
    },
    {
      id: 'schedule-interview',
      icon: <FaCalendarAlt className="text-lg" />,
      label: 'Schedule Interview',
      description: 'Set up candidate interviews',
      action: () => navigate('/recruitment'),
      color: 'from-blue-500 to-indigo-500',
      roles: ['admin', 'recruiter', 'manager']
    },
    {
      id: 'add-employee',
      icon: <FaUsers className="text-lg" />,
      label: 'Add Employee',
      description: 'Onboard new team member',
      action: () => navigate('/employees'),
      color: 'from-purple-500 to-violet-500',
      roles: ['admin', 'manager']
    },
    {
      id: 'generate-report',
      icon: <FaFileAlt className="text-lg" />,
      label: 'Generate Report',
      description: 'Create analytics report',
      action: () => navigate('/talent-insights'),
      color: 'from-orange-500 to-red-500',
      roles: ['admin', 'manager']
    },
    {
      id: 'manage-tasks',
      icon: <FaClipboardList className="text-lg" />,
      label: 'View All Tasks',
      description: 'Manage your task list',
      action: () => navigate('/tasks'),
      color: 'from-teal-500 to-cyan-500',
      roles: ['admin', 'recruiter', 'manager', 'employee']
    },
    {
      id: 'settings',
      icon: <FaCog className="text-lg" />,
      label: 'Settings',
      description: 'Configure your workspace',
      action: () => navigate('/profile'),
      color: 'from-gray-500 to-slate-500',
      roles: ['admin', 'recruiter', 'manager', 'employee']
    }
  ];

  // Filter actions based on user role
  const userRole = user?.role?.toLowerCase() || 'employee';
  const availableActions = quickActions.filter(action => 
    action.roles.includes(userRole)
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">⚡</span>
          </div>
          Quick Actions
        </h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {availableActions.map(action => (
          <button
            key={action.id}
            onClick={action.action}
            className="group relative bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:scale-105 text-left"
          >
            <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <div className="text-white">
                {action.icon}
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm">
              {action.label}
            </h3>
            <p className="text-xs text-gray-600">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel; 