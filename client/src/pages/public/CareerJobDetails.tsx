// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { JobListing } from '../../domains/recruitment/types/job';
// import { jobService } from '../../domains/recruitment/services/recruitment';
// import JobApplicationForm from '../../domains/recruitment/components/public/JobApplicationForm';
// import handleApiError from '../../core/utils/handleApiError';
// import LoadingSpinner from '../../core/components/common/LoadingSpinner';
// import CompanyLogo from '../../core/components/common/CompanyLogo';

// const CareerJobDetails: React.FC = () => {
//   const { companyName, jobId, jobSlug } = useParams<{ 
//     companyName?: string;
//     jobId: string; 
//     jobSlug: string 
//   }>();
//   const [job, setJob] = useState<JobListing | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showApplicationForm, setShowApplicationForm] = useState(false);
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

//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       try {
//         setLoading(true);
        
//         // If companyName is provided, use it to fetch company-specific job
//         const { data } = companyName 
//           ? await jobService.getCompanyPublicJobById(companyName, jobId)
//           : await jobService.getPublicJobById(jobId);
        
//         // Verify the job is open and the slug matches
//         if (data.status !== 'open') {
//           setError('This position is no longer available.');
//           return;
//         }
        
//         // Optional: Verify the slug matches for SEO purposes
//         const correctSlug = data.title.toLowerCase().replace(/\s+/g, '-');
//         if (jobSlug !== correctSlug) {
//           // You could redirect to the correct URL here
//           console.warn('URL slug mismatch, but continuing to show job');
//         }
        
//         setJob(data);
//       } catch (error) {
//         handleApiError(error);
//         setError('Unable to load job details. This position may no longer be available.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobDetails();
//   }, [companyName, jobId, jobSlug]);

//   const handleApplyClick = () => {
//     setShowApplicationForm(true);
//     // Smooth scroll to the application form
//     setTimeout(() => {
//       document.getElementById('application-form')?.scrollIntoView({ 
//         behavior: 'smooth' 
//       });
//     }, 100);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <LoadingSpinner size="large" />
//       </div>
//     );
//   }

//   if (error || !job) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
//         <div className="text-center max-w-md">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">
//             {error || 'Job Not Found'}
//           </h1>
//           <p className="text-gray-600 mb-6">
//             The job you're looking for is no longer available or has been removed.
//           </p>
//           <Link 
//             to="/careers" 
//             className="inline-block bg-indigo-600 text-white px-5 py-3 rounded-md font-medium hover:bg-indigo-700"
//           >
//             View All Open Positions
//           </Link>
//         </div>
//       </div>
//     );
//   }

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
//               <Link to="/careers" className="text-gray-600 hover:text-gray-900">
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

//       {/* Job Details */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Job Header */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
//                       {job.employment_type || 'Full-time'}
//                     </span>
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//                       {job.location}
//                     </span>
//                     {job.department && (
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
//                         {job.department}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="mt-4 md:mt-0">
//                   <button
//                     onClick={handleApplyClick}
//                     className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
//                   >
//                     Apply Now
//                   </button>
//                 </div>
//               </div>
//               <div className="mt-4 text-sm text-gray-500">
//                 Posted on {new Date(job.created_at).toLocaleDateString()}
//               </div>
//             </div>

//             {/* Job Description */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
//               <div className="prose prose-indigo max-w-none">
//                 <div dangerouslySetInnerHTML={{ __html: job.description || 'No description provided.' }} />
//               </div>
//             </div>

//             {/* Requirements */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
//               <div className="prose prose-indigo max-w-none">
//                 <div dangerouslySetInnerHTML={{ __html: job.requirements || 'No specific requirements listed.' }} />
//               </div>
//             </div>

//             {/* Benefits (if available) */}
//             {job.benefits && (
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
//                 <div className="prose prose-indigo max-w-none">
//                   <div dangerouslySetInnerHTML={{ __html: job.benefits }} />
//                 </div>
//               </div>
//             )}

//             {/* Application Form */}
//             {showApplicationForm && (
//               <div id="application-form" className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply for this Position</h2>
//                 <JobApplicationForm 
//                   jobId={job.id} 
//                   jobTitle={job.title}
//                   onSuccess={() => {
//                     toast.success('Your application has been submitted successfully!');
//                     setShowApplicationForm(false);
//                     window.scrollTo({ top: 0, behavior: 'smooth' });
//                   }}
//                 />
//               </div>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Job Summary */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h2>
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Location</h3>
//                   <p className="mt-1 text-sm text-gray-900">{job.location}</p>
//                 </div>
//                 {job.department && (
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-500">Department</h3>
//                     <p className="mt-1 text-sm text-gray-900">{job.department}</p>
//                   </div>
//                 )}
//                 {job.employment_type && (
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-500">Employment Type</h3>
//                     <p className="mt-1 text-sm text-gray-900">{job.employment_type}</p>
//                   </div>
//                 )}
//                 {job.salary_range && (
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-500">Salary Range</h3>
//                     <p className="mt-1 text-sm text-gray-900">{job.salary_range}</p>
//                   </div>
//                 )}
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Posted On</h3>
//                   <p className="mt-1 text-sm text-gray-900">{new Date(job.created_at).toLocaleDateString()}</p>
//                 </div>
//               </div>
//               <div className="mt-6">
//                 <button
//                   onClick={handleApplyClick}
//                   className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
//                 >
//                   Apply Now
//                 </button>
//               </div>
//             </div>

//             {/* Company Info */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">About {companyInfo.name}</h2>
//               <p className="text-sm text-gray-600 mb-4">
//                 Join our team and be part of a dynamic and innovative company that values talent and promotes growth.
//               </p>
//               <div className="flex space-x-4 mt-4">
//                 {Object.entries(companyInfo.socialLinks).map(([platform, url]) => (
//                   <a 
//                     key={platform}
//                     href={url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-gray-400 hover:text-gray-500"
//                   >
//                     <span className="sr-only">{platform}</span>
//                     <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                       <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
//                     </svg>
//                   </a>
//                 ))}
//               </div>
//             </div>

//             {/* Similar Jobs */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h2>
//               <div className="space-y-4">
//                 <p className="text-sm text-gray-500">
//                   Check out other opportunities at {companyInfo.name}
//                 </p>
//                 <Link 
//                   to="/careers" 
//                   className="block text-indigo-600 hover:text-indigo-500 font-medium text-sm"
//                 >
//                   View all open positions →
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white mt-12">
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

// export default CareerJobDetails; 