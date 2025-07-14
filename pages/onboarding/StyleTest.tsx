import React, { useState } from 'react';
import { Logo } from '../../components/common/Logo';
import { SwipeCard } from '../../components/ui/SwipeCard';
import { Button } from '../../components/ui/Button';

interface StyleOption {
  id: string;
  image: string;
  style: string;
}

export const StyleTest: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preferences, setPreferences] = useState<string[]>([]);

  const styleOptions: StyleOption[] = [
    { id: '1', image: '/assets/images/style-1.jpg', style: 'casual' },
    { id: '2', image: '/assets/images/style-2.jpg', style: 'business' },
    { id: '3', image: '/assets/images/style-3.jpg', style: 'trendy' },
    { id: '4', image: '/assets/images/style-4.jpg', style: 'elegant' },
  ];

  const handleSwipeLeft = () => {
    nextCard();
  };

  const handleSwipeRight = () => {
    const currentStyle = styleOptions[currentIndex]?.style;
    if (currentStyle) {
      setPreferences(prev => [...prev, currentStyle]);
    }
    nextCard();
  };

  const nextCard = () => {
    if (currentIndex < styleOptions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleStartJourney = () => {
    // Navigate to home page
    console.log('User preferences:', preferences);
  };

  const isTestComplete = currentIndex >= styleOptions.length;

  return (
    <div className="style-test">
      <div className="style-test__header">
        <Logo size="medium" showSlogan />
      </div>

      <div className="style-test__content">
        <h2 className="style-test__title">Hi，初次见面！</h2>
        <p className="style-test__description">
          选出你更偏爱的穿搭风格，让我更懂你
        </p>

        <div className="style-test__cards">
          {!isTestComplete && styleOptions[currentIndex] && (
            <SwipeCard
              image={styleOptions[currentIndex].image}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          )}
        </div>
      </div>

      <div className="style-test__footer">
        {isTestComplete && (
          <Button 
            variant="primary" 
            size="large" 
            fullWidth
            onClick={handleStartJourney}
          >
            开启设计之旅
          </Button>
        )}
      </div>
    </div>
  );
};