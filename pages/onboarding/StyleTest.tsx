import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Logo } from '../../components/common/Logo';
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
    console.log('× button clicked - switching to next style');
    nextCard();
  };

  const handleSwipeRight = () => {
    console.log('✓ button clicked - liking current style');
    const currentStyle = styleOptions[currentIndex]?.style;
    if (currentStyle) {
      setPreferences(prev => [...prev, currentStyle]);
    }
    nextCard();
  };

  const nextCard = () => {
    console.log('Current index:', currentIndex, 'Total styles:', styleOptions.length);
    if (currentIndex < styleOptions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      console.log('Reached end of styles, resetting to first');
      setCurrentIndex(0); // 循环回到第一张
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

  return (
    <div className="style-test" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="style-test__header" style={{ flexShrink: 0, padding: '10px 20px' }}>
        <Logo size="small" showSlogan />
        <div className="style-test__intro" style={{ textAlign: 'center', marginTop: '10px' }}>
          <h2 className="style-test__title" style={{ fontSize: '18px', margin: '5px 0' }}>Hi，初次见面！</h2>
          <p className="style-test__description" style={{ fontSize: '14px', margin: '5px 0', color: '#666' }}>
            选出你更偏爱的穿搭风格，让我更懂你
          </p>
        </div>
      </div>

      <div className="style-test__content" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px 20px' }}>
        <div className="style-test__card-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="style-test__card-stack" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <div className="style-test__card style-test__card--active" style={{ width: '100%', maxWidth: '350px', height: '450px' }}>
              <div className="style-test__card-content" style={{ width: '100%', height: '100%' }}>
                <img
                  src={styleOptions[currentIndex]?.image}
                  alt={`${styleOptions[currentIndex]?.style} style`}
                  className="style-test__card-image"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain'
                  }}
                  key={currentIndex} // 强制重新渲染
                />
              </div>
            </div>
          </div>

          <div className="style-test__actions" style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', gap: '40px', padding: '20px 0' }}>
            <Button
              onClick={handleSwipeLeft}
              style={{ width: '60px', height: '60px', borderRadius: '50%', fontSize: '24px' }}
            >
              ✕
            </Button>
            <Button
              onClick={handleSwipeRight}
              style={{ width: '60px', height: '60px', borderRadius: '50%', fontSize: '24px' }}
            >
              ✓
            </Button>
          </div>
        </div>
      </div>

      <div className="style-test__footer" style={{ flexShrink: 0, padding: '10px 20px 20px' }}>
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