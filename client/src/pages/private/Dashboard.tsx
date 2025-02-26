import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import danielImage from "../../assets/daniel.png";
import VacancyTrends from "../../components/analytics/VacancyTrends";
import CalanderWidget from "../../components/dashboard/CalanderWidget";
import { getGreeting } from '../../utils/greetingUtils';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="font-sans px-6 py-4 bg-gray-100 min-h-screen space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {getGreeting()}, <span className="text-indigo-600">{user.first_name}</span> 👋
        </h1>
  
        {/* User Profile Link */}
        <Link to="/profile" className="flex items-center gap-4 p-4 border rounded-lg shadow bg-white cursor-pointer hover:shadow-lg transition">
          <div>
            <p className="text-sm font-semibold">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-gray-500">{user.company_name}</p>
          </div>
          <img src={danielImage} alt="User" className="ml-12 w-12 h-12 rounded-full" />
        </Link>
      </div>

      {/* Employee Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Employee Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InfoItem label="Department" value={user.department_name} />
          <InfoItem label="Team" value={user.team_name} />
          <InfoItem label="Job Title" value={user.job_title} />
          <InfoItem label="Job Level" value={user.job_level} />
          <InfoItem label="Employment Type" value={user.employment_type} />
          <InfoItem label="Company" value={user.company_name} />
        </div>
      </div>

      {/* Other Dashboard Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VacancyTrends />
        <CalanderWidget />
      </div>
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Employees</p>
          <p className="text-3xl font-bold">418</p>
          <p className="text-green-600 text-sm">+7% last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">New Employees</p>
          <p className="text-3xl font-bold">21</p>
          <p className="text-green-600 text-sm">+2% last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Resigned Employees</p>
          <p className="text-3xl font-bold">14</p>
          <p className="text-green-600 text-sm">+4% last month</p>
        </div>
      </div>

      {/* Upcoming Interview Section */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-bold">Upcoming Interview</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={danielImage} alt="Candidate" className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-semibold">James Hatt</p>
              <p className="text-sm text-gray-500">Lead Designer</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p>11:30 AM - 12:45 AM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p>StreamlineHR</p>
            </div>
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-md">
              View Details
            </button>
          </div>
        </div>
      </div>
      {/* Candidate Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Candidates</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left text-indigo-600 text-sm">
              <th className="py-2">Candidate Name</th>
              <th className="py-2">Title</th>
              <th className="py-2">Email</th>
              <th className="py-2">Created At</th>
              <th className="py-2">LinkedIn</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {[
              {
                id: 1,
                first_name: "Kevin",
                last_name: "Michel",
                email: "kevmichel@gmail.com",
                title: "Sr. Developer",
                created_at: "2023-01-01T12:00:00Z",
                linkedin_url_path: "https://linkedin.com/in/kevinmichel",
              },
              {
                id: 2,
                first_name: "Tanisha",
                last_name: "Combs",
                email: "tanicom@gmail.com",
                title: "Jr. UX Designer",
                created_at: "2023-01-02T12:00:00Z",
                linkedin_url_path: "https://linkedin.com/in/tanishacombs",
              },
              {
                id: 3,
                first_name: "Aron",
                last_name: "Armstrong",
                email: "armsaron@gmail.com",
                title: "Mid. QA Automation",
                created_at: "2023-01-03T12:00:00Z",
                linkedin_url_path: "https://linkedin.com/in/aronarmstrong",
              },
              {
                id: 4,
                first_name: "Josh",
                last_name: "Wiggins",
                email: "wiggijo@gmail.com",
                title: "Sr. Analytics",
                created_at: "2023-01-04T12:00:00Z",
                linkedin_url_path: "https://linkedin.com/in/joshwiggins",
              },
              {
                id: 5,
                first_name: "Sumaya",
                last_name: "Oneill",
                email: "sumone@gmail.com",
                title: "Sr. Copywriter",
                created_at: "2023-01-05T12:00:00Z",
                linkedin_url_path: "https://linkedin.com/in/sumayaoneill",
              },
            ].map((candidate, index) => (
              <tr
                key={candidate.id}
                className={index % 2 === 0 ? "bg-white" : "bg-indigo-100"}
              >
                <td className="py-2 px-4">
                  {candidate.first_name} {candidate.last_name}
                </td>
                <td className="py-2 px-4">{candidate.title}</td>
                <td className="py-2 px-4">{candidate.email}</td>
                <td className="py-2 px-4">
                  {new Date(candidate.created_at).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  <a
                    href={candidate.linkedin_url_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    LinkedIn
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper component for displaying info items
const InfoItem = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <h3 className="text-gray-600">{label}</h3>
    <p className="font-medium">{value || 'N/A'}</p>
  </div>
);

export default Dashboard;