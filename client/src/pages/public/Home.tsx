// src/pages/Home.tsx
import { useState } from 'react';
import {
  HeroSection,
  CoreFeaturesSection,
  VelocityScrollSection,
  PricingSection,
  FinalCtaSection
} from '../../components/public/home';
import Footer from '../../components/common/Footer';
import CookiesConsent from '../../components/common/CookiesConsent';
import ChatBot from '../../components/common/ChatBot';
import EmailSignupPopup from '../../components/common/EmailSignupPopup';

const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCtaClick = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="font-sans">
      <HeroSection onCtaClick={handleCtaClick} />
      {/* <TrustIndicators /> */}
      <CoreFeaturesSection />
      <VelocityScrollSection />
      {/* <SocialProofSection /> */}
      <PricingSection onCtaClick={handleCtaClick} />
      <FinalCtaSection onCtaClick={handleCtaClick} />
      <Footer onCtaClick={handleCtaClick} />
      <CookiesConsent />
      <ChatBot />
      <EmailSignupPopup isOpen={isPopupOpen} onClose={closePopup} />
    </div>
  );
};

export default Home;