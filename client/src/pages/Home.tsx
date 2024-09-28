// src/pages/Home.tsx

const Home = () => {
    return (
      <div className="font-sans">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 flex flex-col items-center justify-center h-[400px] text-center">
          <h1 className="text-4xl font-bold mb-4">Streamline HR</h1>
          <p className="text-lg mb-6">Using AI to help you find the perfect candidate faster.</p>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition">
            Get Started
          </button>
        </section>
  
        {/* What We Do Section */}
        <section className="py-20 px-4 text-center bg-gray-50">
          <h2 className="text-3xl font-semibold mb-10">What We Do</h2>
          <p className="text-lg mb-8">Streamline HR is a tech solution that empowers recruiters by automating the job matching process.</p>
          <div className="flex flex-wrap justify-center gap-10">
            {/* Feature 1 */}
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-indigo-600 mb-4 mx-auto"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Automated Matching</h3>
              <p className="text-gray-600">
                Automatically match job applicants with job descriptions for more efficient hiring.
              </p>
            </div>
  
            {/* Feature 2 */}
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-indigo-600 mb-4 mx-auto"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Resume Review</h3>
              <p className="text-gray-600">
                Our system reviews resumes and provides insights into candidate suitability.
              </p>
            </div>
  
            {/* Feature 3 */}
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-indigo-600 mb-4 mx-auto"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Scoring System</h3>
              <p className="text-gray-600">
                We provide a scoring system for candidates based on their match with job descriptions.
              </p>
            </div>
          </div>
        </section>
  
        {/* Why Choose Us Section */}
        <section className="py-10 text-center">
          <h2 className="text-3xl font-semibold mb-4">Why Choose Streamline HR?</h2>
          <ul className="list-none space-y-2 text-lg">
            <li>✔ Efficient HR workflows</li>
            <li>✔ Comprehensive employee management</li>
            <li>✔ Smart analytics for decision-making</li>
          </ul>
        </section>
      </div>
    );
  };
  
  export default Home;