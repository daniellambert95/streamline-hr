import React, { useState, useEffect } from 'react';

const CookiesConsent = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if user has already made a cookie choice, if not set default
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Default to accept all cookies before user interaction
      localStorage.setItem('cookieConsent', 'all');
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setShowModal(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    setShowModal(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'none');
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <>
      {/* Cookie Button - Always Visible - Left Bottom */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={openModal}
          className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl text-primary transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2"
        >
          {/* Cookie SVG - Branded Lavender Design */}
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            {/* Cookie base - Lavender */}
            <circle cx="12" cy="12" r="10" fill="#BFA8FF" stroke="#A78BFF" strokeWidth="0.5"/>
            {/* Cookie chips - Primary purple */}
            <circle cx="8" cy="9" r="1" fill="#5729FF"/>
            <circle cx="15" cy="8" r="0.8" fill="#4A24E6"/>
            <circle cx="10" cy="14" r="1.2" fill="#5729FF"/>
            <circle cx="16" cy="13" r="0.9" fill="#4A24E6"/>
            <circle cx="13" cy="10" r="0.7" fill="#5729FF"/>
            <circle cx="7" cy="15" r="0.8" fill="#4A24E6"/>
            <circle cx="14" cy="16" r="0.6" fill="#5729FF"/>
            <circle cx="9" cy="11" r="0.5" fill="#4A24E6"/>
            {/* Cookie texture/crumbs - Lighter lavender */}
            <circle cx="11" cy="7" r="0.3" fill="#D1BDFF"/>
            <circle cx="17" cy="10" r="0.3" fill="#D1BDFF"/>
            <circle cx="6" cy="12" r="0.3" fill="#D1BDFF"/>
            <circle cx="12" cy="17" r="0.3" fill="#D1BDFF"/>
          </svg>
        </button>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal - Centered at bottom */}
          <div className="relative bg-neutral-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 mb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center">
                  {/* Cookie SVG for header */}
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    <circle cx="8" cy="10" r="0.8"/>
                    <circle cx="10" cy="14" r="0.8"/>
                    <circle cx="14" cy="12" r="0.8"/>
                    <circle cx="16" cy="8" r="0.8"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-dark">Cookie Preferences</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                You can change your preferences at any time.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-accent-green rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-neutral-dark">Necessary Cookies</p>
                    <p className="text-xs text-gray-500">Required for the website to function properly.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-accent-blue rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-neutral-dark">Analytics & Performance</p>
                    <p className="text-xs text-gray-500">Help us understand how you interact with our website.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleAcceptAll}
                className="w-full bg-gradient-to-r from-primary to-purple-800 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-sm transform hover:scale-[1.02]"
              >
                Accept All Cookies
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={handleAcceptNecessary}
                  className="flex-1 bg-neutral-white border-2 border-primary text-primary py-2.5 rounded-xl hover:bg-primary/5 transition-all duration-300 font-medium text-sm"
                >
                  Necessary Only
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium text-sm"
                >
                  Reject All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookiesConsent; 