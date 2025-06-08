import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import handleApiError from "../../core/utils/handleApiError.ts";
import { JobListing } from "../../domains/recruitment/types/job.ts";
import { Applicant } from "../../domains/recruitment/types/applicant.ts";
import NewJobListingModal from '../../domains/recruitment/components/NewJobListingForm.tsx';
import JobViewModal from '../../domains/recruitment/components/JobViewModal.tsx';
import { applicantService, jobService } from "../../domains/recruitment/services/recruitment.ts";
import StatCard from "../../core/components/common/StatCard.tsx";

const Recruitment: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<JobListing[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJobViewModalOpen, setIsJobViewModalOpen] = useState(false);
  const [jobFilter, setJobFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const fetchListings = async () => {
    try {
      const { data } = await jobService.getAll();
      setListings(data);
      
      // Select the first job by default if none is selected
      if (!selectedJob && data.length > 0) {
        setSelectedJob(data[0]);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchApplicants = async () => {
    try {
      const response = await applicantService.getAll();
      setApplicants(response.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchApplicants();
    
    const fetchCurrentUser = async () => {
      try {
        // Replace with your actual user service call
        const response = await fetch('/api/v1/users/me');
        const userData = await response.json();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  const handleJobCreated = async () => {
    await fetchListings();
    setIsModalOpen(false);
    toast.success('Job listing created successfully');
  };

  const handleViewJob = (job: JobListing) => {
    setSelectedJob(job);
  };

  const handleOpenJobModal = (job: JobListing) => {
    setSelectedJob(job);
    setIsJobViewModalOpen(true);
    // Update URL without page reload
    window.history.pushState(
      {}, 
      '', 
      `/jobs/${job.title.toLowerCase().replace(/\s+/g, '-')}/${new Date(job.created_at).toISOString().split('T')[0]}`
    );
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await jobService.updateStatus(jobId, newStatus);
      await fetchListings();
      toast.success(`Job status updated to ${newStatus}`);
    } catch (error) {
      handleApiError(error);
    }
  };

  // Get applicants for the selected job
  const selectedJobApplicants = applicants.filter(
    app => selectedJob && app.job_listing_id.toString() === selectedJob.id
  );

  // Group applicants by status for kanban view
  const applicantsByStatus = {
    new: selectedJobApplicants.filter(a => a.status === 'pending' || a.status === 'under_review'),
    interviewing: selectedJobApplicants.filter(a => a.status === 'interviewing'),
    accepted: selectedJobApplicants.filter(a => a.status === 'accepted'),
    rejected: selectedJobApplicants.filter(a => a.status === 'rejected')
  };

  // Filter jobs based on status and search query
  const filteredJobs = listings.filter(job => {
    const matchesStatus = 
      jobFilter === 'all' ? true : 
      jobFilter === 'my-jobs' ? (job.recruiter_id === currentUser?.id) :
      job.status === jobFilter;
      
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         job.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.department?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-full mx-auto bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white shadow-sm mb-6 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Recruitment</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg border border-indigo-100 hover:bg-indigo-100"
            >
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
            >
              + New Job
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Overview (collapsible) */}
      {showAnalytics && (
        <div className="bg-white shadow-sm mb-6 p-6 mx-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Analytics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Open Positions"
              value={listings.filter(job => job.status === 'open').length.toString()}
              subValue="Active listings"
              icon="users"
            />
            <StatCard
              title="Total Applications"
              value={listings.reduce((sum, job) => sum + (job.candidates_count || 0), 0).toString()}
              subValue="Across all jobs"
              icon="users"
            />
            <StatCard
              title="Avg. Applications"
              value={(listings.length ? Math.round(listings.reduce((sum, job) => sum + (job.candidates_count || 0), 0) / listings.length) : 0).toString()}
              subValue="Per job listing"
              icon="growth"
            />
            <StatCard
              title="Acceptance Rate"
              value={applicants.length > 0 
                ? Math.round((applicants.filter(a => a.status === 'accepted').length / applicants.length) * 100)
                : 0 + "%"}
              subValue="Overall success rate"
              icon="users"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 px-6">
        {/* Left Panel - Jobs List */}
        <div className="md:w-1/4 bg-white rounded-lg shadow-sm p-4">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 pl-8 border rounded"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex mb-4 overflow-x-auto py-1">
            <button
              onClick={() => setJobFilter('all')}
              className={`px-3 py-1 text-sm rounded-full mr-2 whitespace-nowrap ${
                jobFilter === 'all' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => setJobFilter('my-jobs')}
              className={`px-3 py-1 text-sm rounded-full mr-2 whitespace-nowrap ${
                jobFilter === 'my-jobs' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              My Jobs
            </button>
            <button
              onClick={() => setJobFilter('open')}
              className={`px-3 py-1 text-sm rounded-full mr-2 whitespace-nowrap ${
                jobFilter === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setJobFilter('closed')}
              className={`px-3 py-1 text-sm rounded-full mr-2 whitespace-nowrap ${
                jobFilter === 'closed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              Closed
            </button>
          </div>
          
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)]">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No jobs found</div>
            ) : (
              filteredJobs.map((job) => (
                <div 
                  key={job.id}
                  onClick={() => handleViewJob(job)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedJob && selectedJob.id === job.id 
                      ? 'border-indigo-300 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      job.status === 'open' ? 'bg-green-100 text-green-800' :
                      job.status === 'closed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500 flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location || 'Remote'}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-medium">
                      {job.candidates_count || 0} applicants
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Selected Job & Candidates */}
        <div className="md:w-3/4 bg-white rounded-lg shadow-sm p-4">
          {!selectedJob ? (
            <div className="flex flex-col items-center justify-center h-64">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2 text-gray-500">Select a job to view candidates</p>
            </div>
          ) : (
            <>
              {/* Job Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedJob.title}</h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="mr-3">{selectedJob.location}</span>
                    {selectedJob.department && (
                      <span className="mr-3">{selectedJob.department}</span>
                    )}
                    <span>{selectedJob.type || 'Full-time'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')}
                    className="bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200"
                    title={viewMode === 'kanban' ? 'Switch to list view' : 'Switch to kanban view'}
                  >
                    {viewMode === 'kanban' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenJobModal(selectedJob)}
                    className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded border border-indigo-200 hover:bg-indigo-200"
                  >
                    Edit Job
                  </button>
                  <button
                    onClick={async () => {
                      const newStatus = selectedJob.status === 'open' ? 'closed' : 'open';
                      await handleStatusChange(selectedJob.id, newStatus);
                    }}
                    className={`px-3 py-1 rounded border ${
                      selectedJob.status === 'open' 
                        ? 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200' 
                        : 'bg-green-100 text-green-600 border-green-200 hover:bg-green-200'
                    }`}
                  >
                    {selectedJob.status === 'open' ? 'Close Job' : 'Reopen Job'}
                  </button>
                </div>
              </div>

              {/* View Toggle and Stats */}
              <div className="mb-4 flex justify-between">
                <div className="flex space-x-4">
                  <div className="bg-indigo-50 rounded-lg p-2 flex items-center">
                    <span className="text-indigo-700 font-medium mr-1">{selectedJobApplicants.length}</span>
                    <span className="text-indigo-500 text-sm">Total Applicants</span>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-2 flex items-center">
                    <span className="text-blue-700 font-medium mr-1">{applicantsByStatus.new.length}</span>
                    <span className="text-blue-500 text-sm">New</span>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-2 flex items-center">
                    <span className="text-yellow-700 font-medium mr-1">{applicantsByStatus.interviewing.length}</span>
                    <span className="text-yellow-500 text-sm">Interviewing</span>
                  </div>
                </div>
              </div>

              {viewMode === 'kanban' ? (
                // Kanban View
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* New Column */}
                  <div className="bg-gray-50 rounded-lg p-3 h-[calc(100vh-300px)] overflow-y-auto">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                      <div className="bg-blue-100 w-3 h-3 rounded-full mr-2"></div>
                      New
                      <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {applicantsByStatus.new.length}
                      </span>
                    </h3>
                    
                    <div className="space-y-3">
                      {applicantsByStatus.new.map(applicant => (
                        <div key={applicant.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{applicant.first_name} {applicant.last_name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{applicant.email}</p>
                            </div>
                            {/* AI Score Indicator (placeholder for future feature) */}
                            <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
                              94% Match
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between text-sm">
                            <span className="text-gray-500">
                              {new Date(applicant.applied_date).toLocaleDateString()}
                            </span>
                            <div className="flex space-x-2">
                              {applicant.resume_path && (
                                <button 
                                  onClick={() => window.open(applicant.resume_path, '_blank')}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  Resume
                                </button>
                              )}
                              <button
                                onClick={() => navigate(`/applicants/${applicant.id}`)}
                                className="text-indigo-600 hover:text-indigo-800"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {applicantsByStatus.new.length === 0 && (
                        <div className="text-center py-4 text-gray-400 bg-gray-50 rounded">
                          No new applicants
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interviewing Column */}
                  <div className="bg-gray-50 rounded-lg p-3 h-[calc(100vh-300px)] overflow-y-auto">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                      <div className="bg-yellow-100 w-3 h-3 rounded-full mr-2"></div>
                      Interviewing
                      <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {applicantsByStatus.interviewing.length}
                      </span>
                    </h3>
                    
                    <div className="space-y-3">
                      {applicantsByStatus.interviewing.map(applicant => (
                        <div key={applicant.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{applicant.first_name} {applicant.last_name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{applicant.email}</p>
                            </div>
                            {/* AI Score Indicator (placeholder for future feature) */}
                            <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
                              87% Match
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between text-sm">
                            <span className="text-gray-500">
                              {new Date(applicant.applied_date).toLocaleDateString()}
                            </span>
                            <div className="flex space-x-2">
                              {applicant.resume_path && (
                                <button 
                                  onClick={() => window.open(applicant.resume_path, '_blank')}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  Resume
                                </button>
                              )}
                              <button
                                onClick={() => navigate(`/applicants/${applicant.id}`)}
                                className="text-indigo-600 hover:text-indigo-800"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {applicantsByStatus.interviewing.length === 0 && (
                        <div className="text-center py-4 text-gray-400 bg-gray-50 rounded">
                          No applicants in interview stage
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Accepted Column */}
                  <div className="bg-gray-50 rounded-lg p-3 h-[calc(100vh-300px)] overflow-y-auto">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                      <div className="bg-green-100 w-3 h-3 rounded-full mr-2"></div>
                      Accepted
                      <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {applicantsByStatus.accepted.length}
                      </span>
                    </h3>
                    
                    <div className="space-y-3">
                      {applicantsByStatus.accepted.map(applicant => (
                        <div key={applicant.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{applicant.first_name} {applicant.last_name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{applicant.email}</p>
                            </div>
                            {/* AI Score Indicator (placeholder for future feature) */}
                            <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
                              96% Match
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between text-sm">
                            <span className="text-gray-500">
                              {new Date(applicant.applied_date).toLocaleDateString()}
                            </span>
                            <div className="flex space-x-2">
                              {applicant.resume_path && (
                                <button 
                                  onClick={() => window.open(applicant.resume_path, '_blank')}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  Resume
                                </button>
                              )}
                              <button
                                onClick={() => navigate(`/applicants/${applicant.id}`)}
                                className="text-indigo-600 hover:text-indigo-800"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {applicantsByStatus.accepted.length === 0 && (
                        <div className="text-center py-4 text-gray-400 bg-gray-50 rounded">
                          No accepted applicants
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rejected Column */}
                  <div className="bg-gray-50 rounded-lg p-3 h-[calc(100vh-300px)] overflow-y-auto">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                      <div className="bg-red-100 w-3 h-3 rounded-full mr-2"></div>
                      Rejected
                      <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {applicantsByStatus.rejected.length}
                      </span>
                    </h3>
                    
                    <div className="space-y-3">
                      {applicantsByStatus.rejected.map(applicant => (
                        <div key={applicant.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{applicant.first_name} {applicant.last_name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{applicant.email}</p>
                            </div>
                            {/* AI Score Indicator (placeholder for future feature) */}
                            <div className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-medium">
                              45% Match
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between text-sm">
                            <span className="text-gray-500">
                              {new Date(applicant.applied_date).toLocaleDateString()}
                            </span>
                            <div className="flex space-x-2">
                              {applicant.resume_path && (
                                <button 
                                  onClick={() => window.open(applicant.resume_path, '_blank')}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  Resume
                                </button>
                              )}
                              <button
                                onClick={() => navigate(`/applicants/${applicant.id}`)}
                                className="text-indigo-600 hover:text-indigo-800"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {applicantsByStatus.rejected.length === 0 && (
                        <div className="text-center py-4 text-gray-400 bg-gray-50 rounded">
                          No rejected applicants
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Applied Date</th>
                        <th className="py-3 px-4 text-left">Match Score</th>
                        <th className="py-3 px-4 text-left">Latest Note</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedJobApplicants.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 px-4 text-center text-gray-500">
                            No applicants found for this job listing
                          </td>
                        </tr>
                      ) : (
                        selectedJobApplicants.map((applicant) => (
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
                              {/* Placeholder for AI match score */}
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2.5">
                                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                                <span className="ml-2 text-sm text-gray-700">85%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-gray-900">
                                {applicant.notes && applicant.notes.length > 0 ? (
                                  <div className="truncate max-w-xs">
                                    {applicant.notes[applicant.notes.length - 1].content}
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
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <NewJobListingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleJobCreated} 
      />

      {selectedJob && (
        <JobViewModal
          isOpen={isJobViewModalOpen}
          onClose={() => {
            setIsJobViewModalOpen(false);
            // Restore original URL when modal is closed
            window.history.pushState({}, '', '/recruitment');
          }}
          job={selectedJob}
          onStatusChange={async (newStatus: string) => {
            try {
              await handleStatusChange(selectedJob.id, newStatus);
            } catch (error) {
              handleApiError(error);
            }
          }}
        />
      )}
    </div>
  );
};

export default Recruitment;