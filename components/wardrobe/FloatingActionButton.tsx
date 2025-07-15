
import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button 
      className="fab fab--add"
      onClick={onClick}
    >
      +
    </button>
  );
};
