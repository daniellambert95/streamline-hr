const SocialProofSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-xs sm:text-sm font-semibold text-primary mb-3 sm:mb-4">SUCCESS STORIES</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-dark mb-3 sm:mb-4">Trusted by Growing Businesses</h2>
          <p className="text-lg sm:text-xl text-gray-600">See how companies like yours are transforming their HR operations</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 p-6 sm:p-8 rounded-2xl border border-gray-100">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              "StreamlineHR's AI matching is incredible. We went from reviewing 200+ resumes manually to having the top 5 candidates highlighted automatically. <strong>Reduced our hiring time from 6 weeks to 2 weeks.</strong>"
            </p>
            <div className="flex items-center">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-primary to-purple-800 rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4 text-sm sm:text-base">
                SM
              </div>
              <div>
                <p className="font-semibold text-neutral-dark text-sm sm:text-base">Sarah Mitchell</p>
                <p className="text-xs sm:text-sm text-gray-600">HR Director, TechCorp (250 employees)</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 p-6 sm:p-8 rounded-2xl border border-gray-100">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              "Finally, one platform for everything! No more juggling 5 different HR tools. The time tracking alone saves us 20 hours per month in administrative work. <strong>ROI was clear within 30 days.</strong>"
            </p>
            <div className="flex items-center">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-primary to-purple-800 rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4 text-sm sm:text-base">
                DJ
              </div>
              <div>
                <p className="font-semibold text-neutral-dark text-sm sm:text-base">David Johnson</p>
                <p className="text-xs sm:text-sm text-gray-600">CEO, GrowthCo (150 employees)</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 p-6 sm:p-8 rounded-2xl border border-gray-100 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              "The onboarding automation is a game-changer. New hires are productive from day one, and we've eliminated 90% of paperwork. <strong>Our employee satisfaction scores increased by 35%.</strong>"
            </p>
            <div className="flex items-center">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-primary to-purple-800 rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4 text-sm sm:text-base">
                LR
              </div>
              <div>
                <p className="font-semibold text-neutral-dark text-sm sm:text-base">Lisa Rodriguez</p>
                <p className="text-xs sm:text-sm text-gray-600">Operations Manager, StartupXYZ (85 employees)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection; 