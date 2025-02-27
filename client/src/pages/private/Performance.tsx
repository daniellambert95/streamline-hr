import React, { useState } from 'react';
import { PerformanceOverview } from '../../domains/performance/components/PerformanceOverview';
import { PerformanceStats } from '../../domains/performance/components/PerformanceStats';
import { ReviewsList } from '../../domains/performance/components/ReviewsList';
import { SkillsMatrix } from '../../domains/performance/components/SkillsMatrix';

const PerformanceReviews: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-Q1');

  return (
    <div className="font-sans bg-gray-100 min-h-screen space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-700">Performance Reviews</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50">
            Export Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            + New Review
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-4">
        <select 
          className="px-4 py-2 border rounded-lg bg-white"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="2024-Q1">Q1 2024</option>
          <option value="2023-Q4">Q4 2023</option>
          <option value="2023-Q3">Q3 2023</option>
          <option value="2023-Q2">Q2 2023</option>
        </select>
      </div>

      {/* Stats Cards */}
      <PerformanceStats />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceOverview />
        <SkillsMatrix />
      </div>

      {/* Reviews List */}
      <ReviewsList />
    </div>
  );
};

export default PerformanceReviews; 