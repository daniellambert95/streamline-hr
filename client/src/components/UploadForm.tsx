// src/components/UploadForm.tsx

import React, { useState } from 'react';

const UploadForm: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = event.target.files?.[0] || null;
    setFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    if (resume) {
      formData.append('resume', resume);
    }
    if (coverLetter) {
      formData.append('coverLetter', coverLetter);
    }

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error uploading files:', error);
      setMessage('Error uploading files. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4">Upload Your Resume</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
            Resume (Required)
          </label>
          <input
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx"
            onChange={(event) => handleFileChange(event, setResume)}
            className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
            Cover Letter (Optional)
          </label>
          <input
            type="file"
            id="coverLetter"
            accept=".pdf,.doc,.docx"
            onChange={(event) => handleFileChange(event, setCoverLetter)}
            className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>
        <button type="submit" className="w-full py-2 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200">
          Upload
        </button>
      </form>
      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
};

export default UploadForm;