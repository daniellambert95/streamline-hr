// client/src/domains/payroll/components/BonusesChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Bonuses', value: 5100 },
  { name: 'Incentives', value: 5400 },
];

const COLORS = ['#4F46E5', '#06B6D4'];

export const BonusesChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Bonuses and Incentives</h3>
        <button className="text-gray-400 hover:text-gray-600">⋮</button>
      </div>

      <div className="h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={-180}
              dataKey="value"
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => {
                const { payload } = entry as any;
                return (
                  <span className="text-sm">
                    {value}: ${payload.value.toLocaleString()}
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-sm text-gray-500">Totals</p>
          <p className="text-xl font-bold">${(10500).toLocaleString()}</p>
        </div>
      </div>

      <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-800 border-t">
        More details
      </button>
    </div>
  );
};