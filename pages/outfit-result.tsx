import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface OutfitItem {
  id: string;
  name: string;
  category: string;
  color: string;
  image: string;
}

interface OutfitRecommendation {
  id: string;
  items: OutfitItem[];
  description: string;
  suitability: string;
}

const OutfitResultPage: React.FC = () => {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);

  const { type, scenarioId, scenarioName } = router.query;

  useEffect(() => {
    if (!scenarioId) return;

    // 模拟API调用获取推荐搭配
    const loadRecommendations = () => {
      setTimeout(() => {
        const mockRecommendations: OutfitRecommendation[] = [
          {
            id: 'rec-1',
            items: [
              { id: 'item-1', name: '白色衬衫', category: '上装', color: '白色', image: '/assets/images/item-1.jpg' },
              { id: 'item-2', name: '黑色西装裤', category: '下装', color: '黑色', image: '/assets/images/item-2.jpg' },
              { id: 'item-3', name: '黑色皮鞋', category: '鞋子', color: '黑色', image: '/assets/images/item-3.jpg' }
            ],
            description: '经典商务搭配，专业而优雅',
            suitability: '95%'
          },
          {
            id: 'rec-2',
            items: [
              { id: 'item-4', name: '蓝色衬衫', category: '上装', color: '蓝色', image: '/assets/images/item-4.jpg' },
              { id: 'item-5', name: '灰色西装裤', category: '下装', color: '灰色', image: '/assets/images/item-5.jpg' },
              { id: 'item-6', name: '棕色皮鞋', category: '鞋子', color: '棕色', image: '/assets/images/item-6.jpg' }
            ],
            description: '温和的商务风格，适合日常工作',
            suitability: '88%'
          }
        ];
        
        setRecommendations(mockRecommendations);
        setLoading(false);
      }, 1000);
    };

    loadRecommendations();
  }, [scenarioId]);

  const handleBack = () => {
    router.back();
  };

  const handleOutfitSelect = (outfitId: string) => {
    setSelectedOutfit(outfitId);
  };

  const handleConfirmOutfit = () => {
    if (!selectedOutfit) {
      alert('请先选择一套搭配');
      return;
    }

    // 保存选择的搭配到穿搭日记
    const selectedRecommendation = recommendations.find(rec => rec.id === selectedOutfit);
    if (selectedRecommendation) {
      // 这里应该调用API保存搭配记录
      console.log('保存搭配记录:', selectedRecommendation);
      
      // 跳转到穿搭日记页面
      router.push('/outfit/diary');
    }
  };

  const handleTryAgain = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="outfit-result-page">
        <div className="outfit-result-page__loading">
          <div className="loading-spinner"></div>
          <p>AI正在为您精心搭配...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="outfit-result-page">
      {/* 顶部导航栏 */}
      <header className="outfit-result__header">
        <button className="back-button" onClick={handleBack}>
          <img src="/assets/icons/actions/chevron-left.svg" alt="返回" onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'inline';
          }} />
          <span style={{display: 'none'}}>←</span>
        </button>
        <h1 className="outfit-result__title">{scenarioName || '搭配推荐'}</h1>
      </header>

      {/* 推荐结果 */}
      <main className="outfit-result__main">
        <p className="outfit-result__subtitle">
          为您推荐了 {recommendations.length} 套搭配
        </p>

        <div className="outfit-recommendations">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className={`outfit-card ${selectedOutfit === recommendation.id ? 'selected' : ''}`}
              onClick={() => handleOutfitSelect(recommendation.id)}
            >
              <div className="outfit-card__header">
                <span className="outfit-card__suitability">匹配度 {recommendation.suitability}</span>
              </div>
              
              <div className="outfit-card__items">
                {recommendation.items.map((item, index) => (
                  <div key={item.id} className={`outfit-item outfit-item--${index % 3}`}>
                    <div className="outfit-item__placeholder">
                      <span className="outfit-item__icon">👔</span>
                    </div>
                    <p className="outfit-item__name">{item.name}</p>
                  </div>
                ))}
              </div>
              
              <p className="outfit-card__description">{recommendation.description}</p>
              
              {selectedOutfit === recommendation.id && (
                <div className="outfit-card__selected-indicator">
                  <span>✓ 已选择</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* 底部操作按钮 */}
      <footer className="outfit-result__footer">
        <button 
          className="outfit-result__action-btn outfit-result__action-btn--secondary"
          onClick={handleTryAgain}
        >
          重新推荐
        </button>
        <button 
          className="outfit-result__action-btn outfit-result__action-btn--primary"
          onClick={handleConfirmOutfit}
          disabled={!selectedOutfit}
        >
          确认搭配
        </button>
      </footer>
    </div>
  );
};

export default OutfitResultPage;