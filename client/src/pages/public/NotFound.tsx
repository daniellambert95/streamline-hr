import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';

const NotFound = () => {
  return (
    <div className="font-sans">
      {/* 404 Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-neutral-white to-primary/10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-lavender/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(87,41,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(87,41,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10 pt-10">
          {/* 404 Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
            Error 404
          </div>
          
          {/* Large 404 Text */}
          <div className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-primary/20 mb-6 leading-none">
            404
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-dark mb-6 leading-tight">
            Page Not <span className="text-primary">Found</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              to="/"
              className="group bg-gradient-to-r from-primary to-purple-800 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-lg transform hover:scale-105 hover:-translate-y-1 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center">
                Go Home
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="group border-2 border-primary/30 text-primary px-8 py-4 rounded-2xl backdrop-blur-sm bg-neutral-white/70 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 font-bold text-lg transform hover:scale-105 hover:-translate-y-1 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Go Back
              </span>
            </button>
          </div>
          
          {/* Help Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Link 
              to="/features"
              className="group bg-neutral-white/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-800 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-neutral-dark mb-2">Explore Features</h3>
              <p className="text-gray-600 text-sm">Discover our AI-powered HR solutions</p>
            </Link>
            
            <Link 
              to="/docs"
              className="group bg-neutral-white/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-800 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-neutral-dark mb-2">Documentation</h3>
              <p className="text-gray-600 text-sm">Get help and learn how to use our platform</p>
            </Link>
            
            <Link 
              to="/about"
              className="group bg-neutral-white/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-800 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-neutral-dark mb-2">About Us</h3>
              <p className="text-gray-600 text-sm">Learn more about our company and mission</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-dark mb-4">Still Need Help?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you find what you're looking for.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@streamlinehr.com"
              className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all duration-300 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
            </a>
            
            <Link 
              to="/docs"
              className="inline-flex items-center px-6 py-3 border border-primary/30 text-primary rounded-xl hover:bg-primary/5 transition-all duration-300 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help Center
            </Link>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-15px) translateX(8px); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-20px) translateX(-10px); }
          }
          .animate-float { animation: float 8s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
        `
      }} />

      <Footer />
    </div>
  );
};

export default NotFound; 