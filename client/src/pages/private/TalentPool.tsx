import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaSearch, FaFilter, FaPlus, FaTags, FaUserPlus, FaFileDownload, FaFileUpload } from "react-icons/fa";
import { Applicant } from "../../domains/recruitment/types/applicant";
import { applicantService } from "../../domains/recruitment/services/recruitment";
import handleApiError from "../../core/utils/handleApiError";
import StatCard from "../../core/components/common/StatCard";

const TalentPool: React.FC = () => {
  const [candidates, setCandidates] = useState<Applicant[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Applicant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Applicant | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  // Fetch candidates
  const fetchCandidates = async () => {
    try {
      const { data } = await applicantService.getAll();
      setCandidates(data);
      applyFilters(data, searchQuery, statusFilter, skillFilter);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Apply filters
  const applyFilters = (
    candidatesData: Applicant[],
    search: string,
    status: string,
    skill: string
  ) => {
    let result = [...candidatesData];

    // Apply search filter
    if (search) {
      result = result.filter(
        (candidate) =>
          `${candidate.first_name} ${candidate.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
          candidate.email.toLowerCase().includes(search.toLowerCase()) ||
          candidate.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Apply status filter
    if (status !== "all") {
      result = result.filter((candidate) => candidate.status === status);
    }

    // Apply skill filter
    if (skill !== "all") {
      result = result.filter((candidate) => 
        candidate.skills?.some(s => s.toLowerCase() === skill.toLowerCase())
      );
    }

    setFilteredCandidates(result);
  };

  useEffect(() => {
    applyFilters(candidates, searchQuery, statusFilter, skillFilter);
  }, [searchQuery, statusFilter, skillFilter, candidates]);

  // Handle adding a note
  const handleAddNote = async () => {
    if (!selectedCandidate || !noteContent.trim()) return;
    
    try {
      // Refresh candidates
      await fetchCandidates();
      
      // Reset note form
      setNoteContent("");
      setIsAddingNote(false);
      
      toast.success("Note added successfully");
    } catch (error) {
      handleApiError(error);
    }
  };

  // Get all unique skills for filter
  const allSkills = ["all", ...new Set(
    candidates.flatMap(candidate => candidate.skills || [])
  )];

  return (
    <div className="max-w-full mx-auto bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white shadow-sm mb-6 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Talent Pool</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg border border-indigo-100 hover:bg-indigo-100"
            >
              {showAnalytics ? "Hide Analytics" : "Show Analytics"}
            </button>
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-200"
            >
              {viewMode === "grid" ? "List View" : "Grid View"}
            </button>
            <button
              onClick={() => toast.success("Import functionality would be implemented here")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 flex items-center"
            >
              <FaFileUpload className="mr-2" /> Import
            </button>
            <button
              onClick={() => toast.success("Add candidate functionality would be implemented here")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 flex items-center"
            >
              <FaUserPlus className="mr-2" /> Add Candidate
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      {showAnalytics && (
        <div className="bg-white shadow-sm mb-6 p-6 mx-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Talent Pool Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Candidates"
              value={candidates.length.toString()}
              subValue="In talent pool"
              icon="users"
            />
            <StatCard
              title="Active Candidates"
              value={candidates.filter(c => c.status !== 'rejected' && c.status !== 'hired').length.toString()}
              subValue="Available for roles"
              icon="users"
            />
            <StatCard
              title="Hired"
              value={candidates.filter(c => c.status === 'accepted').length.toString()}
              subValue="Successfully placed"
              icon="briefcase"
            />
            <StatCard
              title="New This Month"
              value={candidates.filter(c => {
                const date = new Date(c.applied_date);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length.toString()}
              subValue="Recent additions"
              icon="calendar"
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
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 pl-10 border rounded-lg"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
          </div>
          <div className="md:w-2/3 flex gap-2">
            <div className="relative flex-1">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 pl-10 border rounded-lg appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">New</option>
                <option value="interviewing">Interviewing</option>
                <option value="accepted">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
            </div>
            <div className="relative flex-1">
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full p-2 pl-10 border rounded-lg appearance-none"
              >
                <option value="all">All Skills</option>
                {allSkills.map(
                  (skill) =>
                    skill !== "all" && (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    )
                )}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaTags className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Display */}
      <div className="mx-6 mb-6">
        {viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCandidates.length === 0 ? (
              <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No candidates found matching your criteria</p>
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-lg">
                        {candidate.first_name[0]}{candidate.last_name[0]}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900">{candidate.first_name} {candidate.last_name}</h3>
                        <p className="text-sm text-gray-500">{candidate.email}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        candidate.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : candidate.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : candidate.status === "interviewing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {candidate.status.replace('_', ' ').charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Applied for:</span> {candidate.job_title || "Multiple Positions"}
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Applied on:</span> {new Date(candidate.applied_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            +{candidate.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(candidate.resume_path, '_blank');
                      }}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                      disabled={!candidate.resume_path}
                    >
                      View Resume
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCandidate(candidate);
                        setIsAddingNote(true);
                      }}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied For
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No candidates found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                            {candidate.first_name[0]}{candidate.last_name[0]}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{candidate.first_name} {candidate.last_name}</div>
                            <div className="text-sm text-gray-500">{candidate.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{candidate.job_title || "Multiple Positions"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            candidate.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : candidate.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : candidate.status === "interviewing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {candidate.status.replace('_', ' ').charAt(0).toUpperCase() + candidate.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills && candidate.skills.slice(0, 2).map((skill, index) => (
                            <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                          {candidate.skills && candidate.skills.length > 2 && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              +{candidate.skills.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(candidate.applied_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {candidate.resume_path && (
                            <button
                              onClick={() => window.open(candidate.resume_path, '_blank')}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Resume"
                            >
                              <FaFileDownload />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setIsAddingNote(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Add Note"
                          >
                            <FaPlus />
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
      </div>

      {/* Add Note Modal */}
      {isAddingNote && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Note for {selectedCandidate.first_name} {selectedCandidate.last_name}</h3>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4 h-32"
              placeholder="Enter your note here..."
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsAddingNote(false);
                  setNoteContent("");
                }}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && !isAddingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-xl">
                  {selectedCandidate.first_name[0]}{selectedCandidate.last_name[0]}
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold">{selectedCandidate.first_name} {selectedCandidate.last_name}</h2>
                  <p className="text-gray-600">{selectedCandidate.email}</p>
                  <p className="text-gray-600">{selectedCandidate.phone || "No phone provided"}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="md:col-span-1">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Basic Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 text-sm">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          selectedCandidate.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : selectedCandidate.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : selectedCandidate.status === "interviewing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedCandidate.status.replace('_', ' ').charAt(0).toUpperCase() + selectedCandidate.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Applied for:</span>
                      <span className="ml-2 text-gray-900">{selectedCandidate.job_title || "Multiple Positions"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Applied on:</span>
                      <span className="ml-2 text-gray-900">{new Date(selectedCandidate.applied_date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Location:</span>
                      <span className="ml-2 text-gray-900">{selectedCandidate.location || "Not specified"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills && selectedCandidate.skills.length > 0 ? (
                      selectedCandidate.skills.map((skill, index) => (
                        <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No skills listed</span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Documents</h3>
                  <div className="space-y-2">
                    {selectedCandidate.resume_path && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">Resume</span>
                        <button
                          onClick={() => window.open(selectedCandidate.resume_path, '_blank')}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          View
                        </button>
                      </div>
                    )}
                    {selectedCandidate.cover_letter_path && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">Cover Letter</span>
                        <button
                          onClick={() => window.open(selectedCandidate.cover_letter_path, '_blank')}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          View
                        </button>
                      </div>
                    )}
                    {(!selectedCandidate.resume_path && !selectedCandidate.cover_letter_path) && (
                      <span className="text-gray-500">No documents available</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Notes and Activity */}
              <div className="md:col-span-2">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">Notes</h3>
                    <button
                      onClick={() => setIsAddingNote(true)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                    >
                      <FaPlus className="mr-1" size={12} /> Add Note
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedCandidate.notes && selectedCandidate.notes.length > 0 ? (
                      selectedCandidate.notes.map((note, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-gray-200">
                          <div className="text-sm text-gray-900">{note.content}</div>
                          <div className="mt-2 flex justify-between text-xs text-gray-500">
                            <span>{note.created_by || "System"}</span>
                            <span>{new Date(note.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-center py-4">No notes available</div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Interview History</h3>
                  <div className="space-y-3">
                    {selectedCandidate.interviews && selectedCandidate.interviews.length > 0 ? (
                      selectedCandidate.interviews.map((interview, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-gray-200">
                          <div className="font-medium text-gray-900">{interview.type || "Interview"}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {new Date(interview.date).toLocaleString()}
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-gray-500">
                            <span>Interviewer: {interview.interviewer || "Not assigned"}</span>
                            <span className={`px-2 py-1 rounded-full ${
                              interview.status === "completed" ? "bg-green-100 text-green-800" :
                              interview.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {interview.status || "Pending"}
                            </span>
                          </div>
                          {interview.feedback && (
                            <div className="mt-2 text-sm">
                              <div className="font-medium text-gray-700">Feedback:</div>
                              <div className="text-gray-600">{interview.feedback}</div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-center py-4">No interview history</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentPool;