import PublicPageLayout, { useCTA } from '../../core/components/layout/PublicPageLayout';
import { Link } from 'react-router-dom';

const DocsContent = () => {
  const { handleCtaClick } = useCTA();

  const docSections = [
    {
      title: "Getting Started",
      description: "Quick setup guide to get you up and running in minutes",
      icon: "🚀",
      link: "/docs/getting-started",
      items: ["Initial Setup", "Account Configuration", "First Steps", "Basic Navigation"]
    },
    {
      title: "User Guide",
      description: "Complete user manual covering all features and workflows",
      icon: "📖",
      link: "/docs/user-guide", 
      items: ["Dashboard Overview", "Employee Management", "Recruiting Tools", "Time Tracking"]
    },
    {
      title: "API Documentation",
      description: "Comprehensive REST API reference for developers",
      icon: "🔧",
      link: "/docs/api",
      items: ["Authentication", "Endpoints", "Rate Limits", "Examples"]
    },
    {
      title: "Developer Resources",
      description: "SDKs, webhooks, and integration guides",
      icon: "⚡",
      link: "/docs/developers",
      items: ["SDKs", "Webhooks", "Integrations", "Best Practices"]
    }
  ];

  const quickLinks = [
    { title: "API Reference", link: "/docs/api", icon: "📋" },
    { title: "Getting Started", link: "/docs/getting-started", icon: "🎯" },
    { title: "Integrations", link: "/docs/integrations", icon: "🔗" },
    { title: "Support", link: "/support", icon: "💬" }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-neutral-white to-primary/10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-lavender/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center pt-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary text-sm font-medium mb-6 ">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
            Documentation Hub
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-dark mb-6 leading-tight">
            Everything You Need to <span className="text-primary">Get Started</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive guides, API documentation, and resources to help you make the most of StreamlineHR.
          </p>

          <div className="bg-neutral-white/70 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search documentation..." 
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-neutral-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link 
                key={index}
                to={link.link}
                className="bg-gradient-to-br from-gray-50 to-purple-50/30 p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {link.icon}
                </div>
                <div className="text-lg font-semibold text-neutral-dark">{link.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-dark mb-4">Documentation</h2>
            <p className="text-lg text-gray-600">Choose your path to getting started with StreamlineHR</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {docSections.map((section, index) => (
              <div key={index} className="bg-neutral-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start mb-6">
                  <div className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-neutral-dark mb-3">{section.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{section.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-gradient-to-r from-primary to-purple-800 rounded-full mr-3"></div>
                      <span className="text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  to={section.link}
                  className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-300"
                >
                  Read Documentation
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-dark mb-4">Popular Topics</h2>
            <p className="text-lg text-gray-600">Frequently accessed documentation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/docs/getting-started" className="block p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <h3 className="text-lg font-semibold text-neutral-dark mb-2 group-hover:text-primary">Quick Setup Guide</h3>
              <p className="text-gray-600 text-sm">Get up and running in 5 minutes</p>
            </Link>
            
            <Link to="/docs/api" className="block p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <h3 className="text-lg font-semibold text-neutral-dark mb-2 group-hover:text-primary">API Authentication</h3>
              <p className="text-gray-600 text-sm">How to authenticate API requests</p>
            </Link>
            
            <Link to="/docs/user-guide" className="block p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <h3 className="text-lg font-semibold text-neutral-dark mb-2 group-hover:text-primary">Employee Onboarding</h3>
              <p className="text-gray-600 text-sm">Step-by-step onboarding process</p>
            </Link>
            
            <Link to="/docs/integrations" className="block p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <h3 className="text-lg font-semibold text-neutral-dark mb-2 group-hover:text-primary">Third-party Integrations</h3>
              <p className="text-gray-600 text-sm">Connect with your existing tools</p>
            </Link>
            
            <Link to="/docs/troubleshooting" className="block p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <h3 className="text-lg font-semibold text-neutral-dark mb-2 group-hover:text-primary">Troubleshooting</h3>
              <p className="text-gray-600 text-sm">Common issues and solutions</p>
            </Link>
            
            <Link to="/docs/api" className="block p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <h3 className="text-lg font-semibold text-neutral-dark mb-2 group-hover:text-primary">Webhooks Setup</h3>
              <p className="text-gray-600 text-sm">Real-time event notifications</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-dark mb-6">
            Need More <span className="text-primary">Help?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button 
              onClick={handleCtaClick}
              className="bg-gradient-to-r from-primary to-purple-800 text-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-2xl mb-3">💬</div>
              <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
              <p className="text-primary-100 text-sm">Get help from our expert team</p>
            </button>
            
            <Link 
              to="/community"
              className="bg-neutral-white border-2 border-primary text-primary p-6 rounded-2xl hover:bg-primary/5 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-2xl mb-3">👥</div>
              <h3 className="text-lg font-semibold mb-2">Join Community</h3>
              <p className="text-gray-600 text-sm">Connect with other users</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

const Docs = () => {
  return (
    <PublicPageLayout>
      <DocsContent />
    </PublicPageLayout>
  );
};

export default Docs; 