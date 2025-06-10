import { useState } from 'react';
import { HiX, HiMail } from 'react-icons/hi';
import { NewsletterService } from '../../services/newsletterService';
import { toast } from 'react-hot-toast';

interface EmailSignupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string; // Add source tracking
}

const EmailSignupPopup = ({ isOpen, onClose, source = 'popup' }: EmailSignupPopupProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      const result = await NewsletterService.subscribe(email, source);
      
      if (result.success) {
        setIsSubmitted(true);
        toast.success(result.message);
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
          setEmail('');
        }, 2000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      toast.error('Sorry, there was an error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset state when modal closes
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 sm:p-8 transform transition-all duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <HiX className="w-6 h-6" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiMail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-dark mb-2">
                Get Notified When We Launch!
              </h2>
              <p className="text-gray-600">
                Be the first to know when StreamlineHR becomes available. We'll send you exclusive early access and special launch pricing.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full bg-gradient-to-r from-primary to-purple-800 text-white py-3 px-6 rounded-xl font-semibold text-base hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Signing up...
                  </div>
                ) : (
                  'Notify Me at Launch'
                )}
              </button>
            </form>

            {/* Trust indicators */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-accent-green mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  No spam
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-accent-green mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Unsubscribe anytime
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-dark mb-2">
              You're all set!
            </h2>
            <p className="text-gray-600">
              We'll notify you as soon as StreamlineHR launches. Thank you for your interest!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailSignupPopup; 