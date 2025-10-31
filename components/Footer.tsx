import React from 'react';

interface FooterProps {
  onOpenLegalModal: (type: 'privacy' | 'disclaimer' | 'dmca') => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenLegalModal }) => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700/60 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <button onClick={() => onOpenLegalModal('privacy')} className="text-gray-400 hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => onOpenLegalModal('disclaimer')} className="text-gray-400 hover:text-white transition-colors">Disclaimer</button>
            <button onClick={() => onOpenLegalModal('dmca')} className="text-gray-400 hover:text-white transition-colors">DMCA</button>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Copyright &copy; {new Date().getFullYear()} Aflambox. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;