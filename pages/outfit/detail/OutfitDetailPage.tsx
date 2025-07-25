import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useOutfitDiary, OutfitRecord } from '../../../hooks/useOutfitDiary';

const OutfitDetailPage: React.FC = () => {
  const router = useRouter();
  const [outfitDetail, setOutfitDetail] = useState<OutfitRecord | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 从路由参数获取outfitId
  const { id: outfitId } = router.query;
  
  // 使用穿搭日记hook
  const { records, deleteOutfitRecord } = useOutfitDiary('user-123');

  useEffect(() => {
    // 确保outfitId存在且为字符串
    if (!outfitId || typeof outfitId !== 'string') {
      setLoading(false);
      return;
    }

    // 从记录中查找对应的穿搭详情
    const loadOutfitDetail = () => {
      const detail = records.find(record => record.id === outfitId);
      setOutfitDetail(detail || null);
      setLoading(false);
    };

    loadOutfitDetail();
  }, [outfitId, records]);

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

  const handleDeleteRecord = async () => {
    if (!outfitDetail || !outfitId) return;
    
    const confirmMessage = `确定要删除 ${new Date(outfitDetail.date).getMonth() + 1}月${new Date(outfitDetail.date).getDate()}日 的穿搭记录吗？\n\n删除后将无法恢复。`;
    
    if (confirm(confirmMessage)) {
      try {
        await deleteOutfitRecord(outfitId as string);
        alert('穿搭记录已删除');
        router.back();
      } catch (error) {
        console.error('删除记录失败:', error);
        alert('删除失败，请重试');
      }
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
          <p className="outfit-detail-page__ai-note-content">
            {outfitDetail.aiDesignerNote || outfitDetail.aiComment || '这是一套精心搭配的组合。'}
          </p>
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