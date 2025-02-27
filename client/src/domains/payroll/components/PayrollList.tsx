// client/src/domains/payroll/components/PayrollList.tsx
import React from 'react';
import { PayrollEntry } from '../types/payroll';

const mockData: PayrollEntry[] = [
  {
    id: 'PYRL120124',
    employeeName: 'Hazel Nutt',
    role: 'Lead UI/UX Designer',
    dateTime: '21 Jun, 2024 - 05:05 pm',
    totalSalary: 2500.00,
    status: 'Completed'
  },
  {
    id: 'PYRL120124',
    employeeName: 'Simon Cyrene',
    role: 'Sr UI/UX Designer',
    dateTime: '21 Jun, 2024 - 05:03 pm',
    totalSalary: 2300.00,
    status: 'Completed'
  },
  {
    id: 'PYRL120124',
    employeeName: 'Aida Bugg',
    role: 'Jr Graphics Designer',
    dateTime: '21 Jun, 2024 - 05:01 pm',
    totalSalary: 2000.00,
    status: 'Pending'
  },
  {
    id: 'PYRL120124',
    employeeName: 'Peg Legge',
    role: 'Jr Animator',
    dateTime: '21 Jun, 2024 - 05:00 pm',
    totalSalary: 2100.00,
    status: 'Pending'
  }
];

export const PayrollList: React.FC = () => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Payroll list</h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search Employee"
            className="px-4 py-2 border rounded-lg"
          />
          <select className="px-4 py-2 border rounded-lg">
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
          <select className="px-4 py-2 border rounded-lg">
            <option>All Role</option>
            <option>Designer</option>
            <option>Developer</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payroll ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockData.map((entry, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{entry.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 mr-3"></div>
                    {entry.employeeName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{entry.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entry.dateTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  $ {entry.totalSalary.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    entry.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entry.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      👁️
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      ⋮
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};