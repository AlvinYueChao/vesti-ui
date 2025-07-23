import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const StyleLabelsPage: React.FC = () => {
  const router = useRouter();
  const [selectedLabels, setSelectedLabels] = useState<string[]>(['简约', '通勤']);
  const [availableLabels] = useState<string[]>([
    '简约', '通勤', '休闲', '优雅', '甜美', '酷帅', 
    '复古', '文艺', '运动', '度假', '正式', '街头'
  ]);

  useEffect(() => {
    // 从本地存储加载当前的风格标签
    const loadStyleLabels = () => {
      try {
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
          const preferences = JSON.parse(savedPreferences);
          setSelectedLabels(preferences.styleLabels || ['简约', '通勤']);
        }
      } catch (error) {
        console.error('Error loading style labels:', error);
      }
    };

    loadStyleLabels();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleToggleLabel = (label: string) => {
    setSelectedLabels(prev => {
      if (prev.includes(label)) {
        return prev.filter(l => l !== label);
      } else {
        return [...prev, label];
      }
    });
  };

  const handleSave = () => {
    try {
      // 更新本地存储
      const savedPreferences = localStorage.getItem('userPreferences');
      const preferences = savedPreferences ? JSON.parse(savedPreferences) : {
        styleLabels: ['简约', '通勤'],
        blockedItems: ['item-1', 'item-2', 'item-3'],
        dailyDesignPush: true,
        trendNewsPush: false
      };
      preferences.styleLabels = selectedLabels;
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      alert('风格标签已更新！');
      router.back();
    } catch (error) {
      console.error('Error saving style labels:', error);
      alert('保存失败，请重试');
    }
  };

  return (
    <div className="style-labels-page">
      <header className="style-labels-page__header">
        <button className="style-labels-page__back-btn" onClick={handleBack}>
          ‹
        </button>
        <h1 className="style-labels-page__title">我的风格标签</h1>
        <div className="style-labels-page__header-spacer"></div>
      </header>

      <div className="style-labels-page__content">
        <p className="style-labels-page__description">
          选择符合您个人风格的标签，这将帮助AI为您提供更精准的搭配推荐。
        </p>

        <div className="style-labels-page__labels">
          {availableLabels.map(label => (
            <button
              key={label}
              className={`style-labels-page__label ${
                selectedLabels.includes(label) ? 'style-labels-page__label--selected' : ''
              }`}
              onClick={() => handleToggleLabel(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="style-labels-page__bottom-action">
        <button className="style-labels-page__save-btn" onClick={handleSave}>
          保存风格标签
        </button>
      </div>
    </div>
  );
};

export default StyleLabelsPage;