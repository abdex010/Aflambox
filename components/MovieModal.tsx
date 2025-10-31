import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ContentItem } from '../types';
import { generateSummary } from '../services/geminiService';
import { CloseIcon } from './icons/CloseIcon';
import { PlayIcon } from './icons/PlayIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { StarIcon } from './icons/StarIcon';
import { ShareIcon } from './icons/ShareIcon';
import StarRating from './StarRating';

interface MovieModalProps {
  movie: ContentItem | null;
  onClose: () => void;
  userRating: number;
  onSetRating: (itemId: number, rating: number) => void;
  onSetProgress: (itemId: number, progress: number) => void;
  watchProgress: number;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose, userRating, onSetRating, onSetProgress, watchProgress }) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleGenerateSummary = useCallback(async () => {
    if (!movie) return;
    setIsLoadingSummary(true);
    setAiSummary('');
    const summary = await generateSummary(movie.title, movie.description, movie.type);
    setAiSummary(summary);
    setIsLoadingSummary(false);
  }, [movie]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Animation duration
  };
  
  useEffect(() => {
    setIsClosing(false);
    setAiSummary('');
    setIsLoadingSummary(false);
    setIsTrailerPlaying(false); // Reset trailer state on movie change
  }, [movie]);
  
  // Effect for tracking video progress
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !movie) return;

    const handleTimeUpdate = () => {
      if (videoElement.duration) {
        const progress = (videoElement.currentTime / videoElement.duration) * 100;
        onSetProgress(movie.id, progress);
      }
    };
    
    const handleVideoEnd = () => {
      onSetProgress(movie.id, 100);
      setIsTrailerPlaying(false);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleVideoEnd);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, [isTrailerPlaying, movie, onSetProgress]);


  if (!movie) return null;

  const handleRatingChange = (newRating: number) => {
    if (movie) {
      onSetRating(movie.id, newRating);
    }
  };
  
  const handleShare = async () => {
    if (!movie) return;
    setShareFeedback('');
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
        console.error('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareFeedback('Link Copied!');
        setTimeout(() => setShareFeedback(''), 2500);
      } catch (err) {
        console.error('Failed to copy:', err);
        setShareFeedback('Copy Failed!');
        setTimeout(() => setShareFeedback(''), 2500);
      }
    }
  };


  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className={`bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative ${isClosing ? 'animate-slide-down-scale' : 'animate-slide-up-scale'}`}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close modal"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="md:col-span-1">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto object-cover rounded-l-lg" />
          </div>

          <div className="md:col-span-2 p-6 md:p-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">{movie.title}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-gray-400">
              <span>{movie.year}</span>
              <span className="border-l border-gray-600 pl-4">{movie.genre}</span>
               <span className="border-l border-gray-600 pl-4 bg-gray-700 text-gray-300 px-2 py-0.5 rounded-md text-xs">{movie.type}</span>
               <div className="border-l border-gray-600 pl-4 flex items-center gap-1.5 text-yellow-400">
                    <StarIcon className="w-5 h-5" isFilled={true} />
                    <span className="font-bold text-white">{(movie.rating / 2).toFixed(1)}</span>
                    <span className="text-gray-400 text-sm">/ 5</span>
                </div>
            </div>
            
            <p className="text-gray-300 mb-6">{movie.description}</p>
            
            <div className="flex flex-wrap items-stretch gap-4 mb-6">
                <div className="flex-1 bg-gray-900/50 p-4 rounded-lg min-w-[200px]">
                    <h3 className="text-lg font-semibold text-white mb-2">Your Rating</h3>
                    <StarRating 
                        rating={userRating}
                        onRatingChange={handleRatingChange}
                    />
                </div>
                <div className="relative">
                    <button 
                        onClick={handleShare}
                        className="w-full h-full flex items-center justify-center gap-2 bg-gray-900/50 hover:bg-gray-700/50 text-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                        aria-label="Share movie"
                    >
                        <ShareIcon className="w-5 h-5" />
                        <span>Share</span>
                    </button>
                    {shareFeedback && (
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap animate-fade-in">
                            {shareFeedback}
                        </div>
                    )}
                </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">Official Trailer</h3>
            <div className="relative aspect-video bg-black rounded-lg mb-6 overflow-hidden ring-1 ring-gray-700">
              {isTrailerPlaying ? (
                <video
                  ref={videoRef}
                  src="https://t.co/SCaSzYe7Cs"
                  className="w-full h-full"
                  controls
                  autoPlay
                />
              ) : (
                <>
                  <img src={movie.posterUrl} alt={`${movie.title} trailer placeholder`} className="w-full h-full object-cover opacity-20" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <button
                      onClick={() => setIsTrailerPlaying(true)}
                      className="text-white/80 hover:text-white hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
                      aria-label="Play trailer"
                    >
                      <PlayIcon className="w-20 h-20" />
                    </button>
                    <p className="mt-2 text-sm font-semibold text-white/60">Play Trailer</p>
                  </div>
                  {watchProgress > 0 && watchProgress < 100 && (
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-600/50">
                        <div className="h-full bg-red-500" style={{ width: `${watchProgress}%` }}></div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-red-500"/>
                        AI Summary
                    </h3>
                    <button
                        onClick={handleGenerateSummary}
                        disabled={isLoadingSummary}
                        className="bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoadingSummary ? 'Generating...' : 'Regenerate'}
                    </button>
                </div>
                {isLoadingSummary && (
                  <div className="space-y-2.5 pt-1">
                    <div className="h-4 bg-gray-700 rounded-full w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded-full w-5/6 animate-pulse" style={{ animationDelay: '100ms' }}></div>
                    <div className="h-4 bg-gray-700 rounded-full w-3/4 animate-pulse" style={{ animationDelay: '200ms' }}></div>
                  </div>
                )}
                {aiSummary && <p className="text-gray-300">{aiSummary}</p>}
                {!aiSummary && !isLoadingSummary && <p className="text-gray-500">Click "Regenerate" to get an AI-powered summary.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;