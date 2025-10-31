import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface LegalModalProps {
  type: 'privacy' | 'disclaimer' | 'dmca';
  onClose: () => void;
}

const LegalContent: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <>
    <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
    <div className="space-y-4 text-gray-300 prose prose-invert prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white">
      {children}
    </div>
  </>
);

const PrivacyPolicy = () => (
  <LegalContent title="Privacy Policy">
    <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
    <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
    <h4>Information We Collect</h4>
    <p>We may collect information that you provide directly to us, as well as information that is automatically collected when you use our services. This includes watch history, ratings, and items added to your watchlist, which are stored locally on your device using your browser's <strong>localStorage</strong>.</p>
    <h4>How We Use Your Information</h4>
    <p>We use the information we collect to operate, maintain, and provide the features and functionality of the Service, to personalize your experience, and to understand how you use the Service in order to improve it.</p>
    <h4>Third-Party Services</h4>
    <p>This application uses the Google Gemini API to provide AI-powered summaries and recommendations. Your interactions with these features may be subject to Google's Privacy Policy.</p>
    <h4>Contact Us</h4>
    <p>If you have any questions about this Privacy Policy, You can contact us by email: contact@aflambox.example.com.</p>
  </LegalContent>
);

const Disclaimer = () => (
  <LegalContent title="Disclaimer">
    <p>The information provided by Aflambox ("we," "us," or "our") on this website is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
    <h4>External Links Disclaimer</h4>
    <p>The site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.</p>
    <h4>Content Disclaimer</h4>
    <p>Aflambox is a demonstrational application. All movie titles, posters, descriptions, and other related content are for illustrative purposes only and are properties of their respective owners. This service does not provide access to stream or download copyrighted material.</p>
  </LegalContent>
);

const DMCA = () => (
  <LegalContent title="DMCA Policy">
    <p>Aflambox respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, we will respond expeditiously to claims of copyright infringement committed using the Aflambox service that are reported to our Designated Copyright Agent.</p>
    <h4>Notification of Copyright Infringement</h4>
    <p>If you are a copyright owner and you believe that any content on our service infringes your copyrights, you may submit a notification pursuant to the DMCA by providing our Copyright Agent with the following information in writing:</p>
    <ul>
      <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
      <li>Identification of the copyrighted work claimed to have been infringed.</li>
      <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material.</li>
      <li>Your contact information, including your address, telephone number, and an email address.</li>
    </ul>
    <p>Our designated Copyright Agent to receive notifications of claimed infringement is: dmca@aflambox.example.com.</p>
  </LegalContent>
);


const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Animation duration
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const renderContent = () => {
    switch (type) {
      case 'privacy':
        return <PrivacyPolicy />;
      case 'disclaimer':
        return <Disclaimer />;
      case 'dmca':
        return <DMCA />;
      default:
        return null;
    }
  };

  return (
     <div className={`fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClose}>
      <div 
        className={`bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col relative ${isClosing ? 'animate-slide-down-scale' : 'animate-slide-up-scale'}`}
        onClick={(e) => e.stopPropagation()}
       >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close modal"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        <div className="p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
