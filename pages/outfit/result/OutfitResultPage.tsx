import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface OutfitItem {
  id: string;
  name: string;
  image: string;
  category: string;
  subType?: 'regular' | 'outerwear';
  isFromWardrobe?: boolean;
  isNetworkImage?: boolean;
  isLocked?: boolean;
}

interface OutfitResultPageProps {
  scenario?: string;
  items: OutfitItem[];
  aiComment: string;
  onGenerateNewOutfit?: (lockedItems: OutfitItem[]) => void;
  onAcceptOutfit?: (items: OutfitItem[]) => void;
  isGenerating?: boolean;
  isSaving?: boolean;
}

export const OutfitResultPage: React.FC<OutfitResultPageProps> = ({
  scenario = '海边度假搭配',
  items = [
    {
      id: '1',
      name: '蓝色条纹T恤',
      image: '/assets/images/top-blue.jpg',
      category: 'tops',
      subType: 'regular',
      isFromWardrobe: true
    },
    {
      id: '2', 
      name: '白色短裤',
      image: '/assets/images/bottom-white.jpg',
      category: 'bottoms',
      isNetworkImage: true
    },
    {
      id: '3',
      name: '棕色凉鞋',
      image: '/assets/images/shoes-brown.jpg', 
      category: 'shoes',
      isFromWardrobe: true
    },
    {
      id: '4',
      name: '黑色西装外套',
      image: '/assets/images/jacket-black.jpg',
      category: 'tops',
      subType: 'outerwear',
      isFromWardrobe: true
    }
  ],
  aiComment = '蓝白条纹对衫与白色短裤是经典的夏日组合，轻松营造优雅。搭配单鞋和包包，完美贴合海边环境，时尚亦文舒适。',
  onGenerateNewOutfit,
  onAcceptOutfit,
  isGenerating = false,
  isSaving = false
}) => {
  const router = useRouter();
  const [outfitItems, setOutfitItems] = useState<OutfitItem[]>(items);

  // 同步外部传入的 items
  React.useEffect(() => {
    setOutfitItems(items);
  }, [items]);

  const toggleItemLock = useCallback((itemId: string) => {
    setOutfitItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, isLocked: !item.isLocked }
          : item
      )
    );
  }, []);

  const handleAcceptOutfit = () => {
    if (onAcceptOutfit) {
      onAcceptOutfit(outfitItems);
    } else {
      console.log('Outfit accepted and recorded', outfitItems);
    }
  };

  const handleTryAnother = () => {
    const lockedItems = outfitItems.filter(item => item.isLocked);
    const allItemsLocked = outfitItems.length > 0 && lockedItems.length === outfitItems.length;
    
    if (allItemsLocked) {
      alert('所有单品已锁定，无法生成新方案');
      return;
    }

    if (onGenerateNewOutfit) {
      onGenerateNewOutfit(lockedItems);
    } else {
      console.log('Generate another outfit with locked items:', lockedItems);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="outfit-result-page">
      <header className="outfit-result__header">
        <button className="back-button" onClick={handleBack}>
          <img src="/assets/icons/actions/chevron-left.svg" alt="返回" onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'inline';
          }} />
          <span style={{display: 'none'}}>←</span>
        </button>
        <div className="header-title">
          <h1 className="page-title">{scenario}</h1>
        </div>
      </header>

      <main className="outfit-result__main">
        {/* Virtual Try-On Display Area */}
        <section className="virtual-tryon-display">
          <div className="model-display">
            <div className="model-placeholder">
              <div className="model-icon">👤</div>
              <p className="model-text">虚拟试穿效果</p>
            </div>
          </div>
        </section>

        {/* Enhanced Outfit Items Grid */}
        <section className="outfit-display">
          <h3 className="section-title">套装单品</h3>
          <div className="outfit-items-grid">
            {outfitItems.map(item => (
              <div key={item.id} className={`outfit-item ${item.isLocked ? 'outfit-item--locked' : ''}`}>
                <div className="outfit-item__image">
                  <img src={item.image} alt={item.name} />
                  
                  {/* Source Tag */}
                  {item.isFromWardrobe && (
                    <div className="outfit-item__source-tag outfit-item__source-tag--wardrobe">衣橱</div>
                  )}
                  {item.isNetworkImage && (
                    <div className="outfit-item__source-tag outfit-item__source-tag--network">网图</div>
                  )}
                  
                  {/* SubType Icon */}
                  {item.subType === 'outerwear' && (
                    <div className="outfit-item__subtype-icon">🧥</div>
                  )}
                  
                  {/* Lock Icon */}
                  <button 
                    className={`outfit-item__lock-btn ${item.isLocked ? 'outfit-item__lock-btn--locked' : ''}`}
                    onClick={() => toggleItemLock(item.id)}
                    aria-label={item.isLocked ? '解锁单品' : '锁定单品'}
                  >
                    {item.isLocked ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
                      </svg>
                    )}
                  </button>
                </div>
                <div className="outfit-item__name">
                  {item.name}
                  {item.subType === 'outerwear' && (
                    <span className="outfit-item__subtype-tag">外套</span>
                  )}
                </div>
              </div>
            ))}
            
            {/* Placeholder for remaining slots */}
            {Array.from({ length: Math.max(0, 4 - outfitItems.length) }).map((_, index) => (
              <div key={`placeholder-${index}`} className="outfit-item">
                <div className="outfit-item__placeholder">
                  <span className="item-icon">?</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ai-recommendation">
          <h3 className="ai-title">AI设计师说：</h3>
          <p className="ai-description">{aiComment}</p>
        </section>

        <div className="action-buttons">
          <button 
            className="action-button primary"
            onClick={handleAcceptOutfit}
            disabled={isGenerating || isSaving}
          >
            {isSaving ? '保存中...' : '采纳并记录'}
          </button>
          <button 
            className="action-button secondary"
            onClick={handleTryAnother}
            disabled={isGenerating || isSaving}
          >
            {isGenerating ? '生成中...' : '换一套'}
          </button>
        </div>
      </main>
    </div>
  );
};