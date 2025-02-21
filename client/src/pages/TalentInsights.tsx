import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewJobListingModal from '../components/NewJobListingModal';
import { toast } from "react-hot-toast";
import VacancyTrends from '../components/VacancyTrends';

interface JobListing {
  id: number;
  title: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  status: 'open' | 'closed' | 'on-hold';
  created_at: string;
  candidates_count: number;
  salary: string;
}

interface ApplicantNote {
  id: number;
  content: string;
  created_at: string;
}

interface Applicant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  resume_path: string;
  cover_letter_path: string;
  linkedin_url: string;
  status: 'pending' | 'under_review' | 'interviewing' | 'accepted' | 'rejected';
  applied_date: string;
  job_listing_id: number;
  job_title: string;
  notes: ApplicantNote[];
}

interface ApplicantActivity {
  id: number;
  applicant_id: number;
  activity_type: string;
  old_value: string;
  new_value: string;
  created_at: string;
  applicant_name: string;
  job_title: string;
}

const TalentInsights: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('jobs');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listings, setListings] = useState<JobListing[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [recentActivity, setRecentActivity] = useState<ApplicantActivity[]>([]);

  const fetchListings = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:3000/api/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job listings');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setListings(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch job listings';
      console.error('Error fetching job listings:', error);
      toast.error(errorMessage);
    }
  };

  const fetchApplicants = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/jobs/applicants', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applicants');
      }

      const data = await response.json();
      setApplicants(data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      toast.error('Failed to load applicants');
    }
  };

  const fetchRecentActivity = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/jobs/applicant-activity', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recent activity');
      }

      const data = await response.json();
      setRecentActivity(data);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      toast.error('Failed to load recent activity');
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (activeTab === 'candidates' || activeTab === 'analytics') {
      fetchApplicants();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchRecentActivity();
    }
  }, [activeTab]);

  const handleJobCreated = async () => {
    await fetchListings();
    setIsModalOpen(false);
    toast.success('Job listing created successfully');
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-700">Talent Insights</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
        >
          + New Job
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b mt-6">
        <nav className="flex space-x-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'jobs' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('jobs')}
          >
            Jobs
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'candidates' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('candidates')}
          >
            Candidates
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'analytics' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'jobs' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">Job Title</th>
                  <th className="py-3 px-4 text-left">Location</th>
                  <th className="py-3 px-4 text-left">Candidates</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Created On</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((job, _index) => (
                  <tr key={job.id} className="border-t">
                    <td className="py-3 px-4">{job.title}</td>
                    <td className="py-3 px-4">{job.location}</td>
                    <td className="py-3 px-4">
                      <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                        {job.candidates_count}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        job.status === 'open' ? 'bg-green-200 text-green-800' :
                        job.status === 'closed' ? 'bg-red-200 text-red-800' :
                        'bg-yellow-200 text-yellow-800'
                      }`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 mr-2"
                        onClick={() => navigate(`/job/${job.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Position</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Applied Date</th>
                  <th className="py-3 px-4 text-left">Latest Note</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant) => (
                  <tr key={applicant.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {applicant.first_name} {applicant.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {applicant.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-900">{applicant.job_title}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${applicant.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                          applicant.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          applicant.status === 'interviewing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {applicant.status.replace('_', ' ').charAt(0).toUpperCase() + applicant.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(applicant.applied_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-900">
                        {applicant.notes && applicant.notes.length > 0 ? (
                          <div className="group relative">
                            <div className="truncate max-w-xs">
                              {applicant.notes[applicant.notes.length - 1].content}
                            </div>
                            <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white p-2 rounded shadow-lg -left-1 transform -translate-x-1/2 mt-1">
                              {applicant.notes.map((note, _index) => (
                                <div key={note.id} className="mb-2 last:mb-0">
                                  <div className="text-xs text-gray-400">
                                    {new Date(note.created_at).toLocaleDateString()}
                                  </div>
                                  <div className="text-sm">{note.content}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">No notes</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        {applicant.resume_path && (
                          <button 
                            onClick={() => window.open(applicant.resume_path, '_blank')}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                          >
                            Resume
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/applicants/${applicant.id}`)}
                          className="bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-600"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Active Jobs</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {listings.filter(job => job.status === 'open').length}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-full p-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-green-600 text-sm flex items-center">
                    <span className="font-medium">Active Listings</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Candidates</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {applicants.length}
                    </p>
                  </div>
                  <div className="bg-indigo-50 rounded-full p-3">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-blue-600 text-sm flex items-center">
                    <span className="font-medium">Across All Jobs</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Interview Stage</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {applicants.filter(a => a.status === 'interviewing').length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-full p-3">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15l.007-7.007M7 10l.011.011M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-yellow-600 text-sm flex items-center">
                    <span className="font-medium">Currently Interviewing</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Acceptance Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {applicants.length > 0 
                        ? Math.round((applicants.filter(a => a.status === 'accepted').length / applicants.length) * 100)
                        : 0}%
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-full p-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15l.007-7.007M7 10l.011.011M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-indigo-600 text-sm flex items-center">
                    <span className="font-medium">Overall Success Rate</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vacancy Trends Chart */}
              {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"> */}
                {/* <h3 className="text-lg font-semibold mb-6">Vacancy & Candidate Trends</h3> */}
                <div className="h-80">
                  <VacancyTrends />
                </div>
              {/* </div> */}

              {/* Status Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-6">Application Status Distribution</h3>
                <div className="space-y-4">
                  {['pending', 'under_review', 'interviewing', 'accepted', 'rejected'].map(status => {
                    const count = applicants.filter(a => a.status === status).length;
                    const percentage = applicants.length > 0 ? (count / applicants.length) * 100 : 0;
                    return (
                      <div key={status} className="relative">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize font-medium">{status.replace('_', ' ')}</span>
                          <span className="text-gray-600">{count} ({Math.round(percentage)}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              status === 'accepted' ? 'bg-green-500' :
                              status === 'rejected' ? 'bg-red-500' :
                              status === 'interviewing' ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map(activity => (
                  <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                    <div>
                      <p className="font-medium text-gray-900">{activity.applicant_name}</p>
                      <p className="text-sm text-gray-500">{activity.job_title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.activity_type === 'status_change' 
                          ? `Status changed from ${activity.old_value} to ${activity.new_value}`
                          : activity.activity_type.replace('_', ' ')}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <NewJobListingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleJobCreated} 
      />
    </div>
  );
};

export default TalentInsights;