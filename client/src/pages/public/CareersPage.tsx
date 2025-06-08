// import React, { useState, useEffect } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { JobListing } from '../../domains/recruitment/types/job';
// import { jobService } from '../../domains/recruitment/services/recruitment';
// import handleApiError from '../../core/utils/handleApiError';
// import LoadingSpinner from '../../core/components/common/LoadingSpinner';
// import CompanyLogo from '../../core/components/common/CompanyLogo';

// const CareersPage: React.FC = () => {
//   const { companyName } = useParams<{ companyName?: string }>();
//   const [jobs, setJobs] = useState<JobListing[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('all');
//   const [locationFilter, setLocationFilter] = useState('all');
//   const [companyInfo, setCompanyInfo] = useState({
//     name: 'recruitment',
//     logo: '/logo.png',
//     website: 'https://recruitment.com',
//     socialLinks: {
//       linkedin: 'https://linkedin.com/company/recruitment',
//       twitter: 'https://twitter.com/recruitment',
//       facebook: 'https://facebook.com/recruitment'
//     }
//   });

//   // Derived state for unique departments and locations
//   const departments = [...new Set(jobs.map(job => job.department).filter(Boolean))];
//   const locations = [...new Set(jobs.map(job => job.location).filter(Boolean))];

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         setLoading(true);
//         const { data } = await jobService.getPublicJobs();
//         // Only show open jobs
//         setJobs(data.filter(job => job.status === 'open'));
//       } catch (error) {
//         handleApiError(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   // Filter jobs based on search query and filters
//   const filteredJobs = jobs.filter(job => {
//     const matchesSearch = 
//       job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
//     const matchesDepartment = departmentFilter === 'all' || job.department === departmentFilter;
//     const matchesLocation = locationFilter === 'all' || job.location === locationFilter;
    
//     return matchesSearch && matchesDepartment && matchesLocation;
//   });

//   // Create job detail URL based on whether we're on a company-specific page
//   const createJobDetailUrl = (jobId: string, jobTitle: string) => {
//     const slug = jobTitle.toLowerCase().replace(/\s+/g, '-');
//     return companyName 
//       ? `/${companyName}/careers/${jobId}/${slug}`
//       : `/careers/${jobId}/${slug}`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Company Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex justify-between items-center">
//             <Link to="/careers" className="flex items-center space-x-3">
//               <CompanyLogo size="medium" />
//               <span className="text-xl font-semibold text-gray-900">{companyInfo.name}</span>
//             </Link>
//             <nav className="hidden md:flex space-x-6">
//               <Link to="/careers" className="text-indigo-600 font-medium">
//                 All Jobs
//               </Link>
//               <a href={companyInfo.website} className="text-gray-600 hover:text-gray-900">
//                 About Us
//               </a>
//               <a href="#" className="text-gray-600 hover:text-gray-900">
//                 Life at {companyInfo.name}
//               </a>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <div className="bg-indigo-700 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
//           <div className="max-w-3xl">
//             <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
//               Join Our Team
//             </h1>
//             <p className="mt-6 text-xl">
//               Discover your next career opportunity at {companyInfo.name}. We're looking for talented individuals to help us build the future of talent management.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Search and Filter Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-lg shadow-md p-6 -mt-12">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="md:col-span-2">
//               <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
//                 Search
//               </label>
//               <input
//                 type="text"
//                 id="search"
//                 placeholder="Search for jobs..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               />
//             </div>
            
//             <div>
//               <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
//                 Department
//               </label>
//               <select
//                 id="department"
//                 value={departmentFilter}
//                 onChange={(e) => setDepartmentFilter(e.target.value)}
//                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               >
//                 <option value="all">All Departments</option>
//                 {departments.map(dept => (
//                   <option key={dept} value={dept}>{dept}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
//                 Location
//               </label>
//               <select
//                 id="location"
//                 value={locationFilter}
//                 onChange={(e) => setLocationFilter(e.target.value)}
//                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               >
//                 <option value="all">All Locations</option>
//                 {locations.map(loc => (
//                   <option key={loc} value={loc}>{loc}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Job Listings */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">
//           {loading ? 'Loading open positions...' : 
//            filteredJobs.length === 0 ? 'No open positions found' : 
//            `${filteredJobs.length} Open Position${filteredJobs.length !== 1 ? 's' : ''}`}
//         </h2>

//         {loading ? (
//           <div className="flex justify-center py-12">
//             <LoadingSpinner size="large" />
//           </div>
//         ) : filteredJobs.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <p className="text-gray-500 mb-4">No jobs match your search criteria.</p>
//             <button
//               onClick={() => {
//                 setSearchQuery('');
//                 setDepartmentFilter('all');
//                 setLocationFilter('all');
//               }}
//               className="text-indigo-600 font-medium hover:text-indigo-500"
//             >
//               Clear all filters
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 gap-6">
//             {filteredJobs.map(job => (
//               <Link 
//                 key={job.id}
//                 to={createJobDetailUrl(job.id, job.title)}
//                 className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
//               >
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                   <div>
//                     <h3 className="text-xl font-semibold text-indigo-600">{job.title}</h3>
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {job.department && (
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//                           {job.department}
//                         </span>
//                       )}
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         {job.location}
//                       </span>
//                       {job.employment_type && (
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                           {job.employment_type}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="mt-4 md:mt-0">
//                     <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
//                       View Job
//                     </span>
//                   </div>
//                 </div>
//                 <div className="mt-4 text-sm text-gray-500">
//                   Posted on {new Date(job.created_at).toLocaleDateString()}
//                 </div>
//                 {job.description && (
//                   <div className="mt-4 text-sm text-gray-600 line-clamp-2">
//                     {job.description.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
//                   </div>
//                 )}
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Company Values Section */}
//       <div className="bg-gray-100 py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-3xl font-extrabold text-gray-900">Why Join Us?</h2>
//             <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
//               At {companyInfo.name}, we're building a culture where talented people thrive.
//             </p>
//           </div>

//           <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
//             <div className="bg-white overflow-hidden shadow rounded-lg">
//               <div className="px-4 py-5 sm:p-6">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
//                     <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
//                     </svg>
//                   </div>
//                   <div className="ml-5">
//                     <h3 className="text-lg font-medium text-gray-900">Innovation</h3>
//                     <p className="mt-2 text-sm text-gray-500">
//                       We're constantly pushing boundaries and exploring new ideas.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white overflow-hidden shadow rounded-lg">
//               <div className="px-4 py-5 sm:p-6">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
//                     <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                     </svg>
//                   </div>
//                   <div className="ml-5">
//                     <h3 className="text-lg font-medium text-gray-900">Collaboration</h3>
//                     <p className="mt-2 text-sm text-gray-500">
//                       We work together across teams to achieve our shared goals.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white overflow-hidden shadow rounded-lg">
//               <div className="px-4 py-5 sm:p-6">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
//                     <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
//                     </svg>
//                   </div>
//                   <div className="ml-5">
//                     <h3 className="text-lg font-medium text-gray-900">Flexibility</h3>
//                     <p className="mt-2 text-sm text-gray-500">
//                       We offer flexible work arrangements to support work-life balance.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div className="md:col-span-2">
//               <div className="flex items-center space-x-3 mb-4">
//                 <CompanyLogo variant="white" size="medium" />
//                 <span className="text-xl font-semibold">{companyInfo.name}</span>
//               </div>
//               <p className="text-gray-300 max-w-md">
//                 Join our team and help us build the future of talent management. We're always looking for passionate individuals to join our mission.
//               </p>
//             </div>
//             <div>
//               <h3 className="text-lg font-medium mb-4">Quick Links</h3>
//               <ul className="space-y-2">
//                 <li><Link to="/careers" className="text-gray-300 hover:text-white">All Jobs</Link></li>
//                 <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
//                 <li><a href="#" className="text-gray-300 hover:text-white">Our Team</a></li>
//                 <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-medium mb-4">Connect</h3>
//               <ul className="space-y-2">
//                 {Object.entries(companyInfo.socialLinks).map(([platform, url]) => (
//                   <li key={platform}>
//                     <a href={url} className="text-gray-300 hover:text-white capitalize">
//                       {platform}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
//             <p>© {new Date().getFullYear()} {companyInfo.name}. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default CareersPage; 