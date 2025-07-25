import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Article } from '../../types';

// Mock article data - in real app this would come from API
const mockArticleContent: Record<string, Article & { content: string }> = {
  '1': {
    id: '1',
    title: '梨形身材如何扬长避短?',
    summary: '身形解析',
    thumbnail: '/assets/images/article-1.jpg',
    readCount: '5.1k',
    category: '穿搭知识库',
    isBookmarked: false,
    content: `
      <h2>了解梨形身材特点</h2>
      <p>梨形身材的特点是上身相对较窄，下身较宽，臀部和大腿是身体最宽的部分。这种身材类型需要通过穿搭来平衡上下身的比例。</p>
      
      <h2>扬长避短的穿搭技巧</h2>
      <h3>1. 突出上身</h3>
      <p>选择亮色、有图案或装饰的上衣来吸引注意力到上半身。</p>
      
      <h3>2. 选择合适的下装</h3>
      <p>深色、直筒或微喇的裤子可以很好地修饰下半身线条。</p>
      
      <h3>3. 配饰的运用</h3>
      <p>项链、耳环等上身配饰可以进一步突出上半身的优势。</p>
    `
  },
  '2': {
    id: '2',
    title: '色彩搭配入门：从邻近色开始',
    summary: '色彩美学',
    thumbnail: '/assets/images/article-2.jpg',
    readCount: '8.2k',
    category: '穿搭知识库',
    isBookmarked: true,
    content: `
      <h2>什么是邻近色</h2>
      <p>邻近色是指在色环上相邻的颜色，它们之间有着天然的和谐感。</p>
      
      <h2>邻近色搭配的优势</h2>
      <p>邻近色搭配看起来自然、舒适，不会产生强烈的视觉冲击，适合日常穿搭。</p>
      
      <h2>实用搭配建议</h2>
      <p>蓝色系：海军蓝 + 天蓝色 + 青色</p>
      <p>暖色系：橙色 + 红色 + 粉色</p>
    `
  },
  'banner-1': {
    id: 'banner-1',
    title: '2025年度流行色报告：柔和桃',
    summary: '流行趋势',
    thumbnail: '/assets/images/banner-peach.jpg',
    readCount: '12.5k',
    category: '流行趋势',
    isBookmarked: false,
    content: `
      <h2>2025年度流行色：柔和桃</h2>
      <p>Pantone发布的2025年度流行色"柔和桃"(Peach Fuzz)代表着温暖、舒适和治愈的力量。</p>
      
      <h2>如何将柔和桃融入日常穿搭</h2>
      <h3>1. 作为主色调</h3>
      <p>选择柔和桃色的连衣裙或上衣作为整体造型的焦点。</p>
      
      <h3>2. 作为点缀色</h3>
      <p>通过配饰如丝巾、包包来添加柔和桃色元素。</p>
      
      <h3>3. 色彩搭配建议</h3>
      <p>柔和桃 + 奶白色：清新自然</p>
      <p>柔和桃 + 浅灰色：优雅知性</p>
      <p>柔和桃 + 深蓝色：经典对比</p>
    `
  }
};

const ArticleDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isBookmarked, setIsBookmarked] = useState(false);

  const article = id ? mockArticleContent[id as string] : null;

  // 检查文章是否已收藏
  useEffect(() => {
    if (article) {
      const savedFavorites = localStorage.getItem('favoriteArticles');
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setIsBookmarked(favorites.some((fav: any) => fav.id === article.id));
      }
    }
  }, [article]);

  const handleBookmarkToggle = () => {
    if (!article) return;

    const savedFavorites = localStorage.getItem('favoriteArticles');
    let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

    if (isBookmarked) {
      // 从收藏中移除
      favorites = favorites.filter((fav: any) => fav.id !== article.id);
    } else {
      // 添加到收藏
      const favoriteArticle = {
        id: article.id,
        title: article.title,
        description: article.summary,
        imageUrl: article.thumbnail,
        category: article.category,
        publishDate: new Date().toLocaleDateString('zh-CN')
      };

      // 检查是否已存在，避免重复
      if (!favorites.find((fav: any) => fav.id === article.id)) {
        favorites.push(favoriteArticle);
      }
    }

    localStorage.setItem('favoriteArticles', JSON.stringify(favorites));
    setIsBookmarked(!isBookmarked);
  };

  if (!article) {
    return (
      <div className="article-detail">
        <div className="article-detail__header">
          <button onClick={() => router.back()} className="back-button">
            <img src="/assets/icons/actions/chevron-left.svg" alt="返回" onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'inline';
            }} />
            <span style={{display: 'none'}}>←</span>
          </button>
        </div>
        <div className="article-detail__content">
          <p>文章未找到</p>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <div className="article-detail__header">
        <button onClick={() => router.back()} className="back-button">
          <img src="/assets/icons/actions/chevron-left.svg" alt="返回" onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'inline';
          }} />
          <span style={{display: 'none'}}>←</span>
        </button>
        <h1 className="article-detail__title">{article.title}</h1>
        <button
          className={`bookmark-button ${isBookmarked ? 'bookmark-button--active' : ''}`}
          onClick={handleBookmarkToggle}
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 2C3 1.44772 3.44772 1 4 1H12C12.5523 1 13 1.44772 13 2V14L8 11L3 14V2Z"
              fill={isBookmarked ? "#FF6B6B" : "none"}
              stroke={isBookmarked ? "#FF6B6B" : "#999"}
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      <div className="article-detail__content">
        <div className="article-detail__meta">
          <span className="article-detail__category">{article.category}</span>
          <span className="article-detail__read-count">{article.readCount} 人阅读</span>
        </div>

        <div
          className="article-detail__body"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
};

export default ArticleDetailPage;