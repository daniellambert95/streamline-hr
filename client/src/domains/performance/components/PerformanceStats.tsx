import React from 'react';
import { PerformanceStats as IPerformanceStats } from '../types/performance';

const statsData: IPerformanceStats = {
  averageRating: 4.2,
  reviewsCompleted: 89,
  totalReviews: 100,
  highPerformers: 24,
  needsImprovement: 8,
  previousQuarterComparison: {
    averageRating: 3.9,
    reviewsCompleted: 77,
    highPerformers: 20,
    needsImprovement: 6
  }
};

export const PerformanceStats: React.FC = () => {
  const calculateChange = (current: number, previous: number): string => {
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `↑ ${change.toFixed(1)}%` : `↓ ${Math.abs(change).toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg border border-gray-100">
        <p className="text-sm text-gray-600">Average Rating</p>
        <p className="text-2xl font-semibold mt-1">{statsData.averageRating}/5.0</p>
        <p className="text-green-600 text-xs flex items-center mt-1">
          <span>{calculateChange(statsData.averageRating, statsData.previousQuarterComparison.averageRating)}</span>
          <span className="text-gray-500 ml-1">vs last quarter</span>
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-100">
        <p className="text-sm text-gray-600">Reviews Completed</p>
        <p className="text-2xl font-semibold mt-1">{statsData.reviewsCompleted}%</p>
        <p className="text-green-600 text-xs flex items-center mt-1">
          <span>{calculateChange(statsData.reviewsCompleted, statsData.previousQuarterComparison.reviewsCompleted)}</span>
          <span className="text-gray-500 ml-1">vs last quarter</span>
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-100">
        <p className="text-sm text-gray-600">High Performers</p>
        <p className="text-2xl font-semibold mt-1">{statsData.highPerformers}</p>
        <p className="text-green-600 text-xs flex items-center mt-1">
          <span>{calculateChange(statsData.highPerformers, statsData.previousQuarterComparison.highPerformers)}</span>
          <span className="text-gray-500 ml-1">vs last quarter</span>
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-100">
        <p className="text-sm text-gray-600">Needs Improvement</p>
        <p className="text-2xl font-semibold mt-1">{statsData.needsImprovement}</p>
        <p className="text-red-600 text-xs flex items-center mt-1">
          <span>{calculateChange(statsData.needsImprovement, statsData.previousQuarterComparison.needsImprovement)}</span>
          <span className="text-gray-500 ml-1">vs last quarter</span>
        </p>
      </div>
    </div>
  );
}; 