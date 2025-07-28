import React from 'react';
import { BannerData } from '../../types';
import { getPlaceholderImage, logImageUsage } from '../../utils/imageUtils';

interface BannerCardProps {
  data: BannerData;
  onClick: () => void;
}

export const BannerCard: React.FC<BannerCardProps> = ({ data, onClick }) => {
  // 记录使用占位符图片的警告
  React.useEffect(() => {
    logImageUsage('BannerCard');
  }, []);

  return (
    <div className="banner-card" onClick={onClick}>
      <div className="banner-card__content">
        <div className="banner-card__image">
          <img 
            src={getPlaceholderImage(data.image)}
            alt={data.title}
          />
        </div>
        <h2 className="banner-card__title">{data.title}</h2>
        <p className="banner-card__subtitle">{data.subtitle}</p>
      </div>
    </div>
  );
};