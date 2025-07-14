import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showSlogan?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', showSlogan = false }) => {
  return (
    <div className={`logo logo--${size}`}>
      <div className="logo__icon">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 3L6 11V25L16 29L26 25V11L16 3Z" fill="#FF5A5F"/>
          <path d="M16 3L16 29" stroke="white" strokeWidth="2"/>
          <path d="M16 16L26 11" stroke="white" strokeWidth="1.5"/>
        </svg>
      </div>
      <h1 className="logo__title">口袋设计师</h1>
      {showSlogan && (
        <p className="logo__slogan">你的AI专属设计师</p>
      )}
    </div>
  );
};