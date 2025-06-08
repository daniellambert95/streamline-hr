import { Link } from 'react-router-dom';

interface FooterProps {
  onCtaClick?: () => void;
}

const Footer = ({ onCtaClick }: FooterProps) => {
  return (
    <footer className="relative bg-gradient-to-br from-primary/10 via-secondary-lavender/20 to-purple-100/50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-80 h-48 sm:h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-secondary-lavender/10 rounded-full blur-3xl"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(87,41,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(87,41,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px]"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8 sm:pb-12">
          <div className="grid lg:grid-cols-5 gap-8 sm:gap-12">
            {/* CTA Section */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-dark mb-4 sm:mb-6 leading-tight">
                Ready to Transform<br />
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-800">HR Operations?</span>
              </h3>
              <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                Join thousands of companies streamlining their hiring, employee management, and time tracking with AI-powered automation.
              </p>
              {onCtaClick ? (
                <button 
                  onClick={onCtaClick}
                  className="group bg-gradient-to-r from-primary to-purple-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-base sm:text-lg transform hover:scale-105 hover:-translate-y-1 w-full sm:w-auto"
                >
                  <span className="flex items-center justify-center">
                    Start Free Trial
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              ) : (
                <button className="group bg-gradient-to-r from-primary to-purple-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-base sm:text-lg transform hover:scale-105 hover:-translate-y-1 w-full sm:w-auto">
                  <span className="flex items-center justify-center">
                    Start Free Trial
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              )}
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-base sm:text-lg font-bold text-neutral-dark mb-4 sm:mb-6">Company</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium text-sm sm:text-base">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/security" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium text-sm sm:text-base">
                    Security
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium text-sm sm:text-base">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/newsroom" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium text-sm sm:text-base">
                    Newsroom
                  </Link>
                </li>
              </ul>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-base sm:text-lg font-bold text-neutral-dark mb-4 sm:mb-6">Product</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li>
                  <Link to="/features" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium text-sm sm:text-base">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium text-sm sm:text-base">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/integrations" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium text-sm sm:text-base">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link to="/api" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium text-sm sm:text-base">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="text-base sm:text-lg font-bold text-neutral-dark mb-4 sm:mb-6">Resources</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li>
                  <Link to="/blog" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium text-sm sm:text-base">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium text-sm sm:text-base">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/documentation" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium text-sm sm:text-base">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium text-sm sm:text-base">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200/50 bg-neutral-white/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Logo and Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <Link to="/" className="flex items-center space-x-3">
                  <img 
                    src="/streamline_icon.svg" 
                    alt="StreamlineHR" 
                    className="h-6 sm:h-8 w-6 sm:w-8"
                  />
                  <span className="text-lg sm:text-xl font-bold text-neutral-dark">StreamlineHR</span>
                </Link>
                
                <nav className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                  <Link to="/" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium">
                    Home
                  </Link>
                  <Link to="/about" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium">
                    About Us
                  </Link>
                  <Link to="/features" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium">
                    Features
                  </Link>
                  <Link to="/pricing" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium">
                    Pricing
                  </Link>
                </nav>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center gap-3 sm:gap-4">
                <a 
                  href="https://twitter.com/streamlinehr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-100 hover:bg-primary/10 rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-all duration-300 transform hover:scale-110"
                >
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com/company/streamlinehr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 hover:bg-primary/10 rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-all duration-300 transform hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com/streamlinehr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 hover:bg-primary/10 rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-all duration-300 transform hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a 
                  href="https://youtube.com/@streamlinehr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 hover:bg-primary/10 rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-all duration-300 transform hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-200/30 bg-neutral-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600">
              <div>
                © 2025 StreamlineHR. All rights reserved.
              </div>
              <div className="flex items-center gap-6">
                <Link to="/privacy" className="hover:text-primary transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-primary transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="hover:text-primary transition-colors duration-300">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 