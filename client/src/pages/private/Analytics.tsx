import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Sep', revenue: 3500, profit: 2200 },
  { month: 'Oct', revenue: 3780, profit: 2500 },
  { month: 'Nov', revenue: 3400, profit: 2100 },
  { month: 'Dec', revenue: 4000, profit: 2800 },
  { month: 'Jan', revenue: 4200, profit: 3000 },
  { month: 'Feb', revenue: 3900, profit: 2700 },
  { month: 'Mar', revenue: 4500, profit: 3100 },
  { month: 'Apr', revenue: 4800, profit: 3200 },
  { month: 'May', revenue: 5000, profit: 3500 },
  { month: 'Jun', revenue: 5200, profit: 3700 },
  { month: 'Jul', revenue: 5300, profit: 3800 },
  { month: 'Aug', revenue: 5500, profit: 4000 },
];

const AnalyticsPage = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">$35,8K</h1>
            <p className="text-sm text-gray-500">Overall Revenue</p>
          </div>
          <div>
            <button className="text-gray-700 border border-gray-300 rounded-md px-4 py-2 text-sm flex items-center">
              Monthly
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4F46E5"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#22C55E"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsPage;