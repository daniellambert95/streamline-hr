import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Applicant {
  id: number;
  name: string;
  email: string;
  score: number;
  resumeUrl: string;
  coverLetterUrl: string;
}

const Applicants = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  useEffect(() => {
    // Fetch applicants for a specific job from backend
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${apiUrl}/api/jobs/${jobId}/applicants`)
      .then((response) => response.json())
      .then((data) => setApplicants(data))
      .catch((error) => console.error('Error fetching applicants:', error));
  }, [jobId]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Applicants</h1>
      <ul className="space-y-4">
        {applicants.map((applicant) => (
          <li key={applicant.id} className="p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{applicant.name}</h2>
            <p>Email: {applicant.email}</p>
            <p>Score: {applicant.score}</p>
            <a href={applicant.resumeUrl} target="_blank" className="text-blue-500 hover:underline">
              View Resume
            </a>
            {' | '}
            <a href={applicant.coverLetterUrl} target="_blank" className="text-blue-500 hover:underline">
              View Cover Letter
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Applicants;