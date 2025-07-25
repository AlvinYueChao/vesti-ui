import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface OutfitItem {
  id: string;
  name: string;
  image: string;
  category: string;
  isFromWardrobe?: boolean;
  isNetworkImage?: boolean;
}

interface OutfitResultPageProps {
  scenario?: string;
  items: OutfitItem[];
  aiComment: string;
}

export const OutfitResultPage: React.FC<OutfitResultPageProps> = ({
  scenario = '海边度假搭配',
  items = [
    {
      id: '1',
      name: '蓝色条纹T恤',
      image: '/assets/images/top-blue.jpg',
      category: 'top'
    },
    {
      id: '2', 
      name: '白色短裤',
      image: '/assets/images/bottom-white.jpg',
      category: 'bottom'
    },
    {
      id: '3',
      name: '棕色凉鞋',
      image: '/assets/images/shoes-brown.jpg', 
      category: 'shoes'
    }
  ],
  aiComment = '蓝白条纹对衫与白色短裤是经典的夏日组合，轻松营造优雅。搭配单鞋和包包，完美贴合海边环境，时尚亦文舒适。'
}) => {
  const router = useRouter();

  const handleAcceptOutfit = () => {
    console.log('Outfit accepted and recorded');
  };

  const handleTryAnother = () => {
    console.log('Generate another outfit');
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
        <section className="outfit-display">
          <div className="outfit-items-grid">
            {items.map(item => (
              <div key={item.id} className="outfit-item">
                <div className="outfit-item__image">
                  <img src={item.image} alt={item.name} />
                  {item.isNetworkImage && (
                    <div className="outfit-item__network-badge">网图</div>
                  )}
                  {item.isFromWardrobe && (
                    <div className="outfit-item__wardrobe-badge">衣橱</div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Placeholder for remaining slots */}
            {Array.from({ length: 4 - items.length }).map((_, index) => (
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
          >
            采纳并记录
          </button>
          <button 
            className="action-button secondary"
            onClick={handleTryAnother}
          >
            换一套
          </button>
        </div>
      </main>
    </div>
  );
};