import React from 'react';
import { FaUsers, FaUserCheck, FaUserTimes, FaUserClock, FaArrowUp, FaArrowDown, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: {
    value: string;
    isPositive: boolean;
    comparison: string;
  };
  icon: React.ReactNode;
  iconColor: string;
  insight?: string;
  alertLevel?: 'none' | 'warning' | 'critical';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  trend, 
  icon, 
  iconColor, 
  insight,
  alertLevel = 'none'
}) => {
  const alertColors = {
    none: '',
    warning: 'border-yellow-300 bg-yellow-50/30',
    critical: 'border-red-300 bg-red-50/30'
  };

  const alertIcons = {
    none: null,
    warning: <FaExclamationTriangle className="text-yellow-500 text-sm" />,
    critical: <FaExclamationTriangle className="text-red-500 text-sm" />
  };

  return (
    <div className={`group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-300 ${alertColors[alertLevel]}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${iconColor} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white text-xl">
              {icon}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {alertIcons[alertLevel]}
            <div className={`text-xl ${trend.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend.isPositive ? <FaArrowUp /> : <FaArrowDown />}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
        
        <div className="flex items-center justify-between">
          <div className={`flex items-center text-sm font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend.isPositive ? <FaArrowUp className="mr-1 text-xs" /> : <FaArrowDown className="mr-1 text-xs" />}
            {trend.value} {trend.comparison}
          </div>
          {insight && (
            <div className="text-xs text-gray-500">
              <FaChartLine className="inline mr-1" />
              {insight}
            </div>
          )}
        </div>
        
        {alertLevel !== 'none' && (
          <div className="mt-3 p-2 rounded-lg bg-white/50 border border-gray-200">
            <p className="text-xs text-gray-700">
              {alertLevel === 'warning' ? 'Monitor closely' : 'Needs attention'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const EnhancedMetricsCards: React.FC = () => {
  const metrics = [
    {
      title: "Total Employees",
      value: 418,
      trend: {
        value: "+7%",
        isPositive: true,
        comparison: "last month"
      },
      icon: <FaUsers />,
      iconColor: "from-indigo-500 to-purple-500",
      insight: "Growing team",
      alertLevel: 'none' as const
    },
    {
      title: "New Employees",
      value: 21,
      trend: {
        value: "+2%",
        isPositive: true,
        comparison: "last month"
      },
      icon: <FaUserCheck />,
      iconColor: "from-emerald-500 to-green-500",
      insight: "On target",
      alertLevel: 'none' as const
    },
    {
      title: "Resigned Employees",
      value: 14,
      trend: {
        value: "+4%",
        isPositive: false,
        comparison: "last month"
      },
      icon: <FaUserTimes />,
      iconColor: "from-orange-500 to-red-500",
      insight: "Above average",
      alertLevel: 'warning' as const
    },
    {
      title: "Employees On Leave",
      value: 4,
      trend: {
        value: "-15%",
        isPositive: true,
        comparison: "than usual"
      },
      icon: <FaUserClock />,
      iconColor: "from-blue-500 to-cyan-500",
      insight: "Low usage",
      alertLevel: 'none' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default EnhancedMetricsCards; 