import { VelocityScroll } from '@/components/magicui/scroll-based-velocity';

const VelocityScrollSection = () => {
  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-16 bg-neutral-white">
      {/* Simple but effective container approach */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
        <div className="relative h-auto">
          <VelocityScroll
            defaultVelocity={0.5}
            numRows={4} // Single row for maximum compatibility
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-secondary-lavender font-header py-4 sm:py-6 md:py-8 leading-tight"
          >
            AI-Powered Hiring • Smart Employee Management • Intelligent Time Tracking • Automated HR Workflows • Modern HR Solutions •
          </VelocityScroll>
          
          {/* Simple edge fade gradients */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-neutral-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-neutral-white to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default VelocityScrollSection;
