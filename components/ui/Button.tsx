import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  shape?: 'square' | 'circle';
  size?: 'medium' | 'large';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  shape = 'square',
  size = 'medium',
  className 
}) => {
  const buttonClass = `btn btn--${variant} btn--${shape} btn--${size} ${className || ''}`.trim();

  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};