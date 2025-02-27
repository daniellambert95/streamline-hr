import React from 'react';
import { PerformanceReview, ReviewStatus } from '../types/performance';

const mockData: PerformanceReview[] = [
  {
    id: 'REV001',
    employeeName: 'John Cooper',
    employeeId: 'EMP001',
    reviewType: 'Quarterly Review',
    reviewer: 'Sarah Wilson',
    reviewerId: 'EMP002',
    date: '15 Mar 2024',
    rating: 4.5,
    status: 'Completed'
  },
  {
    id: 'REV002',
    employeeName: 'Emma Thompson',
    employeeId: 'EMP003',
    reviewType: 'Annual Review',
    reviewer: 'Michael Brown',
    reviewerId: 'EMP004',
    date: '14 Mar 2024',
    rating: 4.2,
    status: 'Pending'
  },
  {
    id: 'REV003',
    employeeName: 'David Miller',
    employeeId: 'EMP005',
    reviewType: 'Quarterly Review',
    reviewer: 'Sarah Wilson',
    reviewerId: 'EMP002',
    date: '13 Mar 2024',
    rating: 3.8,
    status: 'In Progress'
  },
  {
    id: 'REV004',
    employeeName: 'Lisa Anderson',
    employeeId: 'EMP006',
    reviewType: 'Quarterly Review',
    reviewer: 'James Moore',
    reviewerId: 'EMP007',
    date: '12 Mar 2024',
    rating: 4.7,
    status: 'Completed'
  }
];

const getStatusStyle = (status: ReviewStatus): string => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ReviewsList: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-100">
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Reviews</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search reviews"
            className="px-3 py-1.5 text-sm border rounded-lg"
          />
          <select className="px-3 py-1.5 text-sm border rounded-lg">
            <option>All Status</option>
            <option>Completed</option>
            <option>In Progress</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
              <th className="px-4 py-2 text-left">Review ID</th>
              <th className="px-4 py-2 text-left">Employee</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Reviewer</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Rating</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockData.map((review) => (
              <tr key={review.id} className="text-sm">
                <td className="px-4 py-3">{review.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-gray-200 mr-2"></div>
                    {review.employeeName}
                  </div>
                </td>
                <td className="px-4 py-3">{review.reviewType}</td>
                <td className="px-4 py-3">{review.reviewer}</td>
                <td className="px-4 py-3">{review.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    {review.rating}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(review.status)}`}>
                    {review.status}
                  </span>
                </td>
                <td className="px-4 py-3">
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