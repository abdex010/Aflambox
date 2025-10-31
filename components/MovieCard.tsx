import React, { useState } from 'react';
import { ContentItem } from '../types';
import { StarIcon } from './icons/StarIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { ShareIcon } from './icons/ShareIcon';
import { CheckIcon } from './icons/CheckIcon';

interface MovieCardProps {
  movie: ContentItem;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  progress: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isInWatchlist, onToggleWatchlist, progress }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleCardClick = () => {
    window.open('https://t.co/SCaSzYe7Cs', '_blank');
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWatchlist();
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.href.split('#')[0]}#movie=${movie.id}`;
    const shareData = {
      title: movie.title,
      text: `Check out "${movie.title}"!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        // Silently copy on card, but alert in modal
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg group cursor-pointer transition-all duration-300 hover:shadow-red-500/20 hover:shadow-2xl hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-700">
        {isImageLoading && <div className="absolute inset-0 animate-pulse bg-gray-700/80"></div>}
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 transition-opacity ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />
        
        {progress === 100 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
             <div className="flex items-center gap-2">
                <CheckIcon className="w-6 h-6 text-red-500" />
                <span className="font-bold text-white">Watched</span>
            </div>
          </div>
        )}
        
        <div className={`absolute top-2 left-2 transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}>
          <span className="bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded">
            {movie.quality}
          </span>
        </div>
        
        <div className={`absolute top-2 right-2 transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}>
          <div className="bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
            <StarIcon className="w-3 h-3 text-yellow-400" isFilled={true} />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        </div>

        {progress > 0 && progress < 100 && (
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-600/50" title={`Watched ${Math.floor(progress)}%`}>
            <div className="h-full bg-red-500 rounded-r-md" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
      <div className="p-3 flex items-start justify-between">
        <div>
          <h3 className="font-bold text-white group-hover:text-red-500 transition-colors duration-200 pr-2 leading-tight">{movie.title}</h3>
          <p className="text-gray-400 text-sm mt-1">{movie.year}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
           <button
              onClick={handleShareClick}
              aria-label="Share movie"
              className="bg-gray-700/80 p-1.5 rounded-full text-white hover:text-red-500 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-800 focus:ring-red-500 transition-colors"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleWatchlistClick}
              aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              className="flex-shrink-0 bg-gray-700/80 p-1.5 rounded-full text-white hover:text-red-500 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-800 focus:ring-red-500 transition-colors"
            >
              <BookmarkIcon className="w-5 h-5" isFilled={isInWatchlist} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;