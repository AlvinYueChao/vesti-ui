import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface FavoriteArticle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  publishDate: string;
}

const FavoritesPage: React.FC = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从本地存储获取收藏的文章
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('favoriteArticles');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();

    // 监听收藏变化事件
    const handleFavoritesChange = () => {
      loadFavorites();
    };

    window.addEventListener('favoritesChanged', handleFavoritesChange);
    window.addEventListener('storage', handleFavoritesChange);

    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
      window.removeEventListener('storage', handleFavoritesChange);
    };
  }, []);

  const handleRemoveFavorite = (articleId: string) => {
    const updatedFavorites = favorites.filter(article => article.id !== articleId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteArticles', JSON.stringify(updatedFavorites));
    
    // 触发事件通知其他组件状态变化
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { articleId, isBookmarked: false }
    }));
  };

  const handleArticleClick = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="favorites-page__header">
          <button className="favorites-page__back-btn" onClick={handleBack}>
            ‹
          </button>
          <h1 className="favorites-page__title">我的收藏</h1>
        </div>
        <div className="favorites-page__loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-page__header">
        <button className="favorites-page__back-btn" onClick={handleBack}>
          ‹
        </button>
        <h1 className="favorites-page__title">我的收藏</h1>
      </div>

      <div className="favorites-page__content">
        {favorites.length === 0 ? (
          <div className="favorites-page__empty">
            <div className="favorites-page__empty-icon">🔖</div>
            <p className="favorites-page__empty-text">还没有收藏任何文章</p>
            <p className="favorites-page__empty-subtitle">去发现页面收藏喜欢的内容吧</p>
            <button 
              className="favorites-page__discover-btn"
              onClick={() => router.push('/discover')}
            >
              去发现
            </button>
          </div>
        ) : (
          <div className="favorites-page__list">
            {favorites.map((article) => (
              <div
                key={article.id}
                className="favorites-page__item"
                onClick={() => handleArticleClick(article.id)}
              >
                <div className="favorites-page__item-image">
                  <img src={article.imageUrl} alt={article.title} />
                </div>
                <div className="favorites-page__item-content">
                  <h3 className="favorites-page__item-title">{article.title}</h3>
                  <p className="favorites-page__item-description">{article.description}</p>
                  <div className="favorites-page__item-meta">
                    <span className="favorites-page__item-category">{article.category}</span>
                    <span className="favorites-page__item-date">{article.publishDate}</span>
                  </div>
                </div>
                <button
                  className="favorites-page__remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(article.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;