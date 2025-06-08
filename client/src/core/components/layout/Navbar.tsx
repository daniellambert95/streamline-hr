import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  
  // Refs and timers for better dropdown control
  const featuresTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const docsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Improved dropdown handlers with delays
  const handleFeaturesMouseEnter = () => {
    if (featuresTimeoutRef.current) {
      clearTimeout(featuresTimeoutRef.current);
    }
    setFeaturesOpen(true);
  };

  const handleFeaturesMouseLeave = () => {
    featuresTimeoutRef.current = setTimeout(() => {
      setFeaturesOpen(false);
    }, 150); // Small delay to prevent accidental closes
  };

  const handleDocsMouseEnter = () => {
    if (docsTimeoutRef.current) {
      clearTimeout(docsTimeoutRef.current);
    }
    setDocsOpen(true);
  };

  const handleDocsMouseLeave = () => {
    docsTimeoutRef.current = setTimeout(() => {
      setDocsOpen(false);
    }, 150); // Small delay to prevent accidental closes
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (featuresTimeoutRef.current) clearTimeout(featuresTimeoutRef.current);
      if (docsTimeoutRef.current) clearTimeout(docsTimeoutRef.current);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 pt-4 pb-4">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Modern Wide Navigation Bar */}
        <div className="bg-neutral-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-neutral-white/20 px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
            <img 
              src="/streamline_icon.svg" 
              alt="Streamline HR" 
              className="h-9 w-9"
            />
            <span className="text-xl font-bold text-neutral-dark">StreamlineHR</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-primary font-semibold text-sm relative group transition-all duration-300"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"></span>
            </Link>
            
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-primary font-medium text-sm transition-all duration-300 relative group"
            >
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link 
              to="/pricing" 
              className="text-gray-600 hover:text-primary font-medium text-sm transition-all duration-300 relative group"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {/* Features Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleFeaturesMouseEnter}
              onMouseLeave={handleFeaturesMouseLeave}
            >
              <button className="text-gray-600 hover:text-primary font-medium text-sm transition-all duration-300 relative group flex items-center">
                Features
                <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300"></span>
              </button>
              
              {featuresOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-neutral-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-white/30 overflow-hidden">
                  <div className="p-2">
                    <Link 
                      to="/features" 
                      className="flex items-center px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">AI Recruiting</div>
                        <div className="text-xs text-gray-500">Smart candidate matching</div>
                      </div>
                    </Link>
                    
                    <Link 
                      to="/features" 
                      className="flex items-center px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Employee Management</div>
                        <div className="text-xs text-gray-500">Centralized employee hub</div>
                      </div>
                    </Link>
                    
                    <Link 
                      to="/features" 
                      className="flex items-center px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Time Tracking</div>
                        <div className="text-xs text-gray-500">Automated timesheets</div>
                      </div>
                    </Link>
                    
                    <Link 
                      to="/features" 
                      className="flex items-center px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Analytics & Reports</div>
                        <div className="text-xs text-gray-500">Insights dashboard</div>
                      </div>
                    </Link>
                    
                    <div className="border-t border-gray-200/50 mt-2 pt-2">
                      <Link 
                        to="/features" 
                        className="flex items-center px-4 py-3 text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 group font-semibold text-sm"
                      >
                        View All Features
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Docs Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleDocsMouseEnter}
              onMouseLeave={handleDocsMouseLeave}
            >
              <button className="text-gray-600 hover:text-primary font-medium text-sm transition-all duration-300 relative group flex items-center">
                Docs
                <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300"></span>
              </button>
              
              {docsOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-neutral-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-white/30 overflow-hidden">
                  <div className="p-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">For Users</div>
                    
                    <Link 
                      to="/docs" 
                      className="flex items-center px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Getting Started</div>
                        <div className="text-xs text-gray-500">Quick setup guide</div>
                      </div>
                    </Link>
                    
                    <Link 
                      to="/docs" 
                      className="flex items-center px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">User Guide</div>
                        <div className="text-xs text-gray-500">Complete user manual</div>
                      </div>
                    </Link>
                    
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3">For Developers</div>
                    
                    <Link 
                      to="/docs" 
                      className="flex items-center px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">API Documentation</div>
                        <div className="text-xs text-gray-500">REST API reference</div>
                      </div>
                    </Link>
                    
                    <Link 
                      to="/docs" 
                      className="flex items-center px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Developer Resources</div>
                        <div className="text-xs text-gray-500">SDKs and tools</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Login and CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-primary text-sm font-medium transition-all duration-300 px-4 py-2 rounded-lg hover:bg-primary/5 transform hover:scale-105"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
            >
              Sign up Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={toggleMenu} 
              type="button" 
              className="text-gray-600 hover:text-primary focus:outline-none transition-all duration-300 p-2 rounded-lg hover:bg-primary/5 transform hover:scale-110"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 mx-6">
          <div className="bg-neutral-white/95 backdrop-blur-xl border border-neutral-white/20 rounded-2xl shadow-2xl px-6 pt-4 pb-6 space-y-2">
            <Link 
              to="/" 
              className="text-primary bg-primary/10 block px-4 py-3 text-base font-semibold transition-all duration-300 rounded-xl transform hover:scale-105 flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-primary hover:bg-primary/5 block px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl transform hover:scale-105"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-600 hover:text-primary hover:bg-primary/5 block px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl transform hover:scale-105"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/features" 
              className="text-gray-600 hover:text-primary hover:bg-primary/5 block px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl transform hover:scale-105"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/docs" 
              className="text-gray-600 hover:text-primary hover:bg-primary/5 block px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl transform hover:scale-105"
              onClick={() => setIsOpen(false)}
            >
              Docs
            </Link>
            <div className="border-t border-gray-200/50 pt-4 mt-4 space-y-2">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-primary hover:bg-primary/5 block px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl transform hover:scale-105"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-primary to-purple-600 text-white block px-4 py-3 rounded-xl text-base font-semibold text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                onClick={() => setIsOpen(false)}
              >
                Sign up Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;