import { useState } from 'react';
import { PRICING_PLANS } from '../../../shared/constants/pricing';

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-neutral-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-xs sm:text-sm font-semibold text-primary mb-3 sm:mb-4">PRICING</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-dark mb-3 sm:mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">Choose the plan that fits your team size and needs</p>
          
          {/* Pricing Toggle */}
          <div className="flex items-center justify-center mb-8 sm:mb-12">
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
                Save 20%
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-neutral-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-dark mb-2">Starter</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Perfect for small teams</p>
              <div className="text-3xl sm:text-4xl font-bold text-neutral-dark">
                ${isYearly ? PRICING_PLANS.starter.yearly : PRICING_PLANS.starter.monthly}
                <span className="text-base sm:text-lg text-gray-500">/{isYearly ? 'month' : 'month'}</span>
              </div>
              {isYearly && (
                <p className="text-sm text-accent-green font-medium mt-1">
                  ${PRICING_PLANS.starter.yearly * 12} billed annually
                </p>
              )}
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Up to 10 employees</p>
            </div>
            <ul className="space-y-3 mb-6 sm:mb-8">
              <li className="flex items-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-accent-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 text-sm sm:text-base">Basic Applicant Tracking</span>
              </li>
              <li className="flex items-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-accent-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 text-sm sm:text-base">Employee Management</span>
              </li>
              <li className="flex items-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-accent-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 text-sm sm:text-base">Time Tracking</span>
              </li>
              <li className="flex items-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-accent-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 text-sm sm:text-base">Email Support</span>
              </li>
            </ul>
            <button className="w-full border-2 border-primary text-primary py-3 rounded-xl hover:bg-primary/5 transition-all duration-300 font-semibold text-sm sm:text-base">
              Start Free Trial
            </button>
          </div>

          {/* Professional Plan */}
          <div className="bg-gradient-to-r from-primary to-secondary-navy text-white rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 relative md:col-span-2 lg:col-span-1">
            <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 bg-accent-orange text-neutral-dark px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
              Most Popular
            </div>
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Professional</h3>
              <p className="text-primary-100 mb-3 sm:mb-4 text-sm sm:text-base">For growing companies</p>
              <div className="text-3xl sm:text-4xl font-bold">
                ${isYearly ? PRICING_PLANS.professional.yearly : PRICING_PLANS.professional.monthly}
                <span className="text-base sm:text-lg text-primary-200">/{isYearly ? 'month' : 'month'}</span>
              </div>
              {isYearly && (
                <p className="text-sm text-primary-100 font-medium mt-1">
                  ${PRICING_PLANS.professional.yearly * 12} billed annually
                </p>
              )}
              <p className="text-xs sm:text-sm text-primary-200 mt-2">Up to 50 employees</p>
            </div>
            <ul className="space-y-3 mb-6 sm:mb-8">
              <li className="flex items-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-accent-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm sm:text-base">Advanced AI Matching</span>
              </li>
              <li className="flex items-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-accent-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm sm:text-base">Performance Management</span>
              </li>
              <li className="flex items-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-accent-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm sm:text-base">Advanced Analytics</span>
              </li>
              <li className="flex items-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-accent-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm sm:text-base">Priority Support</span>
              </li>
            </ul>
            <button className="w-full bg-white text-primary py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold text-sm sm:text-base">
              Start Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-neutral-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-dark mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">For large organizations</p>
              <div className="text-3xl sm:text-4xl font-bold text-neutral-dark">Custom</div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Unlimited employees</p>
            </div>
            <ul className="space-y-3 mb-6 sm:mb-8">
              <li className="flex items-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-accent-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 text-sm sm:text-base">Custom Integration</span>
              </li>
              <li className="flex items-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-accent-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 text-sm sm:text-base">White-label Solution</span>
              </li>
              <li className="flex items-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-accent-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 text-sm sm:text-base">Dedicated Support</span>
              </li>
              <li className="flex items-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-accent-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 text-sm sm:text-base">SLA Guarantee</span>
              </li>
            </ul>
            <button className="w-full border-2 border-primary text-primary py-3 rounded-xl hover:bg-primary/5 transition-all duration-300 font-semibold text-sm sm:text-base">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 