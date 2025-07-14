import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  shadow?: boolean;
  padding?: 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  shadow = true,
  padding = 'medium',
}) => {
  const classes = [
    'card',
    `card--padding-${padding}`,
    shadow && 'card--shadow',
    onClick && 'card--clickable',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};