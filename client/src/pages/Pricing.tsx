const Pricing = () => {
    return (
      <div className="font-sans">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
          <p className="text-lg">Choose a plan that fits your hiring needs.</p>
        </section>
  
        {/* Pricing Cards */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Basic Plan */}
            <div className="bg-white shadow-lg rounded-lg p-8 text-center border-t-4 border-blue-500 hover:shadow-2xl transition">
              <h3 className="text-2xl font-semibold mb-4">Basic</h3>
              <p className="text-gray-600 mb-4">For small teams and startups</p>
              <p className="text-4xl font-bold text-indigo-600 mb-6">$29<span className="text-lg font-normal">/month</span></p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>✔ 10 Job Listings</li>
                <li>✔ 10 Unlimited Applicants</li>
                <li>✔ Basic Analytics</li>
                <li>✔ Email Support</li>
              </ul>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                Choose Plan
              </button>
            </div>
  
            {/* Pro Plan */}
            <div className="bg-white shadow-lg rounded-lg p-8 text-center border-t-4 border-indigo-600 hover:shadow-2xl transition scale-105">
              <h3 className="text-2xl font-semibold mb-4">Pro</h3>
              <p className="text-gray-600 mb-4">For growing businesses</p>
              <p className="text-4xl font-bold text-indigo-600 mb-6">$69<span className="text-lg font-normal">/month</span></p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>✔ 25 Job Listings</li>
                <li>✔ 25 Unlimited Applicants</li>
                <li>✔ Advanced Analytics</li>
                <li>✔ Priority Support</li>
                <li>✔ LinkedIn Support</li>
              </ul>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                Choose Plan
              </button>
            </div>
  
            {/* Enterprise Plan */}
            <div className="bg-white shadow-lg rounded-lg p-8 text-center border-t-4 border-purple-500 hover:shadow-2xl transition">
              <h3 className="text-2xl font-semibold mb-4">Enterprise</h3>
              <p className="text-gray-600 mb-4">For large organizations</p>
              <p className="text-4xl font-bold text-indigo-600 mb-6">Custom</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>✔ Unlimited Job Listings</li>
                <li>✔ Unlimited Applicants</li>
                <li>✔ Full Analytics Suite</li>
                <li>✔ Dedicated Account Manager</li>
                <li>✔ LinkedIn Support</li>
              </ul>
              <button className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition">
                Contact Sales
              </button>
            </div>
          </div>
        </section>
  
        {/* FAQ Section */}
        <section className="py-16 px-6 bg-white text-center">
          <h2 className="text-3xl font-semibold mb-8">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6 text-gray-600">
            <details className="p-4 border rounded-lg">
              <summary className="font-medium cursor-pointer">What payment methods do you accept?</summary>
              <p className="mt-2">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
            </details>
            <details className="p-4 border rounded-lg">
              <summary className="font-medium cursor-pointer">Can I change my plan later?</summary>
              <p className="mt-2">Yes, you can upgrade or downgrade your plan at any time from your account settings.</p>
            </details>
            <details className="p-4 border rounded-lg">
              <summary className="font-medium cursor-pointer">Is there a free trial available?</summary>
              <p className="mt-2">We offer a 14-day free trial for our Pro plan. No credit card required.</p>
            </details>
          </div>
        </section>
      </div>
    );
  };
  
  export default Pricing;