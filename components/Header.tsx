import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { SearchIcon } from './icons/SearchIcon';

interface HeaderProps {
  onOpenAiAssistant: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAiAssistant, searchQuery, onSearchChange }) => {
  return (
    <header className="bg-gray-900/70 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white whitespace-nowrap">
              <span className="text-red-500">Aflam</span>box
            </h1>
          </div>
          <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">
            <div className="relative flex-1 max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-gray-800 text-white placeholder-gray-400 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500 w-full transition-all"
                aria-label="Search content"
              />
            </div>
            <button
              onClick={onOpenAiAssistant}
              className="flex-shrink-0 flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <SparklesIcon className="w-5 h-5" />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;