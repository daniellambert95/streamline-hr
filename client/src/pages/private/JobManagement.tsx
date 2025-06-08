import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaPlus, FaFilter, FaSearch, FaEdit, FaTrash, FaEye, FaCopy } from "react-icons/fa";
import { JobListing } from "../../domains/recruitment/types/job";
import { jobService } from "../../domains/recruitment/services/recruitment";
import handleApiError from "../../core/utils/handleApiError";
import NewJobListingModal from '../../domains/recruitment/components/NewJobListingForm';
import JobViewModal from '../../domains/recruitment/components/JobViewModal';
import StatCard from "../../core/components/common/StatCard";

const JobManagement: React.FC = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([]);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [isViewJobModalOpen, setIsViewJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showAnalytics, setShowAnalytics] = useState(true);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const { data } = await jobService.getAll();
      setJobs(data);
      applyFilters(data, searchQuery, statusFilter, departmentFilter);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Apply filters
  const applyFilters = (
    jobsData: JobListing[],
    search: string,
    status: string,
    department: string
  ) => {
    let result = [...jobsData];

    // Apply search filter
    if (search) {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.description?.toLowerCase().includes(search.toLowerCase()) ||
          job.location?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status !== "all") {
      result = result.filter((job) => job.status === status);
    }

    // Apply department filter
    if (department !== "all") {
      result = result.filter((job) => job.department === department);
    }

    setFilteredJobs(result);
  };

  useEffect(() => {
    applyFilters(jobs, searchQuery, statusFilter, departmentFilter);
  }, [searchQuery, statusFilter, departmentFilter, jobs]);

  // Handle job creation
  const handleJobCreated = async () => {
    await fetchJobs();
    setIsNewJobModalOpen(false);
    toast.success("Job listing created successfully");
  };

  // Handle job status change
  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await jobService.updateStatus(jobId, newStatus);
      await fetchJobs();
      toast.success(`Job status updated to ${newStatus}`);
    } catch (error) {
      handleApiError(error);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId: number) => {
    if (window.confirm("Are you sure you want to delete this job listing?")) {
      try {
        await jobService.delete(jobId);
        await fetchJobs();
        toast.success("Job listing deleted successfully");
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  // Get unique departments for filter
  const departments = ["all", ...new Set(jobs.map((job) => job.department).filter(Boolean))];

  return (
    <div className="max-w-full mx-auto bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white shadow-sm mb-6 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Job Management</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg border border-indigo-100 hover:bg-indigo-100"
            >
              {showAnalytics ? "Hide Analytics" : "Show Analytics"}
            </button>
            <button
              onClick={() => setIsNewJobModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 flex items-center"
            >
              <FaPlus className="mr-2" /> New Job
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      {showAnalytics && (
        <div className="bg-white shadow-sm mb-6 p-6 mx-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Job Analytics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Jobs"
              value={jobs.length.toString()}
              subValue="All job listings"
              icon="briefcase"
            />
            <StatCard
              title="Active Jobs"
              value={jobs.filter(job => job.status === 'open').length.toString()}
              subValue="Currently accepting applications"
              icon="users"
            />
            <StatCard
              title="Total Applications"
              value={jobs.reduce((sum, job) => sum + (job.candidates_count || 0), 0).toString()}
              subValue="Across all jobs"
              icon="users"
            />
            <StatCard
              title="Avg. Time to Fill"
              value="18 days"
              subValue="Last 30 days"
              icon="clock"
            />
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white shadow-sm mb-6 p-4 mx-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 pl-10 border rounded-lg"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
          </div>
          <div className="md:w-1/3 flex gap-2">
            <div className="relative flex-1">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 pl-10 border rounded-lg appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
            </div>
            <div className="relative flex-1">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full p-2 pl-10 border rounded-lg appearance-none"
              >
                <option value="all">All Departments</option>
                {departments.map(
                  (dept) =>
                    dept !== "all" && (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    )
                )}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white shadow-sm mx-6 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No job listings found
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.type || "Full-time"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.department || "—"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.location || "Remote"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.status === "open"
                            ? "bg-green-100 text-green-800"
                            : job.status === "closed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.candidates_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setIsViewJobModalOpen(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Job"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setIsNewJobModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Job"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id as unknown as number)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Job"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => {
                            // Clone job functionality would go here
                            toast.success("Job cloned! Edit the new job details.");
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Clone Job"
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Job Modal */}
      <NewJobListingModal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
        onSuccess={handleJobCreated}
      />

      {/* View Job Modal */}
      {selectedJob && (
        <JobViewModal
          isOpen={isViewJobModalOpen}
          onClose={() => setIsViewJobModalOpen(false)}
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

export default JobManagement; 