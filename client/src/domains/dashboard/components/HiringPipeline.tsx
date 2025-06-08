import React from 'react';
import { FaUser, FaEye, FaPhone, FaUsers, FaCheckCircle, FaClock, FaChartLine } from 'react-icons/fa';

interface PipelineStage {
  id: string;
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  conversionRate?: number;
  avgTimeInStage?: string;
}

interface Candidate {
  id: number;
  name: string;
  position: string;
  stage: string;
  score: number;
  daysInStage: number;
  avatar?: string;
}

const HiringPipeline: React.FC = () => {
  const pipelineStages: PipelineStage[] = [
    {
      id: 'applied',
      name: 'Applied',
      count: 124,
      icon: <FaUser />,
      color: 'from-gray-500 to-slate-500',
      conversionRate: 32,
      avgTimeInStage: '2 days'
    },
    {
      id: 'screening',
      name: 'Screening',
      count: 42,
      icon: <FaEye />,
      color: 'from-blue-500 to-indigo-500',
      conversionRate: 65,
      avgTimeInStage: '3 days'
    },
    {
      id: 'interview',
      name: 'Interview',
      count: 18,
      icon: <FaPhone />,
      color: 'from-purple-500 to-violet-500',
      conversionRate: 78,
      avgTimeInStage: '5 days'
    },
    {
      id: 'final',
      name: 'Final Round',
      count: 8,
      icon: <FaUsers />,
      color: 'from-orange-500 to-red-500',
      conversionRate: 89,
      avgTimeInStage: '4 days'
    },
    {
      id: 'offer',
      name: 'Offer',
      count: 3,
      icon: <FaCheckCircle />,
      color: 'from-emerald-500 to-green-500',
      conversionRate: 95,
      avgTimeInStage: '3 days'
    }
  ];

  const topCandidates: Candidate[] = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      position: 'Senior Developer',
      stage: 'Final Round',
      score: 94,
      daysInStage: 2
    },
    {
      id: 2,
      name: 'Marcus Chen',
      position: 'UX Designer',
      stage: 'Interview',
      score: 91,
      daysInStage: 1
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      position: 'Product Manager',
      stage: 'Offer',
      score: 89,
      daysInStage: 3
    },
    {
      id: 4,
      name: 'James Wilson',
      position: 'Data Scientist',
      stage: 'Screening',
      score: 87,
      daysInStage: 2
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStageColor = (stage: string) => {
    const stageObj = pipelineStages.find(s => s.name === stage);
    return stageObj ? stageObj.color : 'from-gray-500 to-slate-500';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
            <FaUsers className="text-white text-sm" />
          </div>
          Hiring Pipeline
        </h2>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-800">195 Active</div>
            <div className="text-xs text-gray-500">Candidates</div>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {pipelineStages.map((stage, index) => (
            <div key={stage.id} className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${stage.color} rounded-xl flex items-center justify-center shadow-lg mb-2 hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {stage.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-gray-800 mb-1">{stage.name}</h3>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stage.count}</div>
                {stage.conversionRate && (
                  <div className="text-xs text-emerald-600 font-medium">
                    {stage.conversionRate}% conversion
                  </div>
                )}
                {stage.avgTimeInStage && (
                  <div className="text-xs text-gray-500">
                    <FaClock className="inline mr-1" />
                    {stage.avgTimeInStage}
                  </div>
                )}
              </div>
              
              {/* Connection Line */}
              {index < pipelineStages.length - 1 && (
                <div className="absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 -z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hiring Velocity Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
        <div className="text-center">
          <div className="text-lg font-bold text-indigo-600">12 days</div>
          <div className="text-xs text-gray-600">Avg. Time to Hire</div>
          <div className="text-xs text-emerald-600 flex items-center justify-center mt-1">
            <FaChartLine className="mr-1" />
            15% faster
          </div>
        </div>
        <div className="text-center border-x border-indigo-200">
          <div className="text-lg font-bold text-indigo-600">$2,400</div>
          <div className="text-xs text-gray-600">Avg. Cost per Hire</div>
          <div className="text-xs text-emerald-600 flex items-center justify-center mt-1">
            <FaChartLine className="mr-1" />
            8% reduction
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-indigo-600">89%</div>
          <div className="text-xs text-gray-600">Offer Acceptance Rate</div>
          <div className="text-xs text-emerald-600 flex items-center justify-center mt-1">
            <FaChartLine className="mr-1" />
            +5% this month
          </div>
        </div>
      </div>

      {/* Top Candidates */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="text-lg">🌟</span>
          <span className="ml-2">Top Candidates</span>
        </h3>
        <div className="space-y-3">
          {topCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">{candidate.name}</h4>
                  <p className="text-xs text-gray-600">{candidate.position}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(candidate.score)}`}>
                  {candidate.score}% match
                </div>
                <div className={`w-3 h-3 bg-gradient-to-r ${getStageColor(candidate.stage)} rounded-full`}></div>
                <div className="text-xs text-gray-500">
                  {candidate.daysInStage}d
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Pipeline updated 10 minutes ago
          </span>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            View Full Pipeline →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HiringPipeline; 