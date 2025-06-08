import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-4">
          <div className="text-6xl text-red-500 mb-4">🚫</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">403</h1>
          <h2 className="text-xl text-gray-600 mb-4">Access Denied</h2>
        </div>
        <p className="text-gray-500 mb-6">
          Sorry, you are not authorized to access this page.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Back Home
        </button>
      </div>
    </div>
  );
}; 