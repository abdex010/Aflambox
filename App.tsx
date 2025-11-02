import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ContentItem } from './types';
import { CONTENT_ITEMS } from './constants';
import Header from './components/Header';
import Hero from './components/Hero';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import AiAssistantModal from './components/AiAssistantModal';
import { ChevronDownIcon } from './components/icons/ChevronDownIcon';
import Pagination from './components/Pagination';
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';
import SettingsModal from './components/SettingsModal'; // Import new component

type FilterType = 'All' | 'Movie' | 'TV Series' | 'TV Program' | 'Watchlist';
type LegalModalType = 'privacy' | 'disclaimer' | 'dmca' | null;

const ITEMS_PER_PAGE = 10;

const App: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>(CONTENT_ITEMS); // Make stateful
  const [selectedContentItem, setSelectedContentItem] = useState<ContentItem | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // New state
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [userRatings, setUserRatings] = useState<{ [key: number]: number }>({});
  const [watchProgress, setWatchProgress] = useState<{ [key: number]: number }>({});
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);

  const contentGridRef = useRef<HTMLHeadingElement>(null);
  const genreDropdownRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  
  // Memoize hero content, now dependent on stateful contentItems
  const heroContentItem = useMemo(() => contentItems.length > 0 ? contentItems[0] : null, [contentItems]);

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem('watchlist');
      if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));
      
      const storedRatings = localStorage.getItem('userRatings');
      if (storedRatings) setUserRatings(JSON.parse(storedRatings));

      const storedProgress = localStorage.getItem('watchProgress');
      if (storedProgress) setWatchProgress(JSON.parse(storedProgress));

      // Allow overriding default content with local data
      const storedContent = localStorage.getItem('contentItems');
      if(storedContent) setContentItems(JSON.parse(storedContent));


    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target as Node)) {
        setIsGenreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    setCurrentPage(1);

    const timeoutId = setTimeout(() => {
        contentGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    return () => clearTimeout(timeoutId);

  }, [activeFilter, activeGenre, searchQuery]);

  // Separate effect for saving state to localStorage without causing scrolls
  useEffect(() => {
    if (isInitialMount.current) return;
    try {
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      localStorage.setItem('userRatings', JSON.stringify(userRatings));
      localStorage.setItem('watchProgress', JSON.stringify(watchProgress));
      localStorage.setItem('contentItems', JSON.stringify(contentItems)); // Save content too
    } catch (error) {
      console.error("Failed to save to localStorage", error);
    }
  }, [watchlist, userRatings, watchProgress, contentItems]);


  const uniqueGenres = useMemo(() => {
    const allGenres = contentItems.flatMap(item => item.genre.split(', '));
    return ['All', ...Array.from(new Set(allGenres)).sort()];
  }, [contentItems]);

  const handleSelectContentItem = (item: ContentItem) => {
    setSelectedContentItem(item);
  };

  const handleCloseContentModal = () => {
    setSelectedContentItem(null);
  };

  const openAiModal = () => setIsAiModalOpen(true);
  const closeAiModal = () => setIsAiModalOpen(false);

  const openSettingsModal = () => setIsSettingsModalOpen(true); // New handler
  const closeSettingsModal = () => setIsSettingsModalOpen(false); // New handler
  
  const handleAiSelection = (item: ContentItem) => {
    closeAiModal();
    setTimeout(() => {
        handleSelectContentItem(item);
    }, 300);
  };

  const handleToggleWatchlist = (itemId: number) => {
    setWatchlist(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSetRating = (itemId: number, rating: number) => {
    setUserRatings(prev => {
      const currentRating = prev[itemId];
      if (currentRating === rating) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: rating };
    });
  };

  const handleSetProgress = (itemId: number, progress: number) => {
    setWatchProgress(prev => ({
      ...prev,
      [itemId]: progress,
    }));
  };
  
  const handleOpenLegalModal = (type: LegalModalType) => {
    setActiveLegalModal(type);
  };

  const handleExportData = () => {
    const dataToExport = {
      contentItems,
      watchlist,
      userRatings,
      watchProgress,
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aflambox_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("File could not be read");
        }
        const importedData = JSON.parse(text);
        
        // Basic validation
        if (
          !Array.isArray(importedData.contentItems) ||
          !Array.isArray(importedData.watchlist) ||
          typeof importedData.userRatings !== 'object' ||
          typeof importedData.watchProgress !== 'object'
        ) {
          throw new Error('Invalid file format');
        }

        setContentItems(importedData.contentItems);
        setWatchlist(importedData.watchlist);
        setUserRatings(importedData.userRatings);
        setWatchProgress(importedData.watchProgress);
        
        // Reset view
        setActiveFilter('All');
        setActiveGenre('All');
        setSearchQuery('');
        setCurrentPage(1);

        closeSettingsModal();
        alert('Data imported successfully!');

      } catch (error) {
        console.error("Failed to import data:", error);
        alert(`Error importing file: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure it is a valid exported JSON file.`);
      }
    };
    reader.onerror = () => {
        alert('Failed to read the file.');
    };
    reader.readAsText(file);
  };

  const filteredContent = useMemo(() => contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = activeGenre === 'All' || item.genre.split(', ').includes(activeGenre);

    if (activeFilter === 'Watchlist') {
      return watchlist.includes(item.id) && matchesSearch && matchesGenre;
    }
    
    const filterTypeMap: Record<FilterType, string | null> = {
      'All': null,
      'Movie': 'Movie',
      'TV Series': 'TV Series',
      'TV Program': 'TV Program',
      'Watchlist': null, // Handled separately
    };
};
    const typeToMatch = filterTypeMap[activeFilter];
    const matchesFilterType = !typeToMatch || item.type === typeToMatch;

    return matchesFilterType && matchesSearch && matchesGenre;
  [contentItems, searchQuery, activeGenre, activeFilter, watchlist]; {

  const continueWatchingContent = useMemo(() => {
    return contentItems
      .filter(item => watchProgress[item.id] > 0 && watchProgress[item.id] < 100)
      .sort((a, b) => (watchProgress[b.id] || 0) - (watchProgress[a.id] || 0)); // Or sort by last watched date
  }, [contentItems, watchProgress]);

  const totalPages = Math.ceil(filteredContent.length / ITEMS_PER_PAGE);

  const paginatedContent = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContent.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredContent, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      contentGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filterButtons: {label: string, value: FilterType}[] = [
    { label: 'Home', value: 'All' },
    { label: 'Movies', value: 'Movie' },
    { label: 'TV Series', value: 'TV Series' },
    { label: 'My Watchlist', value: 'Watchlist' },
  ];
  
  if (!heroContentItem) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">No Content Available</h1>
        <p className="text-gray-400">Import a data file to get started.</p>
        <button 
          onClick={openSettingsModal} 
          className="mt-6 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Open Settings
        </button>
        {isSettingsModalOpen && (
          <SettingsModal
            onClose={closeSettingsModal}
            onExport={handleExportData}
            onImport={handleImportData}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans">
      <Header 
        onOpenAiAssistant={openAiModal} 
        onOpenSettings={openSettingsModal}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="flex-grow">
        <Hero
          movie={heroContentItem}
          onSelectMovie={handleSelectContentItem}
          onToggleWatchlist={handleToggleWatchlist}
          isInWatchlist={watchlist.includes(heroContentItem.id)}
        />
        <main className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 border-b border-gray-700/60 pb-4 flex-wrap gap-4">
              <div className="flex items-center gap-4 sm:gap-6">
                {filterButtons.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setActiveFilter(value)}
                    className={`text-base sm:text-lg font-semibold transition-colors duration-300 focus:outline-none ${
                      activeFilter === value
                        ? 'text-red-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    aria-pressed={activeFilter === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
              
              <div className="relative" ref={genreDropdownRef}>
                <button
                  onClick={() => setIsGenreDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
                >
                  <span>{activeGenre}</span>
                  <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isGenreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isGenreDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg z-20 overflow-hidden ring-1 ring-black/5 animate-fade-in">
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {uniqueGenres.map((genre) => (
                        <button
                          key={genre}
                          onClick={() => { setActiveGenre(genre); setIsGenreDropdownOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {continueWatchingContent.length > 0 && (
              <div className="mb-12">
                <h1 className="text-3xl font-bold mb-6 text-gray-100">Continue Watching</h1>
                <MovieGrid 
                  movies={continueWatchingContent} 
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchProgress={watchProgress}
                />
              </div>
            )}

            <h1 ref={contentGridRef} className="text-3xl font-bold mb-6 text-gray-100">Trending</h1>
            
            <MovieGrid 
              movies={paginatedContent} 
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              watchProgress={watchProgress}
            />
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>

      {selectedContentItem && (
        <MovieModal 
          movie={selectedContentItem} 
          onClose={handleCloseContentModal}
          userRating={userRatings[selectedContentItem.id] || 0}
          onSetRating={handleSetRating}
          onSetProgress={handleSetProgress}
          watchProgress={watchProgress[selectedContentItem.id] || 0}
        />
      )}

      {isAiModalOpen && (
        <AiAssistantModal 
          movies={contentItems} 
          onClose={closeAiModal} 
          onSelectMovie={handleAiSelection}
        />
      )}
      
      {isSettingsModalOpen && (
        <SettingsModal 
          onClose={closeSettingsModal} 
          onExport={handleExportData}
          onImport={handleImportData}
        />
      )}

      {activeLegalModal && (
        <LegalModal type={activeLegalModal} onClose={() => setActiveLegalModal(null)} />
      )}

      <Footer onOpenLegalModal={handleOpenLegalModal} />
    </div>
  );
};

export default App;
