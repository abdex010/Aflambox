import React from 'react';
import { ContentItem } from '../types';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: ContentItem[];
  watchlist: number[];
  onToggleWatchlist: (itemId: number) => void;
  watchProgress?: { [key: number]: number };
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, watchlist, onToggleWatchlist, watchProgress = {} }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          isInWatchlist={watchlist.includes(movie.id)}
          onToggleWatchlist={() => onToggleWatchlist(movie.id)}
          progress={watchProgress[movie.id] || 0}
        />
      ))}
    </div>
  );
};

export default MovieGrid;