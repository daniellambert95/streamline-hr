import PublicPageLayout, { useCTA } from '../../core/components/layout/PublicPageLayout';

const FeaturesContent = () => {
  const { handleCtaClick } = useCTA();

  const features = [
    {
      title: "AI-Powered Recruiting",
      description: "Intelligent candidate matching that reads and scores resumes against your job requirements in seconds.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      benefits: [
        "94% accurate candidate matching",
        "Automated interview scheduling",
        "Collaborative hiring pipeline",
        "Custom scoring criteria"
      ],
      stats: "67% faster hiring"
    },
    {
      title: "Smart Employee Management",
      description: "Centralized employee hub with intelligent automation for onboarding, performance tracking, and compliance.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      benefits: [
        "Digital onboarding workflows",
        "Performance tracking & reviews",
        "Document management",
        "Compliance automation"
      ],
      stats: "40% better satisfaction"
    },
    {
      title: "Intelligent Time Tracking",
      description: "Automated time capture with GPS-enabled mobile clock-in and seamless payroll integration.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      benefits: [
        "GPS-enabled mobile clock-in",
        "Automatic payroll sync",
        "Project time allocation",
        "Real-time attendance analytics"
      ],
      stats: "15 hours saved weekly"
    },
    {
      title: "Advanced Analytics",
      description: "Data-driven insights with predictive analytics for turnover, performance trends, and workforce planning.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      benefits: [
        "Predictive turnover analytics",
        "Performance trend analysis",
        "Custom reporting dashboards",
        "Workforce planning insights"
      ],
      stats: "23% better retention"
    }
  ];

  const integrations = [
    { name: "Slack", logo: "💬" },
    { name: "Microsoft Teams", logo: "📅" },
    { name: "Google Workspace", logo: "📧" },
    { name: "Zoom", logo: "📹" },
    { name: "QuickBooks", logo: "💰" },
    { name: "BambooHR", logo: "🎋" }
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
            Platform Features
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-dark mb-6 leading-tight">
            Everything You Need to <span className="text-primary">Streamline HR</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            From AI-powered recruiting to intelligent time tracking, our comprehensive platform replaces multiple HR tools with one seamless experience.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-gray-600">Core Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-gray-600">Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-dark mb-4">Core Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed to transform every aspect of your HR operations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-800 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-neutral-dark mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                      
                      <div className="bg-gradient-to-r from-primary/10 to-purple-100/50 p-4 rounded-xl mb-6 border border-primary/20">
                        <div className="text-lg font-bold text-primary">{feature.stats}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-purple-800 rounded-full mr-3"></div>
                        <span className="text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-dark mb-4">Why Choose StreamlineHR?</h2>
            <p className="text-lg text-gray-600">See how we compare to traditional HR solutions</p>
          </div>

          <div className="bg-neutral-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-8 text-center">
                <div className="text-red-500 text-4xl mb-4">❌</div>
                <h3 className="text-xl font-bold text-neutral-dark mb-4">Traditional HR Tools</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>Multiple disconnected systems</li>
                  <li>Manual data entry & processes</li>
                  <li>Limited reporting capabilities</li>
                  <li>High implementation costs</li>
                  <li>Poor user experience</li>
                </ul>
              </div>
              
              <div className="p-8 text-center bg-gradient-to-br from-primary/5 to-purple-50/50">
                <div className="text-green-500 text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-primary mb-4">StreamlineHR</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>All-in-one integrated platform</li>
                  <li>AI-powered automation</li>
                  <li>Advanced analytics & insights</li>
                  <li>Quick setup & onboarding</li>
                  <li>Intuitive, modern interface</li>
                </ul>
              </div>
              
              <div className="p-8 text-center">
                <div className="text-gray-400 text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-neutral-dark mb-4">Spreadsheets & Email</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>Error-prone manual tracking</li>
                  <li>No automation or workflows</li>
                  <li>Security & compliance risks</li>
                  <li>Time-consuming processes</li>
                  <li>No scalability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-dark mb-4">Seamless Integrations</h2>
            <p className="text-lg text-gray-600">Connect with the tools your team already uses</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-purple-50/30 p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 text-center group">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {integration.logo}
                </div>
                <div className="text-sm font-medium text-gray-600">{integration.name}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">And 50+ more integrations available</p>
            <button className="text-primary font-semibold hover:underline">
              View All Integrations →
            </button>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-dark mb-6">
                Enterprise-Grade Security
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Your data security is our top priority. We employ industry-leading security measures to protect your sensitive HR information.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-600 font-medium">SOC 2 Type II Certified</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-600 font-medium">GDPR & CCPA Compliant</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-600 font-medium">256-bit SSL Encryption</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-600 font-medium">Regular Security Audits</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary-lavender/20 rounded-3xl p-8 border border-primary/20">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-dark mb-3">99.9% Uptime SLA</h3>
                  <p className="text-gray-600">Reliable, secure, and always available when you need it</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-neutral-white to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-neutral-dark mb-6">
            Ready to Experience All <span className="text-primary">Features?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your free trial today and discover how StreamlineHR can transform your HR operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleCtaClick}
              className="bg-gradient-to-r from-primary to-purple-800 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg transform hover:scale-105 hover:-translate-y-1"
            >
              Start Free Trial
            </button>
            <button 
              onClick={handleCtaClick}
              className="border-2 border-primary text-primary px-8 py-4 rounded-2xl hover:bg-primary/5 transition-all duration-300 font-bold text-lg"
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

const Features = () => {
  return (
    <PublicPageLayout>
      <FeaturesContent />
    </PublicPageLayout>
  );
};

export default Features; 