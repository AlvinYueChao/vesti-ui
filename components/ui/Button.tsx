import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'heart';
  shape?: 'square' | 'circle';
  size?: 'medium' | 'large';
  className?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  shape = 'square',
  size = 'medium',
  className,
  fullWidth = false
}) => {
  const buttonClass = `btn btn--${variant} btn--${shape} btn--${size} ${fullWidth ? 'btn--full-width' : ''} ${className || ''}`.trim();

  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};