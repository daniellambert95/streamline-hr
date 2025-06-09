import { HiPlay } from 'react-icons/hi2';

interface FinalCtaSectionProps {
  onCtaClick: () => void;
}

const FinalCtaSection = ({ onCtaClick }: FinalCtaSectionProps) => {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-neutral-white to-purple-50/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-48 sm:w-80 h-48 sm:h-80 bg-secondary-lavender/20 rounded-full blur-3xl"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(87,41,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(87,41,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px]"></div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary text-xs sm:text-sm font-medium mb-6 sm:mb-8 shadow-lg">
          <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
          Transform Your HR Today
        </div>

        {/* Main Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-dark mb-4 sm:mb-6 leading-tight">
          Ready to Streamline Your<br className="hidden sm:block" />
          <span className="sm:hidden"> </span><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-800">
            HR Operations?
          </span>
        </h2>
        
        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
          Join thousands of companies who have already transformed their HR processes. 
          Start your free trial today and see the difference.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-0">
          <button 
            onClick={onCtaClick}
            className="group bg-gradient-to-r from-primary to-purple-800 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 font-bold text-base sm:text-lg transform hover:scale-105 hover:-translate-y-2 w-full sm:w-auto sm:min-w-[200px]"
          >
            <span className="flex items-center justify-center">
              Start Your Free Trial
              <svg className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <button 
            onClick={onCtaClick}
            className="group border-2 border-primary/30 text-primary px-8 sm:px-10 py-4 sm:py-5 rounded-2xl backdrop-blur-sm bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 font-bold text-base sm:text-lg transform hover:scale-105 hover:-translate-y-2 w-full sm:w-auto sm:min-w-[200px]"
          >
            <span className="flex items-center justify-center">
              <HiPlay className="w-4 sm:w-5 h-4 sm:h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Schedule a Demo
            </span>
          </button>
        </div>
        
        {/* Feature List */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-0">
          <div className="flex items-center justify-center sm:justify-start">
            <div className="w-5 sm:w-6 h-5 sm:h-6 bg-secondary-lavender rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <svg className="w-3 sm:w-4 h-3 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm sm:text-base">14-day free trial</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start">
            <div className="w-5 sm:w-6 h-5 sm:h-6 bg-secondary-lavender rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <svg className="w-3 sm:w-4 h-3 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm sm:text-base">No setup fees</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start">
            <div className="w-5 sm:w-6 h-5 sm:h-6 bg-secondary-lavender rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <svg className="w-3 sm:w-4 h-3 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm sm:text-base">Cancel anytime</span>
          </div>
        </div>

        {/* Stats Row - Enhanced Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto px-4 sm:px-0">
          <div className="bg-neutral-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-neutral-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">500+</div>
            <div className="text-gray-600 text-xs sm:text-sm font-medium">Companies Trust Us</div>
          </div>
          <div className="bg-neutral-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-neutral-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">60%</div>
            <div className="text-gray-600 text-xs sm:text-sm font-medium">Faster Hiring</div>
          </div>
          <div className="bg-neutral-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-neutral-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">94%</div>
            <div className="text-gray-600 text-xs sm:text-sm font-medium">Retention Rate</div>
          </div>
          <div className="bg-neutral-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-neutral-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">15hrs</div>
            <div className="text-gray-600 text-xs sm:text-sm font-medium">Weekly Time Saved</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection; 