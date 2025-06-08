import React from 'react';
import { FaUsers, FaLayerGroup, FaUserTie, FaChartLine, FaFileAlt, FaBriefcase, FaClock, FaLightbulb, FaCalendarAlt } from 'react-icons/fa';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue: string;
  icon: 'users' | 'teams' | 'managers' | 'growth' | 'briefcase' | 'file-alt' | 'clock' | 'chart' | 'lightbulb' | 'user-tie' | 'calendar';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'users': return <FaUsers className="w-6 h-6" />;
      case 'teams': return <FaLayerGroup className="w-6 h-6" />;
      case 'managers': return <FaUserTie className="w-6 h-6" />;
      case 'growth': return <FaChartLine className="w-6 h-6" />;
      case 'briefcase': return <FaBriefcase className="w-6 h-6" />;
      case 'file-alt': return <FaFileAlt className="w-6 h-6" />;
      case 'clock': return <FaClock className="w-6 h-6" />;
      case 'chart': return <FaChartLine className="w-6 h-6" />;
      case 'lightbulb': return <FaLightbulb className="w-6 h-6" />;
      case 'user-tie': return <FaUserTie className="w-6 h-6" />;
      case 'calendar': return <FaCalendarAlt className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{subValue}</p>
        </div>
        <div className="text-indigo-600">
          {getIcon()}
        </div>
      </div>
    </div>
  );
};

export default StatCard; 