import React from 'react';
import { FaStar, FaBullseye, FaChartLine, FaTrophy, FaUsers, FaCalendarCheck } from 'react-icons/fa';

interface PerformanceMetric {
  id: string;
  title: string;
  value: string | number;
  target?: string | number;
  progress: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: React.ReactNode;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  performance: number;
  goalsCompleted: number;
  totalGoals: number;
  avatar?: string;
}

const PerformanceDashboard: React.FC = () => {
  const performanceMetrics: PerformanceMetric[] = [
    {
      id: 'team-performance',
      title: 'Team Performance',
      value: '87%',
      target: '85%',
      progress: 87,
      trend: 'up',
      color: 'from-emerald-500 to-green-500',
      icon: <FaStar />
    },
    {
      id: 'goals-completion',
      title: 'Goals Completion',
      value: '92%',
      target: '90%',
      progress: 92,
      trend: 'up',
      color: 'from-blue-500 to-indigo-500',
      icon: <FaBullseye />
    },
    {
      id: 'productivity',
      title: 'Productivity Index',
      value: 8.4,
      target: 8.0,
      progress: 84,
      trend: 'up',
      color: 'from-purple-500 to-violet-500',
      icon: <FaChartLine />
    },
    {
      id: 'satisfaction',
      title: 'Team Satisfaction',
      value: '4.2/5',
      target: '4.0/5',
      progress: 84,
      trend: 'stable',
      color: 'from-orange-500 to-red-500',
      icon: <FaTrophy />
    }
  ];

  const topPerformers: TeamMember[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Senior Developer',
      performance: 95,
      goalsCompleted: 8,
      totalGoals: 8
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Product Manager',
      performance: 92,
      goalsCompleted: 7,
      totalGoals: 8
    },
    {
      id: 3,
      name: 'Emma Davis',
      role: 'UX Designer',
      performance: 89,
      goalsCompleted: 6,
      totalGoals: 7
    },
    {
      id: 4,
      name: 'Alex Kim',
      role: 'Data Analyst',
      performance: 87,
      goalsCompleted: 5,
      totalGoals: 6
    }
  ];

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <span className="text-emerald-500">↗</span>;
      case 'down':
        return <span className="text-red-500">↘</span>;
      default:
        return <span className="text-gray-500">→</span>;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
            <FaTrophy className="text-white text-sm" />
          </div>
          Performance Dashboard
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gradient-to-r from-indigo-100 to-purple-100 px-2 py-1 rounded-full">
            Real-time
          </span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {performanceMetrics.map((metric) => (
          <div
            key={metric.id}
            className="relative p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center shadow-sm`}>
                <div className="text-white text-sm">
                  {metric.icon}
                </div>
              </div>
              {getTrendIcon(metric.trend)}
            </div>
            
            <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
            <div className="text-xl font-bold text-gray-800 mb-2">{metric.value}</div>
            
            {metric.target && (
              <div className="text-xs text-gray-500 mb-2">
                Target: {metric.target}
              </div>
            )}
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${metric.color} h-2 rounded-full transition-all duration-1000`}
                style={{ width: `${metric.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Performers Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="text-lg">🏆</span>
          <span className="ml-2">Top Performers This Month</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topPerformers.map((member, index) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs">👑</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">{member.name}</h4>
                  <p className="text-xs text-gray-600">{member.role}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(member.performance)}`}>
                  {member.performance}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {member.goalsCompleted}/{member.totalGoals} goals
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FaUsers className="text-indigo-600 mr-2" />
            <span className="text-lg font-bold text-indigo-600">23</span>
          </div>
          <div className="text-xs text-gray-600">Active Team Members</div>
        </div>
        <div className="text-center border-x border-indigo-200">
          <div className="flex items-center justify-center mb-2">
            <FaCalendarCheck className="text-indigo-600 mr-2" />
            <span className="text-lg font-bold text-indigo-600">156</span>
          </div>
          <div className="text-xs text-gray-600">Goals Completed</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FaTrophy className="text-indigo-600 mr-2" />
            <span className="text-lg font-bold text-indigo-600">12</span>
          </div>
          <div className="text-xs text-gray-600">Achievements</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Performance data updated 2 minutes ago
          </span>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            View Detailed Report →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard; 