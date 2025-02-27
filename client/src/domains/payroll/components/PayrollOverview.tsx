// client/src/domains/payroll/components/PayrollOverview.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Mar', cost: 3000, expense: 1000 },
  { month: 'Apr', cost: 4000, expense: 2000 },
  { month: 'May', cost: 7000, expense: 2500 },
  { month: 'Jun', cost: 4000, expense: 2000 },
  { month: 'Jul', cost: 8740, expense: 2110 },
  { month: 'Aug', cost: 3500, expense: 1500 },
  { month: 'Sep', cost: 5000, expense: 2000 },
  { month: 'Oct', cost: 4200, expense: 1800 },
  { month: 'Nov', cost: 7500, expense: 2500 },
];

export const PayrollOverview: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Payroll Cost Overview</h3>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">July 2024</span>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">$8,740.00 ↑ 51.3%</span>
                <span className="text-xs text-gray-600">$2,110.00 ↑ 12.1%</span>
              </div>
            </div>
          </div>
          <button className="text-gray-600 hover:text-gray-800">
            More details →
          </button>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis 
              tickFormatter={(value) => `$${value/1000}k`}
              ticks={[0, 3000, 6000, 9000, 12000, 15000]}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Amount']}
              labelStyle={{ color: '#666' }}
            />
            <Bar dataKey="cost" fill="#818CF8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#C7D2FE" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};