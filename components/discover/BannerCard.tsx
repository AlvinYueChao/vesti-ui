import React from 'react';
import { BannerData } from '../../types';

interface BannerCardProps {
  data: BannerData;
  onClick: () => void;
}

export const BannerCard: React.FC<BannerCardProps> = ({ data, onClick }) => {
  return (
    <div className="banner-card" onClick={onClick}>
      <div className="banner-card__content">
        <div className="banner-card__icons">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i}>?</span>
          ))}
        </div>
        <h2 className="banner-card__title">{data.title}</h2>
        <p className="banner-card__subtitle">{data.subtitle}</p>
      </div>
    </div>
  );
};