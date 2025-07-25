// 收藏功能的工具函数

export interface FavoriteArticle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  publishDate: string;
}

export const getFavorites = (): FavoriteArticle[] => {
  try {
    const savedFavorites = localStorage.getItem('favoriteArticles');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const isFavorite = (articleId: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === articleId);
};

export const addToFavorites = (article: FavoriteArticle): boolean => {
  try {
    const favorites = getFavorites();
    
    // 检查是否已存在
    if (favorites.some(fav => fav.id === article.id)) {
      return false; // 已存在，不重复添加
    }
    
    favorites.push(article);
    localStorage.setItem('favoriteArticles', JSON.stringify(favorites));
    
    // 触发事件通知
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { articleId: article.id, isBookmarked: true }
    }));
    
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

export const removeFromFavorites = (articleId: string): boolean => {
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== articleId);
    
    localStorage.setItem('favoriteArticles', JSON.stringify(updatedFavorites));
    
    // 触发事件通知
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { articleId, isBookmarked: false }
    }));
    
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

export const toggleFavorite = (article: FavoriteArticle): boolean => {
  const isCurrentlyFavorite = isFavorite(article.id);
  
  if (isCurrentlyFavorite) {
    return removeFromFavorites(article.id);
  } else {
    return addToFavorites(article);
  }
};

