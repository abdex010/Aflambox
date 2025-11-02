import React, { useState, useRef } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { CogIcon } from './icons/CogIcon';

interface SettingsModalProps {
  onClose: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onExport, onImport }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onImport(file);
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClose}>
      <div 
        className={`bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col relative ${isClosing ? 'animate-slide-down-scale' : 'animate-slide-up-scale'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CogIcon className="w-6 h-6 text-red-500" />
            Application Settings
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close settings">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Export Data</h3>
            <p className="text-sm text-gray-400 mb-4">
              Download all application data, including the content library, your watchlist, and ratings, as a single JSON file. This can be used for backup or for editing the content externally.
            </p>
            <button
              onClick={onExport}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Export aflambox_data.json
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Import Data</h3>
            <p className="text-sm text-gray-400 mb-4">
              Upload a previously exported JSON file to restore or update the application's content. <strong className="text-yellow-400">Warning:</strong> This will overwrite all current data.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={handleChooseFileClick}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {fileName ? `Importing: ${fileName}` : 'Choose JSON File'}
            </button>
          </div>
          
          <div className="bg-gray-900/50 p-4 rounded-lg">
             <h3 className="text-md font-semibold text-white mb-2">WordPress Integration</h3>
             <p className="text-sm text-gray-400">
                To make this application's content editable via a CMS like WordPress, a developer can create a plugin that generates a compatible <code>aflambox_data.json</code> file. Site administrators can then upload that file here to update the content seamlessly.
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
