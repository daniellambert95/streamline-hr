import { useState } from 'react';
import Footer from '../../components/common/Footer';
import EmailSignupPopup from '../../components/common/EmailSignupPopup';

const About = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCtaClick = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-neutral-white to-primary/10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-lavender/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(87,41,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(87,41,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center pt-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
            About StreamlineHR
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-dark mb-6 leading-tight">
            Revolutionizing HR with <span className="text-primary">AI-Powered</span> Solutions
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Founded in 2025, StreamlineHR is on a mission to transform how companies manage their most valuable asset: their people. We believe HR should be effortless, intelligent, and human-centered.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-dark mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To empower businesses of all sizes with AI-driven HR solutions that eliminate administrative burden, improve decision-making, and create exceptional employee experiences.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We envision a world where HR professionals can focus on strategic initiatives and employee development rather than paperwork and repetitive tasks.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-800 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-dark mb-2">Innovation First</h3>
                    <p className="text-gray-600 text-sm">Cutting-edge AI technology that adapts to your needs</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-800 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-dark mb-2">Human-Centered</h3>
                    <p className="text-gray-600 text-sm">Technology that enhances human potential</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary-lavender/20 rounded-3xl p-8 border border-primary/20">
                <img 
                  src="/dashboard.webp" 
                  alt="StreamlineHR Platform" 
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-dark mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape how we build products, serve customers, and grow as a team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-neutral-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-800 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-dark mb-3">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                We constantly push boundaries to create solutions that didn't exist before, making the impossible possible.
              </p>
            </div>

            <div className="bg-neutral-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-800 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-dark mb-3">Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Great products are built by great teams. We believe in the power of diverse perspectives and inclusive collaboration.
              </p>
            </div>

            <div className="bg-neutral-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-800 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-dark mb-3">Trust</h3>
              <p className="text-gray-600 leading-relaxed">
                Security and privacy are non-negotiable. We handle your data with the highest standards of protection and transparency.
              </p>
            </div>

            <div className="bg-neutral-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-800 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-dark mb-3">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                We're committed to delivering exceptional quality in every aspect of our product and service.
              </p>
            </div>

            <div className="bg-neutral-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-800 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-dark mb-3">Empathy</h3>
              <p className="text-gray-600 leading-relaxed">
                We listen to our customers, understand their challenges, and build solutions that truly make their lives better.
              </p>
            </div>

            <div className="bg-neutral-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-800 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-dark mb-3">Growth</h3>
              <p className="text-gray-600 leading-relaxed">
                We embrace challenges as opportunities to learn, improve, and help our customers achieve their goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-dark mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A diverse group of passionate individuals united by our mission to revolutionize HR technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 p-8 rounded-2xl border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-to-r from-primary to-purple-800 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                DL
              </div>
              <h3 className="text-xl font-bold text-neutral-dark mb-2">Daniel Lambert</h3>
              <p className="text-primary font-medium mb-3">CEO & Co-Founder</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Founder of StreamlineHR. Passionate about using AI to solve real-world HR challenges.
              </p>
            </div>

            {/* <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 p-8 rounded-2xl border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-to-r from-primary to-purple-800 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                SM
              </div>
              <h3 className="text-xl font-bold text-neutral-dark mb-2">Sarah Mitchell</h3>
              <p className="text-primary font-medium mb-3">CTO & Co-Founder</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                AI researcher and engineering leader. PhD in Machine Learning from Stanford. Expert in NLP and automation systems.
              </p>
            </div> */}

            {/* <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 p-8 rounded-2xl border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-to-r from-primary to-purple-800 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                MR
              </div>
              <h3 className="text-xl font-bold text-neutral-dark mb-2">Michael Rodriguez</h3>
              <p className="text-primary font-medium mb-3">VP of Product</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Product strategy expert with deep understanding of HR workflows. Former CHRO turned product leader.
              </p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-neutral-white to-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-dark mb-4">By the Numbers</h2>
            <p className="text-lg text-gray-600">Our impact since launch</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600 font-medium">Companies Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Employees Managed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">94%</div>
              <div className="text-gray-600 font-medium">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">60%</div>
              <div className="text-gray-600 font-medium">Time Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-neutral-dark mb-6">
            Join Us on Our <span className="text-primary">Mission</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to transform your HR operations? Start your free trial today and experience the future of HR management.
          </p>
          <button 
            onClick={handleCtaClick}
            className="bg-gradient-to-r from-primary to-purple-800 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg transform hover:scale-105 hover:-translate-y-1"
          >
            Start Free Trial
          </button>
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

      <Footer onCtaClick={handleCtaClick} />
      <EmailSignupPopup isOpen={isPopupOpen} onClose={closePopup} source="about" />
    </div>
  );
};

export default About; 