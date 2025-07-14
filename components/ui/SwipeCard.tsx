import React, { useState } from 'react';

interface SwipeCardProps {
  image: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children?: React.ReactNode;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  image,
  onSwipeLeft,
  onSwipeRight,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleSwipeLeft = () => {
    onSwipeLeft();
  };

  const handleSwipeRight = () => {
    onSwipeRight();
  };

  return (
    <div className="swipe-card">
      <div className="swipe-card__content">
        <img src={image} alt="Style option" className="swipe-card__image" />
        {children}
      </div>
      
      <div className="swipe-card__actions">
        <button 
          className="swipe-card__action swipe-card__action--dislike"
          onClick={handleSwipeLeft}
        >
          ✕
        </button>
        <button 
          className="swipe-card__action swipe-card__action--like"
          onClick={handleSwipeRight}
        >
          ✓
        </button>
      </div>
    </div>
  );
};