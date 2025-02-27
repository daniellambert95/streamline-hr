// client/src/domains/payroll/components/PayrollStats.tsx
import React from 'react';

export const PayrollStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-600 text-sm">Payrolls Cost</p>
        <p className="text-2xl font-bold mt-2">$12,500</p>
        <p className="text-green-600 text-sm flex items-center mt-1">
          <span>↑ 20%</span>
          <span className="text-gray-500 ml-1">last month</span>
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-600 text-sm">Total Expense</p>
        <p className="text-2xl font-bold mt-2">$2,560</p>
        <p className="text-green-600 text-sm flex items-center mt-1">
          <span>↑ 0.1%</span>
          <span className="text-gray-500 ml-1">last month</span>
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-600 text-sm">Pending payments</p>
        <p className="text-2xl font-bold mt-2">$4,700</p>
        <p className="text-red-600 text-sm flex items-center mt-1">
          <span>↓ 50</span>
          <span className="text-gray-500 ml-1">Total Employee</span>
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-600 text-sm">Total Payrolls</p>
        <p className="text-2xl font-bold mt-2">200</p>
        <p className="text-green-600 text-sm flex items-center mt-1">
          <span>↑ 10</span>
          <span className="text-gray-500 ml-1">New Employee</span>
        </p>
      </div>
    </div>
  );
};