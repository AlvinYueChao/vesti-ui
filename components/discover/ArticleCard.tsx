import React from 'react';
import { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  onBookmarkToggle: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  onClick, 
  onBookmarkToggle 
}) => {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkToggle();
  };

  return (
    <div className="article-card" onClick={onClick}>
      <div className="article-card__thumbnail">
        <div className="article-card__placeholder">
          <span>?</span><span>?</span><span>?</span><span>?</span>
        </div>
      </div>
      
      <div className="article-card__content">
        <div className="article-card__category">{article.summary}</div>
        <h3 className="article-card__title">{article.title}</h3>
        
        <div className="article-card__footer">
          <span className="article-card__read-count">{article.readCount} 人阅读</span>
          <button 
            className={`article-card__bookmark ${article.isBookmarked ? 'article-card__bookmark--active' : ''}`}
            onClick={handleBookmarkClick}
            title={article.isBookmarked ? '取消收藏' : '收藏文章'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path 
                d="M3 2C3 1.44772 3.44772 1 4 1H12C12.5523 1 13 1.44772 13 2V14L8 11L3 14V2Z" 
                fill={article.isBookmarked ? "#FF6B6B" : "none"}
                stroke={article.isBookmarked ? "#FF6B6B" : "#999"}
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};