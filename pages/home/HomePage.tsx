import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../components/ui/Button';
import { BottomNavigation } from '../../components/common/BottomNavigation';

interface OutfitRecommendation {
  id: string;
  items: string[];
  image: string;
  style: string;
}

const HomePage: React.FC = () => {
  const router = useRouter();
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('home');

  const recommendations: OutfitRecommendation[] = [
    {
      id: '1',
      items: ['白色衬衫', '黑色西装裤', '小白鞋'],
      image: '/assets/images/outfit-1.jpg',
      style: '商务休闲'
    },
    {
      id: '2', 
      items: ['蓝色牛仔裤', '白色T恤', '运动鞋'],
      image: '/assets/images/outfit-2.jpg',
      style: '休闲舒适'
    }
  ];

  const weather = {
    location: '上海',
    temperature: '28°C',
    condition: '晴'
  };

  const handlePreviousOutfit = () => {
    setCurrentOutfitIndex(prev => 
      prev > 0 ? prev - 1 : recommendations.length - 1
    );
  };

  const handleNextOutfit = () => {
    setCurrentOutfitIndex(prev => 
      prev < recommendations.length - 1 ? prev + 1 : 0
    );
  };

  const handleLikeOutfit = () => {
    console.log('Liked outfit:', recommendations[currentOutfitIndex]);
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

  const handleHelpMeStyle = () => {
    // Navigate to wardrobe page for item selection
    router.push('/wardrobe?mode=select');
  };

  const handleScenarioStyling = () => {
    // Navigate to scenario selection page
    router.push('/scenario-selection');
  };

  const currentOutfit = recommendations[currentOutfitIndex];

  return (
    <div className="home-page">
      <header className="home-page__header">
        <div className="weather-info">
          <span className="weather-info__icon">☀️</span>
          <span className="weather-info__text">
            {weather.location} {weather.temperature} {weather.condition}
          </span>
        </div>
        <button className="diary-button">
          <img src="/assets/icons/actions/calendar.svg" alt="Diary" />
        </button>
      </header>

      <main className="home-page__main">
        <div className="daily-outfit-canvas">
          <h2 className="daily-outfit__title">今日设计</h2>
          <p className="daily-outfit__subtitle">
            Hi, 今天为你准备了3套上班LOOK
          </p>
          <div className="outfit-card__image">
            <img src={'/assets/images/outfit-1.jpg'} alt="Today's outfit" />
          </div>
          <div className="outfit-card__actions">
            <div className="outfit-card__button-group">
              <Button
                variant="secondary"
                shape="circle"
                size="medium"
                onClick={handlePreviousOutfit}
              >
                <img src="/assets/icons/actions/chevron-left.svg" alt="Previous" />
              </Button>
              <Button
                variant="primary"
                shape="circle"
                size="large"
                onClick={handleLikeOutfit}
              >
                <img src="/assets/icons/actions/heart.svg" alt="Like" />
              </Button>
              <Button
                variant="secondary"
                shape="circle"
                size="medium"
                onClick={handleNextOutfit}
              >
                <img src="/assets/icons/actions/chevron-right.svg" alt="Next" />
              </Button>
            </div>
          </div>
        </div>

        <section className="quick-actions">
          <div className="quick-action-canvas" onClick={handleHelpMeStyle}>
            <Button variant="primary" className="quick-action-button">
              搭
            </Button>
            <p className="quick-action-text">帮我搭这件</p>
          </div>
          <div className="quick-action-canvas" onClick={handleScenarioStyling}>
            <Button variant="secondary" className="quick-action-button">
              景
            </Button>
            <p className="quick-action-text">场景着装</p>
          </div>
        </section>
      </main>
      
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default HomePage;
