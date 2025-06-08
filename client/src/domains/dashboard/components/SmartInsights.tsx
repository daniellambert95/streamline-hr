import React from 'react';
import { FaBrain, FaExclamationTriangle, FaLightbulb, FaChartLine, FaUserTimes, FaCalendarAlt, FaUsers } from 'react-icons/fa';

interface Insight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'trend';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon: React.ReactNode;
  color: string;
  data?: {
    confidence?: number;
    timeframe?: string;
    impact?: string;
  };
}

const SmartInsights: React.FC = () => {
  const insights: Insight[] = [
    {
      id: 'turnover-prediction',
      type: 'prediction',
      title: 'Turnover Risk Alert',
      description: 'Sarah Johnson (Marketing) shows 78% likelihood of leaving within 30 days based on engagement patterns.',
      priority: 'high',
      actionable: true,
      action: {
        label: 'Schedule 1-on-1',
        onClick: () => console.log('Schedule meeting with Sarah')
      },
      icon: <FaUserTimes />,
      color: 'from-red-500 to-orange-500',
      data: {
        confidence: 78,
        timeframe: '30 days',
        impact: 'High - Key team member'
      }
    },
    {
      id: 'hiring-recommendation',
      type: 'recommendation',
      title: 'Optimal Hiring Window',
      description: 'Best time to post Senior Developer role is next Tuesday. Historical data shows 40% higher application rates.',
      priority: 'medium',
      actionable: true,
      action: {
        label: 'Schedule Post',
        onClick: () => console.log('Schedule job posting')
      },
      icon: <FaCalendarAlt />,
      color: 'from-blue-500 to-indigo-500',
      data: {
        confidence: 85,
        timeframe: 'Next Tuesday',
        impact: '40% higher response rate'
      }
    },
    {
      id: 'performance-trend',
      type: 'trend',
      title: 'Department Performance Rising',
      description: 'Engineering team productivity up 23% this quarter. Consider team expansion or increased project allocation.',
      priority: 'medium',
      actionable: true,
      action: {
        label: 'View Details',
        onClick: () => console.log('View engineering metrics')
      },
      icon: <FaChartLine />,
      color: 'from-emerald-500 to-green-500',
      data: {
        confidence: 92,
        timeframe: 'This quarter',
        impact: '23% productivity increase'
      }
    },
    {
      id: 'diversity-alert',
      type: 'alert',
      title: 'Diversity Goal Progress',
      description: 'Currently 68% toward Q1 diversity hiring goal. Adjust sourcing strategy to meet target.',
      priority: 'medium',
      actionable: true,
      action: {
        label: 'Update Strategy',
        onClick: () => console.log('Update diversity strategy')
      },
      icon: <FaUsers />,
      color: 'from-purple-500 to-violet-500',
      data: {
        confidence: 95,
        timeframe: 'Q1 2025',
        impact: '32% gap to target'
      }
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50/50';
      case 'high': return 'border-orange-500 bg-orange-50/50';
      case 'medium': return 'border-yellow-500 bg-yellow-50/50';
      default: return 'border-blue-500 bg-blue-50/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <FaBrain className="text-purple-500" />;
      case 'recommendation': return <FaLightbulb className="text-yellow-500" />;
      case 'alert': return <FaExclamationTriangle className="text-red-500" />;
      case 'trend': return <FaChartLine className="text-green-500" />;
      default: return <FaLightbulb className="text-blue-500" />;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
            <FaBrain className="text-white text-sm" />
          </div>
          Smart Insights
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gradient-to-r from-indigo-100 to-purple-100 px-2 py-1 rounded-full">
            AI-Powered
          </span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`relative p-4 rounded-xl border-l-4 ${getPriorityColor(insight.priority)} hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`w-10 h-10 bg-gradient-to-r ${insight.color} rounded-lg flex items-center justify-center shadow-sm`}>
                  <div className="text-white text-sm">
                    {insight.icon}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeIcon(insight.type)}
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {insight.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      insight.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {insight.priority}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {insight.description}
                  </p>
                  
                  {insight.data && (
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      {insight.data.confidence && (
                        <span className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                          {insight.data.confidence}% confidence
                        </span>
                      )}
                      {insight.data.timeframe && (
                        <span className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></div>
                          {insight.data.timeframe}
                        </span>
                      )}
                      {insight.data.impact && (
                        <span className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></div>
                          {insight.data.impact}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {insight.actionable && insight.action && (
                <button
                  onClick={insight.action.onClick}
                  className="ml-4 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105 whitespace-nowrap"
                >
                  {insight.action.label}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Insights updated 5 minutes ago
          </span>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            View All Insights →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartInsights; 