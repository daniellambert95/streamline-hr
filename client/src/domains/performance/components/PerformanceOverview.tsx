import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PerformanceTrendPoint } from '../types/performance';

const data: PerformanceTrendPoint[] = [
  { month: 'Jan', avgRating: 3.8, reviews: 42 },
  { month: 'Feb', avgRating: 3.9, reviews: 38 },
  { month: 'Mar', avgRating: 4.1, reviews: 45 },
  { month: 'Apr', avgRating: 4.0, reviews: 39 },
  { month: 'May', avgRating: 4.2, reviews: 41 },
  { month: 'Jun', avgRating: 4.1, reviews: 40 },
  { month: 'Jul', avgRating: 4.3, reviews: 43 },
  { month: 'Aug', avgRating: 4.2, reviews: 44 },
];

export const PerformanceOverview: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Performance Trends</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-full bg-indigo-500"></span>
            <span>Avg Rating</span>
            <span className="h-3 w-3 rounded-full bg-green-500 ml-2"></span>
            <span>Reviews</span>
          </div>
          <button className="text-gray-600 hover:text-gray-800">
            More details →
          </button>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avgRating"
              stroke="#6366F1"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="reviews"
              stroke="#22C55E"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 