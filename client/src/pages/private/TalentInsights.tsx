import React, { useState, useEffect } from "react";
import { FaDownload, FaCalendarAlt } from "react-icons/fa";
import StatCard from "../../core/components/common/StatCard";
import handleApiError from "../../core/utils/handleApiError";
import { applicantService, jobService } from "../../domains/recruitment/services/recruitment";
import { Applicant } from "../../domains/recruitment/types/applicant";
import { JobListing } from "../../domains/recruitment/types/job";

// Mock data for charts
const mockTimeToHireData = [
  { month: "Jan", days: 22 },
  { month: "Feb", days: 25 },
  { month: "Mar", days: 18 },
  { month: "Apr", days: 20 },
  { month: "May", days: 15 },
  { month: "Jun", days: 17 },
];

const mockSourceData = [
  { source: "LinkedIn", count: 45, percentage: 45 },
  { source: "Indeed", count: 25, percentage: 25 },
  { source: "Referrals", count: 15, percentage: 15 },
  { source: "Company Website", count: 10, percentage: 10 },
  { source: "Other", count: 5, percentage: 5 },
];

const mockDiversityData = {
  gender: { male: 55, female: 40, other: 5 },
  ethnicity: { white: 60, asian: 20, black: 10, hispanic: 8, other: 2 },
  age: { "18-24": 15, "25-34": 45, "35-44": 25, "45-54": 10, "55+": 5 },
};

const TalentInsights: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [timeRange, setTimeRange] = useState("last30days");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [applicantsResponse, jobsResponse] = await Promise.all([
          applicantService.getAll(),
          jobService.getAll(),
        ]);
        setApplicants(applicantsResponse.data);
        setJobs(jobsResponse.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics
  const totalApplicants = applicants.length;
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === "open").length;
  
  const hiredApplicants = applicants.filter(app => app.status === "accepted").length;
  // const rejectedApplicants = applicants.filter(app => app.status === "rejected").length;
  
  const hireRate = totalApplicants > 0 ? Math.round((hiredApplicants / totalApplicants) * 100) : 0;
  
  // Calculate average time to hire (mock data)
  const avgTimeToHire = mockTimeToHireData.reduce((sum, item) => sum + item.days, 0) / mockTimeToHireData.length;

  return (
    <div className="max-w-full mx-auto bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white shadow-sm mb-6 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Talent Insights</h1>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-100 text-gray-700 px-4 py-2 pr-8 rounded-lg border border-gray-200 appearance-none"
              >
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
                <option value="lastYear">Last Year</option>
                <option value="allTime">All Time</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
            </div>
            <button
              onClick={() => alert("Export functionality would be implemented here")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 flex items-center"
            >
              <FaDownload className="mr-2" /> Export Report
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="bg-white shadow-sm mb-6 p-6 mx-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Key Recruitment Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Applicants"
                value={totalApplicants.toString()}
                subValue={`${applicants.filter(a => {
                  const date = new Date(a.applied_date);
                  const now = new Date();
                  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
                  return date >= thirtyDaysAgo;
                }).length} in last 30 days`}
                icon="users"
              />
              <StatCard
                title="Hire Rate"
                value={`${hireRate}%`}
                subValue={`${hiredApplicants} hired of ${totalApplicants}`}
                icon="chart"
              />
              <StatCard
                title="Active Jobs"
                value={activeJobs.toString()}
                subValue={`${totalJobs} total jobs`}
                icon="briefcase"
              />
              <StatCard
                title="Avg. Time to Hire"
                value={`${Math.round(avgTimeToHire)} days`}
                subValue="From application to offer"
                icon="clock"
              />
            </div>
          </div>

          {/* Recruitment Funnel */}
          <div className="bg-white shadow-sm mb-6 p-6 mx-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Recruitment Funnel</h2>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                    Funnel Conversion
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-600">
                    {hireRate}%
                  </span>
                </div>
              </div>
              <div className="flex h-4 mb-4 overflow-hidden rounded-full bg-gray-200">
                <div className="flex flex-col justify-center rounded-full overflow-hidden bg-yellow-500 text-xs text-white text-center whitespace-nowrap transition duration-500 w-full" style={{ width: "100%" }}>
                  <div className="flex">
                    <div className="bg-yellow-500 h-4" style={{ width: "100%" }} title="Applications"></div>
                    <div className="bg-blue-500 h-4" style={{ width: `${applicants.filter(a => a.status === 'interviewing').length / totalApplicants * 100}%` }} title="Interviews"></div>
                    <div className="bg-green-500 h-4" style={{ width: `${hiredApplicants / totalApplicants * 100}%` }} title="Hired"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Applications ({totalApplicants})</span>
                <span>Interviews ({applicants.filter(a => a.status === 'interviewing').length})</span>
                <span>Hired ({hiredApplicants})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Application Sources</h3>
                <div className="space-y-2">
                  {mockSourceData.map((source, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm">
                        <span>{source.source}</span>
                        <span>{source.count} ({source.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${source.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Time to Hire Trend</h3>
                <div className="h-48 flex items-end justify-between">
                  {mockTimeToHireData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="bg-indigo-600 w-8 rounded-t" style={{ height: `${(item.days / 30) * 100}%` }}></div>
                      <div className="text-xs mt-1">{item.month}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Top Skills in Demand</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>JavaScript</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>React</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>TypeScript</span>
                      <span>52%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "52%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Node.js</span>
                      <span>48%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "48%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Python</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diversity Metrics */}
          <div className="bg-white shadow-sm mb-6 p-6 mx-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Diversity & Inclusion Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Gender Distribution</h3>
                <div className="space-y-2 mt-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Male</span>
                      <span>{mockDiversityData.gender.male}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${mockDiversityData.gender.male}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Female</span>
                      <span>{mockDiversityData.gender.female}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div className="bg-pink-500 h-2.5 rounded-full" style={{ width: `${mockDiversityData.gender.female}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Other</span>
                      <span>{mockDiversityData.gender.other}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${mockDiversityData.gender.other}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Ethnicity Distribution</h3>
                <div className="space-y-2 mt-4">
                  {Object.entries(mockDiversityData.ethnicity).map(([key, value], index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm">
                        <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div className={`bg-indigo-${300 + index * 100} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Age Distribution</h3>
                <div className="space-y-2 mt-4">
                  {Object.entries(mockDiversityData.age).map(([key, value], index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm">
                        <span>{key}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${value}%`, opacity: 0.4 + (index * 0.15) }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recruiter Performance */}
          <div className="bg-white shadow-sm mb-6 p-6 mx-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Recruiter Performance</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recruiter
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Positions Filled
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Time to Fill
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interviews Conducted
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Offer Acceptance Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-800 font-medium">JD</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">John Doe</div>
                          <div className="text-sm text-gray-500">Technical Recruiter</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">12</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">18 days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">45</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">85%</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                          <span className="text-pink-800 font-medium">JS</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                          <div className="text-sm text-gray-500">Senior Recruiter</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">15</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">15 days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">52</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">92%</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-800 font-medium">RJ</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Robert Johnson</div>
                          <div className="text-sm text-gray-500">HR Specialist</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">8</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">22 days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">30</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">78%</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TalentInsights; 