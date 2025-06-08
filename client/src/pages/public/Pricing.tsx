import { useState } from 'react';
import { PRICING_PLANS, PRICING_FEATURES } from '../../shared/constants/pricing';
import Footer from '../../components/common/Footer';
import EmailSignupPopup from '../../components/common/EmailSignupPopup';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
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
            Transparent Pricing
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-dark mb-6 leading-tight">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose the plan that fits your team size and needs. All plans include our core HR features with varying levels of advanced functionality.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-white">
        <div className="max-w-7xl mx-auto">
          {/* Pricing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`text-sm font-medium mr-3 ${!isYearly ? 'text-neutral-dark' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isYearly ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ml-3 ${isYearly ? 'text-neutral-dark' : 'text-gray-500'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-green/20 text-accent-green">
                Save {PRICING_FEATURES.discountPercentage}%
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-neutral-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-neutral-dark mb-2">{PRICING_PLANS.starter.name}</h3>
                <p className="text-gray-600 mb-4">{PRICING_PLANS.starter.description}</p>
                <div className="text-4xl font-bold text-neutral-dark">
                  ${isYearly ? PRICING_PLANS.starter.yearly : PRICING_PLANS.starter.monthly}
                  <span className="text-lg text-gray-500">/month</span>
                </div>
                {isYearly && (
                  <p className="text-sm text-accent-green font-medium mt-1">
                    ${PRICING_PLANS.starter.yearly * 12} billed annually
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">Up to {PRICING_PLANS.starter.employees} employees</p>
              </div>
              <ul className="space-y-4 mb-8">
                {PRICING_PLANS.starter.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-accent-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={handleCtaClick}
                className="w-full border-2 border-primary text-primary py-3 rounded-xl hover:bg-primary/5 transition-all duration-300 font-semibold"
              >
                Start Free Trial
              </button>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-r from-primary to-secondary-navy text-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 relative md:col-span-2 lg:col-span-1">
              {PRICING_PLANS.professional.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent-orange text-neutral-dark px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{PRICING_PLANS.professional.name}</h3>
                <p className="text-primary-100 mb-4">{PRICING_PLANS.professional.description}</p>
                <div className="text-4xl font-bold">
                  ${isYearly ? PRICING_PLANS.professional.yearly : PRICING_PLANS.professional.monthly}
                  <span className="text-lg text-primary-200">/month</span>
                </div>
                {isYearly && (
                  <p className="text-sm text-primary-100 font-medium mt-1">
                    ${PRICING_PLANS.professional.yearly * 12} billed annually
                  </p>
                )}
                <p className="text-sm text-primary-200 mt-2">Up to {PRICING_PLANS.professional.employees} employees</p>
              </div>
              <ul className="space-y-4 mb-8">
                {PRICING_PLANS.professional.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-accent-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={handleCtaClick}
                className="w-full bg-white text-primary py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold"
              >
                Start Free Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-neutral-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-neutral-dark mb-2">{PRICING_PLANS.enterprise.name}</h3>
                <p className="text-gray-600 mb-4">{PRICING_PLANS.enterprise.description}</p>
                <div className="text-4xl font-bold text-neutral-dark">{PRICING_PLANS.enterprise.price}</div>
                <p className="text-sm text-gray-500 mt-2">{PRICING_PLANS.enterprise.employees} employees</p>
              </div>
              <ul className="space-y-4 mb-8">
                {PRICING_PLANS.enterprise.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-accent-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={handleCtaClick}
                className="w-full border-2 border-primary text-primary py-3 rounded-xl hover:bg-primary/5 transition-all duration-300 font-semibold"
              >
                Contact Sales
              </button>
            </div>
          </div>

          {/* Feature List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 px-4">
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-600 font-medium">{PRICING_FEATURES.trialDays}-day free trial</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-600 font-medium">No setup fees</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-600 font-medium">Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-dark mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about our pricing</p>
          </div>
          
          <div className="space-y-4">
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <summary className="font-semibold text-lg cursor-pointer flex items-center justify-between">
                What payment methods do you accept?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise plans. All payments are processed securely through our encrypted payment system.</p>
            </details>
            
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <summary className="font-semibold text-lg cursor-pointer flex items-center justify-between">
                Can I change my plan later?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately, and we'll prorate any billing adjustments on your next invoice.</p>
            </details>
            
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <summary className="font-semibold text-lg cursor-pointer flex items-center justify-between">
                Is there a free trial available?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">We offer a {PRICING_FEATURES.trialDays}-day free trial for all our plans. No credit card required to start your trial. You'll have full access to all features during the trial period.</p>
            </details>
            
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <summary className="font-semibold text-lg cursor-pointer flex items-center justify-between">
                What happens if I exceed my employee limit?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">We'll notify you when you're approaching your plan limit. You can easily upgrade to the next tier or contact our sales team for a custom solution. We never lock you out of your account.</p>
            </details>
            
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <summary className="font-semibold text-lg cursor-pointer flex items-center justify-between">
                Do you offer discounts for non-profits or startups?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">Yes! We offer special pricing for qualifying non-profit organizations and early-stage startups. Contact our sales team with details about your organization to learn about available discounts.</p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-neutral-white to-primary/10 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary-lavender/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-neutral-dark mb-6">
            Ready to Transform Your <span className="text-primary">HR Operations?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your {PRICING_FEATURES.trialDays}-day free trial today. No credit card required.
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
      <EmailSignupPopup isOpen={isPopupOpen} onClose={closePopup} />
    </div>
  );
};

export default Pricing;