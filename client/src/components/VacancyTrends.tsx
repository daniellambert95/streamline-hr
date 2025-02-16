import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
  } from "recharts";
  
  // Tailwind color utility function
  const tailwindColors = {
    indigo: "rgba(79, 70, 229, 1)", // Tailwind's indigo-600 (#4F46E5)
    turquoise: "rgba(6, 182, 212, 1)", // Tailwind's turquoise-500 (#06B6D4)
    gray: "rgba(229, 231, 235, 1)", // Tailwind's gray-200 (#e5e7eb)
  };
  
  const vacancyTrendsData = [
    { month: "Jan", vacancies: 15, candidates: 10 },
    { month: "Feb", vacancies: 30, candidates: 20 },
    { month: "Mar", vacancies: 20, candidates: 15 },
    { month: "Apr", vacancies: 25, candidates: 12 },
    { month: "May", vacancies: 35, candidates: 18 },
    { month: "Jun", vacancies: 45, candidates: 22 },
    { month: "Jul", vacancies: 40, candidates: 25 },
    { month: "Aug", vacancies: 50, candidates: 30 },
    { month: "Sep", vacancies: 55, candidates: 28 },
    { month: "Oct", vacancies: 60, candidates: 35 },
    { month: "Nov", vacancies: 62, candidates: 30 },
    { month: "Dec", vacancies: 65, candidates: 25 },
  ];
  
  const VacancyTrends = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-full flex flex-col">
        <h2 className="text-lg font-bold mb-4">Vacancy Trends</h2>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={vacancyTrendsData}>
              <defs>
                <linearGradient id="colorVacancies" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={tailwindColors.turquoise}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={tailwindColors.turquoise}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={tailwindColors.indigo}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={tailwindColors.indigo}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={tailwindColors.gray}
              />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="vacancies"
                stroke={tailwindColors.turquoise}
                fillOpacity={1}
                fill="url(#colorVacancies)"
              />
              <Area
                type="monotone"
                dataKey="candidates"
                stroke={tailwindColors.indigo}
                fillOpacity={1}
                fill="url(#colorCandidates)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  export default VacancyTrends;