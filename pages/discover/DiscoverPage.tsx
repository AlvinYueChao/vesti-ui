import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Article, BannerData } from '../../types';
import { BannerCard } from '../../components/discover/BannerCard';
import { ContentSection } from '../../components/discover/ContentSection';
import { ArticleCard } from '../../components/discover/ArticleCard';
import { BottomNavigation } from '../../components/common/BottomNavigation';
import { getFavorites, isFavorite } from '../../utils/favoriteUtils';

// Mock data for articles - 初始状态都设为未收藏，实际状态会从 localStorage 同步
const mockArticles: Article[] = [
  {
    id: '1',
    title: '梨形身材如何扬长避短?',
    summary: '身形解析',
    thumbnail: '/assets/images/article-1.jpg',
    readCount: '5.1k',
    category: '穿搭知识库',
    isBookmarked: false
  },
  {
    id: '2',
    title: '色彩搭配入门：从邻近色开始',
    summary: '色彩美学',
    thumbnail: '/assets/images/article-2.jpg',
    readCount: '8.2k',
    category: '穿搭知识库',
    isBookmarked: false
  },
  {
    id: '3',
    title: '春季流行趋势解析',
    summary: '时尚趋势',
    thumbnail: '/assets/images/article-3.jpg',
    readCount: '3.7k',
    category: '穿搭知识库',
    isBookmarked: false
  },
  {
    id: '4',
    title: '职场穿搭的黄金法则',
    summary: '职场搭配',
    thumbnail: '/assets/images/article-4.jpg',
    readCount: '6.3k',
    category: '穿搭知识库',
    isBookmarked: false
  }
];

const bannerData: BannerData = {
  id: 'banner-1',
  title: '2025年度流行色报告：柔和桃',
  subtitle: '如何将Peach Fuzz融入日常穿搭',
  image: '/assets/images/banner-peach.jpg'
};

export const DiscoverPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('discover');
  const [articles, setArticles] = useState(mockArticles);



  // 在组件加载时同步收藏状态
  React.useEffect(() => {
    const syncBookmarkStatus = () => {
      setArticles(prevArticles =>
        prevArticles.map(article => ({
          ...article,
          isBookmarked: isFavorite(article.id)
        }))
      );
    };

    syncBookmarkStatus();
    
    // 监听收藏变化事件
    const handleFavoritesChange = () => {
      syncBookmarkStatus();
    };

    window.addEventListener('favoritesChanged', handleFavoritesChange);
    window.addEventListener('storage', handleFavoritesChange);
    
    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
      window.removeEventListener('storage', handleFavoritesChange);
    };
  }, []);

  const handleBannerClick = () => {
    // Navigate to banner article detail
    router.push(`/article/${bannerData.id}`);
  };

  const handleArticleClick = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  const handleBookmarkToggle = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    const favoriteArticle = {
      id: article.id,
      title: article.title,
      description: article.summary,
      imageUrl: article.thumbnail,
      category: article.category,
      publishDate: new Date().toLocaleDateString('zh-CN')
    };

    // 先更新本地状态，提供即时反馈
    const newBookmarkState = !article.isBookmarked;
    setArticles(prevArticles =>
      prevArticles.map(a =>
        a.id === articleId
          ? { ...a, isBookmarked: newBookmarkState }
          : a
      )
    );

    // 然后更新 localStorage
    try {
      const favorites = getFavorites();
      let updatedFavorites;
      
      if (newBookmarkState) {
        // 添加到收藏
        if (!favorites.some(fav => fav.id === articleId)) {
          updatedFavorites = [...favorites, favoriteArticle];
        } else {
          updatedFavorites = favorites;
        }
      } else {
        // 从收藏中移除
        updatedFavorites = favorites.filter(fav => fav.id !== articleId);
      }
      
      localStorage.setItem('favoriteArticles', JSON.stringify(updatedFavorites));
      
      // 触发事件通知其他组件
      window.dispatchEvent(new CustomEvent('favoritesChanged', {
        detail: { articleId, isBookmarked: newBookmarkState }
      }));
    } catch (error) {
      console.error('Error updating bookmark:', error);
      // 如果保存失败，回滚状态
      setArticles(prevArticles =>
        prevArticles.map(a =>
          a.id === articleId
            ? { ...a, isBookmarked: !newBookmarkState }
            : a
        )
      );
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    // Navigate to different pages based on tab selection
    switch (tabId) {
      case 'home':
        router.push('/home');
        break;
      case 'wardrobe':
        router.push('/wardrobe');
        break;
      case 'discover':
        router.push('/discover');
        break;
      case 'profile':
        router.push('/profile');
        break;
      default:
        break;
    }
  };

  return (
    <div className="discover-page">
      <header className="discover-page__header">
        <h1 className="discover-page__title">发现</h1>
      </header>

      <div className="discover-page__content">
        <BannerCard
          data={bannerData}
          onClick={handleBannerClick}
        />

        <ContentSection title="穿搭知识库">
          {articles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={() => handleArticleClick(article.id)}
              onBookmarkToggle={() => handleBookmarkToggle(article.id)}
            />
          ))}
        </ContentSection>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};