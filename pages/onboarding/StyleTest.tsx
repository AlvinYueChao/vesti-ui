import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Logo } from '../../components/common/Logo';
import { SwipeCard } from '../../components/ui/SwipeCard';
import { Button } from '../../components/ui/Button';

interface StyleOption {
  id: string;
  image: string;
  style: string;
}

interface StyleTestProps {
  onComplete?: () => void;
}

export const StyleTest: React.FC<StyleTestProps> = ({ onComplete }) => {
  const router = useRouter();
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
    console.log('User preferences:', preferences);
    // Save user preferences to localStorage or API
    localStorage.setItem('user_style_preferences', JSON.stringify(preferences));
    
    // Call the onComplete callback to mark onboarding as finished
    if (onComplete) {
      onComplete();
    }
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

        <div className="style-test__card-container">
          <div className="style-test__card-stack">
            {styleOptions.map((option, index) => (
              <div
                key={option.id}
                className={`style-test__card ${index === currentIndex ? 'style-test__card--active' : ''}`}
                style={{ 
                  zIndex: styleOptions.length - index,
                  transform: `translateY(${index * 4}px) translateX(${index * 2}px)`,
                  opacity: index <= currentIndex + 1 ? 1 : 0.7
                }}
              >
                <div className="style-test__card-content">
                  <img 
                    src={option.image} 
                    alt={`${option.style} style`}
                    className="style-test__card-image"
                  />
                  <div className="style-test__card-overlay">
                    <div className="style-test__card-dots">
                      <div className="style-test__dot">?</div>
                      <div className="style-test__dot">?</div>
                      <div className="style-test__dot">?</div>
                      <div className="style-test__dot">?</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="style-test__actions">
            <Button 
              onClick={handleSwipeLeft}
            >
              ✕
            </Button>
            <Button 
              onClick={handleSwipeRight}
            >
              ✓
            </Button>
          </div>
        </div>
      </div>

      <div className="style-test__footer">
        <Button 
          variant="primary" 
          size="large" 
          fullWidth
          className="style-test__start-button"
          onClick={handleStartJourney}
        >
          开启设计之旅
        </Button>
      </div>
    </div>
  );
};