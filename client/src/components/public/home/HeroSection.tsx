import { HiPlay } from 'react-icons/hi2';
import { AuroraText } from "@/components/magicui/aurora-text";
import { BorderBeam } from "@/components/magicui/border-beam";

interface HeroSectionProps {
  onCtaClick: () => void;
}

const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-neutral-white to-primary/10 pt-16 pb-8 sm:pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-secondary-lavender/40 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-accent-blue/30 rounded-full blur-3xl animate-float-slow"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(87,41,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(87,41,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px]"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center mt-4 sm:mt-6 lg:mt-10 z-10">
        {/* Badge with brand colors */}
        <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary text-xs sm:text-sm font-medium my-8 sm:mb-6 shadow-lg">
          AI-Powered HR Automation Platform
        </div>
        
        {/* Main Headline with brand colors */}
        <h1 className="text-4xl md:text-7xl xl:text-8xl font-bold font-header text-neutral-dark mb-3 sm:mb-4 leading-tight">
          Hire <AuroraText>Smarter</AuroraText>,<br />
          Manage <AuroraText>Better</AuroraText>
        </h1>
        
        {/* Description */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 my-8 sm:my-10 lg:my-12 max-w-3xl mx-auto leading-relaxed px-2">
          Transform your HR operations with intelligent candidate matching, streamlined employee management, and simplified time tracking.
          <span className='text-primary block font-semibold'>The all in one powerful platform.</span>
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-0">
          <button 
            onClick={onCtaClick}
            className="group bg-gradient-to-r from-primary to-purple-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base sm:text-lg transform hover:scale-105 hover:-translate-y-1 w-full sm:w-auto"
          >
            <span className="flex items-center justify-center">
              Start Free Trial
              <svg className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <button 
            onClick={onCtaClick}
            className="btn-outline group px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-neutral-white/70 backdrop-blur-sm transform hover:scale-105 w-full sm:w-auto"
          >
            <span className="flex items-center justify-center">
              <HiPlay className="w-4 sm:w-5 h-4 sm:h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Watch Demo
            </span>
          </button>
        </div>
        
        {/* Feature List */}
        <div className="flex  sm:flex-row items-center gap-4 text-xs sm:text-sm text-gray-500 justify-center px-4 sm:px-0">
          <div className="flex items-center">
            <svg className="w-3 sm:w-4 h-3 sm:h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            No credit card required
          </div>
          <div className="flex items-center">
            <svg className="w-3 sm:w-4 h-3 sm:h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            14-day free trial
          </div>
          <div className="flex items-center">
            <svg className="w-3 sm:w-4 h-3 sm:h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Setup in 5 minutes
          </div>
        </div>
      </div>

      {/* Dashboard Mockup Section with Enhanced Mobile/iPad Layouts */}
      <div className="relative w-full max-w-7xl mx-auto z-10 mt-8 sm:mt-12 lg:mt-16 px-4 sm:px-6 lg:px-8">
        <div className="relative w-full">
          {/* Main Dashboard with glass morphism effect */}
          <div className="bg-neutral-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-4 lg:p-6 border border-primary/20 relative overflow-hidden w-full">
            {/* Header with live indicator */}
            <div className="absolute top-2 sm:top-4 left-3 sm:left-6 right-3 sm:right-6 flex items-center justify-between z-20">
              
              
            </div>
            
            {/* Dashboard Image with improved responsive behavior */}
            <div className="relative">
              <img 
                src="/dashboard.webp" 
                alt="StreamlineHR Dashboard" 
                className="w-full h-auto rounded-xl sm:rounded-2xl object-cover"
              />
              
              {/* Mobile overlay with key features - shows only on mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl sm:rounded-2xl md:hidden">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                      <div className="text-xs font-semibold text-neutral-dark">AI Matching</div>
                      <div className="text-xs text-primary">94% Accuracy</div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                      <div className="text-xs font-semibold text-neutral-dark">Time Saved</div>
                      <div className="text-xs text-primary">15hrs/week</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Animated Border Beam - Responsive */}
            {/* Mobile BorderBeam */}
            <BorderBeam 
              className="block md:hidden"
              size={150}
              duration={8} 
              colorFrom="#5729FF" 
              colorTo="#BFA8FF"
            />
            {/* Desktop BorderBeam */}
            <BorderBeam 
              className="hidden md:block"
              size={500}
              duration={7} 
              colorFrom="#5729FF" 
              colorTo="#BFA8FF"
            />
          </div>

          {/* Enhanced Floating Cards - Desktop Only (XL and above) */}
          <div className="hidden xl:block">
            {/* ATS Card - Bottom Right */}
            <div className="absolute border-1 border-primary -bottom-8 -right-10 card p-6 w-80 animate-float">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-800 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-dark text-lg">AI Recruiting</h3>
                  <p className="text-sm text-gray-500">Smart candidate matching</p>
                </div>
                <div className="ml-auto bg-secondary-lavender text-secondary-navy px-2 py-1 rounded-full text-xs font-medium">
                  +15%
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sarah Johnson</span>
                  <span className="text-xs font-medium text-secondary-lavender bg-secondary-lavender/10 px-2 py-1 rounded-full">94% Match</span>
                </div>
                <div className="w-full bg-neutral-medium/30 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-purple-800 h-2 rounded-full transition-all duration-1000" style={{width: '94%'}}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mike Chen</span>
                  <span className="text-xs font-medium text-secondary-lavender bg-secondary-lavender/10 px-2 py-1 rounded-full">87% Match</span>
                </div>
                <div className="w-full bg-neutral-medium/30 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-purple-800 h-2 rounded-full transition-all duration-1000 delay-300" style={{width: '87%'}}></div>
                </div>
              </div>
            </div>

            {/* Employee Management Card - Bottom Left */}
            <div className="absolute border-1 border-primary -bottom-8 -left-10 card p-6 w-72 animate-float-delayed">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-800 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-dark text-lg">Team Hub</h3>
                  <p className="text-sm text-gray-500">Employee management</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-primary to-purple-800 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm text-gray-600 font-medium">23 active employees</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-primary to-purple-800 rounded-full mr-3 animate-pulse delay-300"></div>
                  <span className="text-sm text-gray-600 font-medium">5 pending reviews</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-primary to-purple-800 rounded-full mr-3 animate-pulse delay-700"></div>
                  <span className="text-sm text-gray-600 font-medium">2 new hires this week</span>
                </div>
              </div>
            </div>
          </div>

          {/* iPad/Large Tablet Layout - Better organized cards below dashboard */}
          <div className="hidden md:block xl:hidden">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 px-4">
              <div className="bg-neutral-white/90 backdrop-blur-sm rounded-xl p-4 border border-primary/20 shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-dark">AI Recruiting</h4>
                    <p className="text-xs text-primary">94% Match Rate</p>
                  </div>
                </div>
                <div className="w-full bg-neutral-medium/30 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-2 rounded-full transition-all duration-1000" style={{width: '94%'}}></div>
                </div>
              </div>
              
              <div className="bg-neutral-white/90 backdrop-blur-sm rounded-xl p-4 border border-primary/20 shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-dark">Team Hub</h4>
                    <p className="text-xs text-primary">23 Employees</p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <div className="w-2 h-2 bg-accent-primary rounded-full mr-2 animate-pulse"></div>
                  <span>5 pending reviews</span>
                </div>
              </div>

              <div className="bg-neutral-white/90 backdrop-blur-sm rounded-xl p-4 border border-primary/20 shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-dark">Time Tracker</h4>
                    <p className="text-xs text-primary">7.5h Today</p>
                  </div>
                </div>
                <div className="w-full bg-neutral-medium/30 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-1000" style={{width: '75%'}}></div>
                </div>
              </div>

              <div className="bg-neutral-white/90 backdrop-blur-sm rounded-xl p-4 border border-primary/20 shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-dark">Analytics</h4>
                    <p className="text-xs text-primary">94% Rate</p>
                  </div>
                </div>
                <div className="w-full bg-neutral-medium/30 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-secondary-lavender to-secondary-lavender/80 h-2 rounded-full transition-all duration-1000" style={{width: '94%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout - Vertical stacked cards with better spacing */}
          <div className="md:hidden">
            <div className="space-y-4 mt-6 px-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-white/90 backdrop-blur-sm rounded-xl p-3 border border-primary/20 shadow-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-dark">AI Recruiting</h4>
                      <p className="text-xs text-primary">94% Match</p>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-medium/30 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-1.5 rounded-full transition-all duration-1000" style={{width: '94%'}}></div>
                  </div>
                </div>
                
                <div className="bg-neutral-white/90 backdrop-blur-sm rounded-xl p-3 border border-primary/20 shadow-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-dark">Team Hub</h4>
                      <p className="text-xs text-primary">23 Active</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-1 animate-pulse"></div>
                    <span className="text-xs text-gray-600">5 pending</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-white/90 backdrop-blur-sm rounded-xl p-3 border border-primary/20 shadow-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-dark">Time Tracker</h4>
                      <p className="text-xs text-primary">7.5h Today</p>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-medium/30 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-primary/80 h-1.5 rounded-full transition-all duration-1000" style={{width: '75%'}}></div>
                  </div>
                </div>

                <div className="bg-neutral-white/90 backdrop-blur-sm rounded-xl p-3 border border-primary/20 shadow-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-dark">Analytics</h4>
                      <p className="text-xs text-primary">94% Rate</p>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-medium/30 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-primary/80 h-1.5 rounded-full transition-all duration-1000" style={{width: '94%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            50% { transform: translateY(-15px) translateX(8px) rotate(1deg); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            50% { transform: translateY(-20px) translateX(-10px) rotate(-1deg); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            50% { transform: translateY(-12px) translateX(6px) rotate(0.5deg); }
          }
          @keyframes float-reverse {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            50% { transform: translateY(-18px) translateX(-6px) rotate(-0.5deg); }
          }
          
          .animate-float { animation: float 8s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
          .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
          .animate-float-reverse { animation: float-reverse 9s ease-in-out infinite; }
        `
      }} />
    </section>
  );
};

export default HeroSection; 