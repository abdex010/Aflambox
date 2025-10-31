import React from 'react';
import { ContentItem } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import Tooltip from './Tooltip';

interface HeroProps {
  movie: ContentItem;
  onSelectMovie: (movie: ContentItem) => void;
  onToggleWatchlist: (itemId: number) => void;
  isInWatchlist: boolean;
}

const Hero: React.FC<HeroProps> = ({ movie, onSelectMovie, onToggleWatchlist, isInWatchlist }) => {
  return (
    <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] text-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover object-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">{movie.title}</h1>
            <div className="flex items-center gap-4 my-4 text-gray-300 font-semibold">
            <span>{movie.year}</span>
            <span className="text-gray-500">&bull;</span>
            <span>{movie.genre}</span>
            </div>
            <p className="text-gray-200 mb-8 line-clamp-3 leading-relaxed">{movie.description}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Tooltip text="Watch trailer and see details" position="bottom">
                <button 
                    onClick={() => onSelectMovie(movie)} 
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    <PlayIcon className="w-6 h-6" />
                    <span>View Details</span>
                </button>
              </Tooltip>
              <Tooltip text={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'} position="bottom">
                <button 
                    onClick={() => onToggleWatchlist(movie.id)} 
                    className="flex items-center gap-2 bg-black/40 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                >
                    <BookmarkIcon className="w-6 h-6" isFilled={isInWatchlist} />
                    <span>{isInWatchlist ? 'On Watchlist' : 'Add to Watchlist'}</span>
                </button>
              </Tooltip>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
