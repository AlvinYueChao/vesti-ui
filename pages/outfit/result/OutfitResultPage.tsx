import React from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface OutfitItem {
  id: string;
  name: string;
  image: string;
  category: string;
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

  const handleAcceptOutfit = () => {
    console.log('Outfit accepted and recorded');
  };

  const handleTryAnother = () => {
    console.log('Generate another outfit');
  };

  return (
    <div className="outfit-result">
      <header className="outfit-result__header">
        <button className="back-button">←</button>
        <h1 className="outfit-result__title">{scenario}</h1>
      </header>

      <main className="outfit-result__main">
        <section className="outfit-display">
          <div className="outfit-grid">
            {items.map(item => (
              <Card key={item.id} className="outfit-item">
                <div className="outfit-item__image">
                  <img src={item.image} alt={item.name} />
                </div>
              </Card>
            ))}
            
            {/* Placeholder for remaining slots */}
            {Array.from({ length: 4 - items.length }).map((_, index) => (
              <Card key={`placeholder-${index}`} className="outfit-item outfit-item--placeholder">
                <div className="outfit-item__placeholder">
                  <span className="outfit-item__placeholder-icon">?</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="ai-comment">
          <h3 className="ai-comment__title">AI设计师说：</h3>
          <p className="ai-comment__text">{aiComment}</p>
        </section>
      </main>

      <footer className="outfit-result__footer">
        <Button 
          variant="primary" 
          size="large"
          onClick={handleAcceptOutfit}
        >
          采纳并记录
        </Button>
        <Button 
          variant="secondary" 
          size="large"
          onClick={handleTryAnother}
        >
          换一套
        </Button>
      </footer>
    </div>
  );
};