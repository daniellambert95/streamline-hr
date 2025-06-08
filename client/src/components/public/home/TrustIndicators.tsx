const TrustIndicators = () => {
  return (
    <section className="py-8 sm:py-12 bg-neutral-white/50 backdrop-blur-sm border-y border-neutral-white/100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm font-medium text-gray-500 mb-6 sm:mb-8">
          Trusted by 500+ growing companies worldwide
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 items-center">
          <div className="h-8 sm:h-12 flex items-center justify-center group">
            <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-300 group-hover:text-gray-400 transition-colors duration-300">TechCorp</div>
          </div>
          <div className="h-8 sm:h-12 flex items-center justify-center group">
            <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-300 group-hover:text-gray-400 transition-colors duration-300">InnovateCo</div>
          </div>
          <div className="h-8 sm:h-12 flex items-center justify-center group">
            <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-300 group-hover:text-gray-400 transition-colors duration-300">StartupXYZ</div>
          </div>
          <div className="h-8 sm:h-12 flex items-center justify-center group">
            <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-300 group-hover:text-gray-400 transition-colors duration-300">GrowthLab</div>
          </div>
          <div className="h-8 sm:h-12 flex items-center justify-center group col-span-2 sm:col-span-1">
            <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-300 group-hover:text-gray-400 transition-colors duration-300">ScaleUp</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators; 