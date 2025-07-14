import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showSlogan?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', showSlogan = false }) => {
  return (
    <div className={`logo logo--${size}`}>
      <div className="logo__icon">
        {/* 口袋设计师 Logo Icon */}
      </div>
      <h1 className="logo__title">口袋设计师</h1>
      {showSlogan && (
        <p className="logo__slogan">你的AI专属设计师</p>
      )}
    </div>
  );
};