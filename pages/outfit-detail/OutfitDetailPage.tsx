import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  material: string;
  image: string;
}

interface OutfitDetail {
  id: string;
  date: string;
  dayOfWeek: string;
  weather: {
    location: string;
    temperature: string;
    condition: string;
  };
  image: string;
  aiDesignerNote: string;
  items: ClothingItem[];
}

interface OutfitDetailPageProps {
  outfitId: string;
}

const OutfitDetailPage: React.FC<OutfitDetailPageProps> = ({ outfitId }) => {
  const router = useRouter();
  const [outfitDetail, setOutfitDetail] = useState<OutfitDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - 在实际应用中这里会从API获取数据
  const mockOutfitDetails: Record<string, OutfitDetail> = {
    '1': {
      id: '1',
      date: '2025-07-09',
      dayOfWeek: '星期三',
      weather: {
        location: '上海',
        temperature: '29°C',
        condition: '晴'
      },
      image: '/assets/images/outfit-detail-1.jpg',
      aiDesignerNote: '蓝色衬衫与白色短裤的组合，在炎热的夏日带来一丝清凉，是经典的休闲搭配。草编包的点缀增添了度假氛围。',
      items: [
        {
          id: 'item-1',
          name: '条纹衬衫',
          category: '上装',
          color: '蓝色',
          material: '棉',
          image: '/assets/images/item-1.jpg'
        },
        {
          id: 'item-2',
          name: '白色短裤',
          category: '下装',
          color: '白色',
          material: '棉',
          image: '/assets/images/item-2.jpg'
        },
        {
          id: 'item-3',
          name: '草编包',
          category: '配饰',
          color: '黄色',
          material: '草编',
          image: '/assets/images/item-3.jpg'
        }
      ]
    },
    '2': {
      id: '2',
      date: '2025-07-03',
      dayOfWeek: '星期四',
      weather: {
        location: '上海',
        temperature: '32°C',
        condition: '多云'
      },
      image: '/assets/images/outfit-detail-2.jpg',
      aiDesignerNote: '粉色上衣与黑色下装的经典搭配，既保持了女性的柔美，又不失职场的专业感。适合夏日办公室穿着。',
      items: [
        {
          id: 'item-4',
          name: '粉色衬衫',
          category: '上装',
          color: '粉色',
          material: '丝绸',
          image: '/assets/images/item-4.jpg'
        },
        {
          id: 'item-5',
          name: '黑色西装裤',
          category: '下装',
          color: '黑色',
          material: '聚酯纤维',
          image: '/assets/images/item-5.jpg'
        }
      ]
    },
    '3': {
      id: '3',
      date: '2025-07-23',
      dayOfWeek: '星期三',
      weather: {
        location: '上海',
        temperature: '28°C',
        condition: '晴'
      },
      image: '/assets/images/outfit-detail-3.jpg',
      aiDesignerNote: '红白配色经典而醒目，适合需要展现活力和自信的场合。简洁的设计让整体造型更加干净利落。',
      items: [
        {
          id: 'item-6',
          name: '红色T恤',
          category: '上装',
          color: '红色',
          material: '棉',
          image: '/assets/images/item-6.jpg'
        },
        {
          id: 'item-7',
          name: '白色牛仔裤',
          category: '下装',
          color: '白色',
          material: '牛仔布',
          image: '/assets/images/item-7.jpg'
        }
      ]
    }
  };

  useEffect(() => {
    // 模拟API调用
    const loadOutfitDetail = () => {
      setTimeout(() => {
        const detail = mockOutfitDetails[outfitId];
        setOutfitDetail(detail || null);
        setLoading(false);
      }, 500);
    };

    loadOutfitDetail();
  }, [outfitId]);

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    if (!outfitDetail) return;

    const shareData = {
      title: `我的穿搭 - ${new Date(outfitDetail.date).getMonth() + 1}月${new Date(outfitDetail.date).getDate()}日`,
      text: outfitDetail.aiDesignerNote,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // 降级方案：复制链接到剪贴板
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板，可以分享给朋友了！');
      }
    } catch (error) {
      console.error('分享失败:', error);
      // 最后的降级方案
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板');
      } catch (clipboardError) {
        alert('分享功能暂不可用，请手动复制页面链接');
      }
    }
  };

  const handleItemClick = (itemId: string) => {
    // 跳转到衣橱中的单品详情页
    router.push(`/wardrobe/item/${itemId}`);
  };

  const handleDeleteRecord = () => {
    const confirmMessage = `确定要删除 ${new Date(outfitDetail?.date || '').getMonth() + 1}月${new Date(outfitDetail?.date || '').getDate()}日 的穿搭记录吗？\n\n删除后将无法恢复。`;
    
    if (confirm(confirmMessage)) {
      // 这里应该调用API删除记录
      console.log('删除记录:', outfitId);
      
      // 模拟删除成功
      alert('穿搭记录已删除');
      router.back();
    }
  };

  const handleFindSimilar = () => {
    // 基于当前穿搭的风格特征，跳转到发现页面查找相似内容
    const styleParams = new URLSearchParams({
      style: 'similar',
      colors: outfitDetail?.items.map(item => item.color).join(',') || '',
      category: outfitDetail?.items.map(item => item.category).join(',') || '',
      source: 'outfit-detail'
    });
    
    router.push(`/discover?${styleParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="outfit-detail-page">
        <div className="outfit-detail-page__loading">加载中...</div>
      </div>
    );
  }

  if (!outfitDetail) {
    return (
      <div className="outfit-detail-page">
        <div className="outfit-detail-page__error">穿搭记录不存在</div>
      </div>
    );
  }

  return (
    <div className="outfit-detail-page">
      {/* 顶部导航栏 */}
      <header className="outfit-detail-page__header">
        <button className="outfit-detail-page__back-btn" onClick={handleBack}>
          ‹
        </button>
        <h1 className="outfit-detail-page__title">穿搭详情</h1>
        <button className="outfit-detail-page__share-btn" onClick={handleShare}>
          ↗
        </button>
      </header>

      {/* 穿搭主图 */}
      <div className={`outfit-detail-page__main-image outfit-detail-page__main-image--${outfitDetail.id}`}>
        <div className="outfit-detail-page__outfit-placeholder">
          <div className="outfit-detail-page__outfit-icons">
            <span>👔</span>
            <span>👔</span>
            <span>👔</span>
            <span>👔</span>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="outfit-detail-page__content">
        {/* 日期与天气信息 */}
        <div className="outfit-detail-page__date-weather">
          <div className="outfit-detail-page__date">
            {new Date(outfitDetail.date).getMonth() + 1}月{new Date(outfitDetail.date).getDate()}日，{outfitDetail.dayOfWeek}
          </div>
          <div className="outfit-detail-page__weather">
            <span className="outfit-detail-page__location">{outfitDetail.weather.location}</span>
            <span className="outfit-detail-page__temperature">{outfitDetail.weather.temperature}</span>
            <span className="outfit-detail-page__condition">{outfitDetail.weather.condition}</span>
          </div>
        </div>

        {/* AI设计师说 */}
        <div className="outfit-detail-page__ai-note">
          <h3 className="outfit-detail-page__ai-note-title">AI设计师说：</h3>
          <p className="outfit-detail-page__ai-note-content">{outfitDetail.aiDesignerNote}</p>
        </div>

        {/* 套装单品列表 */}
        <div className="outfit-detail-page__items">
          <h3 className="outfit-detail-page__items-title">套装单品 ({outfitDetail.items.length})</h3>
          <div className="outfit-detail-page__items-list">
            {outfitDetail.items.map((item, index) => (
              <div 
                key={item.id}
                className="outfit-detail-page__item"
                onClick={() => handleItemClick(item.id)}
              >
                <div className={`outfit-detail-page__item-image outfit-detail-page__item-image--${index % 3}`}>
                  <span className="outfit-detail-page__item-icon">?</span>
                </div>
                <div className="outfit-detail-page__item-info">
                  <h4 className="outfit-detail-page__item-name">{item.name}</h4>
                  <div className="outfit-detail-page__item-tags">
                    <span className="outfit-detail-page__item-tag">{item.category}</span>
                    <span className="outfit-detail-page__item-tag">{item.color}</span>
                    <span className="outfit-detail-page__item-tag">{item.material}</span>
                  </div>
                </div>
                <div className="outfit-detail-page__item-arrow">›</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="outfit-detail-page__actions">
        <button 
          className="outfit-detail-page__action-btn outfit-detail-page__action-btn--secondary"
          onClick={handleDeleteRecord}
        >
          删除记录
        </button>
        <button 
          className="outfit-detail-page__action-btn outfit-detail-page__action-btn--primary"
          onClick={handleFindSimilar}
        >
          查找相似风格
        </button>
      </div>
    </div>
  );
};

export default OutfitDetailPage;