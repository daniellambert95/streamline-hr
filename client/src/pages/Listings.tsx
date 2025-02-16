import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface JobListing {
  id: number;
  title: string;
  company: string;
  location: string;
}

const Listings = () => {
  const [listings, setListings] = useState<JobListing[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        if (!token) {
          setError('You must be logged in to view job listings.');
          return;
        }

        const response = await fetch('http://localhost:3000/api/jobs', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch job listings');
        }

        const data = await response.json();
        setListings(data);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Unable to fetch job listings.');
      }
    };

    fetchListings();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Job Listings</h1>
      {listings.length > 0 ? (
        <ul className="space-y-4">
          {listings.map((job) => (
            <li key={job.id} className="p-4 border rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p>
                {job.company} - {job.location}
              </p>
              <Link to={`/applicants/${job.id}`} className="text-blue-500 hover:underline">
                View Applicants
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No job listings available.</p>
      )}
    </div>
  );
};

export default Listings;