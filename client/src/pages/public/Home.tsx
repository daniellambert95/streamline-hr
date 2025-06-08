// src/pages/Home.tsx
import {
  HeroSection,
  TrustIndicators,
  CoreFeaturesSection,
  VelocityScrollSection,
  SocialProofSection,
  PricingSection,
  FinalCtaSection
} from '../../components/public/home';
import Footer from '../../components/common/Footer';
import CookiesConsent from '../../components/common/CookiesConsent';
import ChatBot from '../../components/common/ChatBot';

const Home = () => {
  return (
    <div className="font-sans">
      <HeroSection />
      {/* <TrustIndicators /> */}
      <CoreFeaturesSection />
      <VelocityScrollSection />
      {/* <SocialProofSection /> */}
      <PricingSection />
      <FinalCtaSection />
      <Footer />
      <CookiesConsent />
      <ChatBot />
    </div>
  );
};

export default Home;