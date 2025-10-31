import React, { useState } from 'react';
import { StarIcon } from './icons/StarIcon';

interface StarRatingProps {
  count?: number;
  rating: number;
  onRatingChange: (rating: number) => void;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  count = 5,
  rating,
  onRatingChange,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    onRatingChange(index);
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(count)].map((_, i) => {
        const starIndex = i + 1;
        const isFilled = (hoverRating || rating) >= starIndex;
        
        return (
          <button
            key={starIndex}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starIndex)}
            className="focus:outline-none transform transition-transform duration-150 hover:scale-125"
            aria-label={`Rate ${starIndex} star${starIndex > 1 ? 's' : ''}`}
          >
            <StarIcon
              className={`w-8 h-8 cursor-pointer ${isFilled ? 'text-yellow-400' : 'text-gray-500'}`}
              isFilled={isFilled}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
