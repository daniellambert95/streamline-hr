const CoreFeaturesSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="text-xs sm:text-sm font-semibold text-primary mb-3 sm:mb-4">FEATURES</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-dark mb-4 sm:mb-6 leading-tight">
            Three AI-Powered Modules,<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>One Seamless Experience
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
            Replace your scattered HR tools with one intelligent platform that grows with your business.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Applicant Tracking */}
          <div className="group relative bg-neutral-white p-6 sm:p-8 rounded-3xl border border-gray-200 hover:border-primary hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-3xl transition-all duration-500"></div>
            <div className="relative">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-primary to-purple-800 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 sm:w-8 h-6 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-dark mb-3 sm:mb-4">AI-Powered ATS</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Our AI reads every resume in seconds, scoring candidates against your job requirements. 
                Find your next hire 10x faster.
              </p>
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-r from-primary to-purple-800 rounded-full mr-2 sm:mr-3"></div>
                  <span>94% accurate candidate matching</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-r from-primary to-purple-800 rounded-full mr-2 sm:mr-3"></div>
                  <span>Automated interview scheduling</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-r from-primary to-purple-800 rounded-full mr-2 sm:mr-3"></div>
                  <span>Collaborative hiring pipeline</span>
                </div>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-primary group-hover:text-primary/80 transition-colors">
                Reduce time-to-hire by 60% →
              </div>
            </div>
          </div>

          {/* Employee Management */}
          <div className="group relative bg-neutral-white p-6 sm:p-8 rounded-3xl border border-gray-200 hover:border-primary hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-3xl transition-all duration-500"></div>
            <div className="relative">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-primary to-purple-800 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 sm:w-8 h-6 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-dark mb-3 sm:mb-4">Smart Employee Hub</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                From onboarding to performance reviews, manage your entire workforce with intelligent 
                automation and insights.
              </p>
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-r from-primary to-purple-800 rounded-full mr-2 sm:mr-3"></div>
                  <span>Digital onboarding workflows</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-r from-primary to-purple-800 rounded-full mr-2 sm:mr-3"></div>
                  <span>Performance tracking & reviews</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-r from-primary to-purple-800 rounded-full mr-2 sm:mr-3"></div>
                  <span>Document & compliance management</span>
                </div>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-primary group-hover:text-primary/80 transition-colors">
                Boost employee satisfaction by 40% →
              </div>
            </div>
          </div>

          {/* Timesheets */}
          <div className="group relative bg-neutral-white p-6 sm:p-8 rounded-3xl border border-gray-200 hover:border-primary hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-3xl transition-all duration-500"></div>
            <div className="relative">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-primary to-purple-800 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 sm:w-8 h-6 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-dark mb-3 sm:mb-4">Intelligent Time Tracking</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Automated time capture, smart project allocation, and seamless payroll integration. 
                No more chasing timesheets.
              </p>
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-r from-primary to-purple-800 rounded-full mr-2 sm:mr-3"></div>
                  <span>GPS-enabled mobile clock-in</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-r from-primary to-purple-800 rounded-full mr-2 sm:mr-3"></div>
                  <span>Automatic payroll sync</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-r from-primary to-purple-800 rounded-full mr-2 sm:mr-3"></div>
                  <span>Real-time attendance analytics</span>
                </div>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-primary group-hover:text-primary/80 transition-colors">
                Save 15 hours weekly on admin →
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreFeaturesSection; 