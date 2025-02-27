// client/src/pages/private/Payroll.tsx
import React, { useState } from 'react';
import { PayrollOverview } from '../../domains/payroll/components/PayrollOverview';
import { PayrollList } from '../../domains/payroll/components/PayrollList';
import { BonusesChart } from '../../domains/payroll/components/BonusesChart';
import { PayrollStats } from '../../domains/payroll/components/PayrollStats';
import { PayrollPeriod } from '../../domains/payroll/types/payroll';

const PayrollManagement: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod>({
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-31')
  });

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Header with Alert */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-green-700">⚠️</span>
          <p className="text-sm text-green-700">
            payroll submission for the current pay period is due in 2 days. review and finalize all employee payroll details.
          </p>
        </div>
        <button className="text-green-700 text-sm hover:underline">
          MORE DETAILS
        </button>
      </div>

      {/* Period Selector and Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <select 
            className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8"
            value={`${selectedPeriod.startDate.toISOString()}-${selectedPeriod.endDate.toISOString()}`}
            onChange={(e) => {
              const [start, end] = e.target.value.split('-');
              setSelectedPeriod({
                startDate: new Date(start),
                endDate: new Date(end)
              });
            }}
          >
            <option value="2024-07-01-2024-07-31">01 July - 31 July 2024</option>
            {/* Add more periods as needed */}
          </select>
        </div>
        
        <div className="flex gap-4">
          <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
            Export
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            + New Payroll
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <PayrollStats />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PayrollOverview />
        <BonusesChart />
      </div>

      {/* Payroll List */}
      <PayrollList />
    </div>
  );
};

export default PayrollManagement;