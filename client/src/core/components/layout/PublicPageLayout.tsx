import { useState, ReactNode, createContext, useContext } from 'react';
import Navbar from './Navbar';
import Footer from '../../../components/common/Footer';
import EmailSignupPopup from '../../../components/common/EmailSignupPopup';

interface PublicPageLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  source?: string;
}

interface CTAContextType {
  handleCtaClick: () => void;
}

const CTAContext = createContext<CTAContextType | undefined>(undefined);

export const useCTA = () => {
  const context = useContext(CTAContext);
  if (context === undefined) {
    throw new Error('useCTA must be used within a PublicPageLayout');
  }
  return context;
};

const PublicPageLayout = ({ 
  children, 
  showNavbar = true, 
  showFooter = true,
  source = 'layout'
}: PublicPageLayoutProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCtaClick = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <CTAContext.Provider value={{ handleCtaClick }}>
      <div className="font-sans">
        {showNavbar && <Navbar onCtaClick={handleCtaClick} />}
        {children}
        {showFooter && <Footer onCtaClick={handleCtaClick} />}
        <EmailSignupPopup isOpen={isPopupOpen} onClose={closePopup} source={source} />
      </div>
    </CTAContext.Provider>
  );
};

export default PublicPageLayout;
