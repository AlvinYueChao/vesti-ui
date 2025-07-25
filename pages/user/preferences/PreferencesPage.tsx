import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface UserPreferences {
  styleLabels: string[];
  blockedItems: string[];
  dailyDesignPush: boolean;
  trendNewsPush: boolean;
}

const PreferencesPage: React.FC = () => {
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences>({
    styleLabels: ['简约', '通勤'],
    blockedItems: ['item-1', 'item-2', 'item-3'],
    dailyDesignPush: true,
    trendNewsPush: false
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // 从本地存储加载用户偏好设置
    const loadPreferences = () => {
      try {
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
          const parsed = JSON.parse(savedPreferences);
          // 确保所有必需的字段都存在，如果不存在则使用默认值
          setPreferences({
            styleLabels: parsed.styleLabels || ['简约', '通勤'],
            blockedItems: parsed.blockedItems || ['item-1', 'item-2', 'item-3'],
            dailyDesignPush: parsed.dailyDesignPush !== undefined ? parsed.dailyDesignPush : true,
            trendNewsPush: parsed.trendNewsPush !== undefined ? parsed.trendNewsPush : false
          });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };

    loadPreferences();

    // 监听页面焦点事件，当从其他页面返回时重新加载数据
    const handleFocus = () => {
      loadPreferences();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleBack = () => {
    if (hasChanges) {
      if (confirm('您有未保存的更改，确定要离开吗？')) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  const handleStyleLabelsClick = () => {
    router.push('/user/preferences/style-labels');
  };

  const handleRetakeStyleTest = () => {
    if (confirm('重新进行风格测试将覆盖当前的风格标签，确定要继续吗？')) {
      router.push('/onboarding/style-test');
    }
  };

  const handleBlockedItemsClick = () => {
    router.push('/user/preferences/blocked-items');
  };

  const handleToggleDailyPush = () => {
    setPreferences(prev => ({
      ...prev,
      dailyDesignPush: !prev.dailyDesignPush
    }));
    setHasChanges(true);
  };

  const handleToggleTrendPush = () => {
    setPreferences(prev => ({
      ...prev,
      trendNewsPush: !prev.trendNewsPush
    }));
    setHasChanges(true);
  };



  const handleSaveSettings = async () => {
    try {
      // 保存到本地存储
      localStorage.setItem('userPreferences', JSON.stringify(preferences));

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));

      // 显示成功提示
      alert('保存成功！');
      setHasChanges(false);

      // 返回上一页
      router.back();
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('保存失败，请重试');
    }
  };

  return (
    <div className="preferences-page">
      {/* 顶部导航栏 */}
      <header className="preferences-page__header">
        <button className="back-button" onClick={handleBack}>
          <img src="/assets/icons/actions/chevron-left.svg" alt="返回" onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'inline';
          }} />
          <span style={{display: 'none'}}>←</span>
        </button>
        <h1 className="preferences-page__title">偏好设置</h1>
        <div className="preferences-page__header-spacer"></div>
      </header>

      {/* 内容区域 */}
      <div className="preferences-page__content">
        {/* 个人风格设置区 */}
        <div className="preferences-page__section">
          <h2 className="preferences-page__section-title">个人风格</h2>

          <div className="preferences-page__item" onClick={handleStyleLabelsClick}>
            <div className="preferences-page__item-content">
              <h3 className="preferences-page__item-title">我的风格标签</h3>
              <div className="preferences-page__item-subtitle">
                {preferences.styleLabels && preferences.styleLabels.length > 0
                  ? preferences.styleLabels.join('，')
                  : '未设置'}
              </div>
            </div>
            <div className="preferences-page__item-arrow">›</div>
          </div>

          <div className="preferences-page__item" onClick={handleRetakeStyleTest}>
            <div className="preferences-page__item-content">
              <h3 className="preferences-page__item-title">重新进行风格测试</h3>
            </div>
            <div className="preferences-page__item-arrow">›</div>
          </div>
        </div>

        {/* 搭配推荐设置区 */}
        <div className="preferences-page__section">
          <h2 className="preferences-page__section-title">搭配推荐</h2>

          <div className="preferences-page__item" onClick={handleBlockedItemsClick}>
            <div className="preferences-page__item-content">
              <h3 className="preferences-page__item-title">屏蔽的单品</h3>
              <div className="preferences-page__item-subtitle">
                {preferences.blockedItems ? preferences.blockedItems.length : 0} 件
              </div>
            </div>
            <div className="preferences-page__item-arrow">›</div>
          </div>
        </div>

        {/* 通知管理区 */}
        <div className="preferences-page__section">
          <h2 className="preferences-page__section-title">通知管理</h2>

          <div className="preferences-page__item preferences-page__item--toggle">
            <div className="preferences-page__item-content">
              <h3 className="preferences-page__item-title">每日设计推送</h3>
            </div>
            <div
              className={`preferences-page__toggle ${preferences.dailyDesignPush ? 'preferences-page__toggle--active' : ''}`}
              onClick={handleToggleDailyPush}
            >
              <div className="preferences-page__toggle-thumb"></div>
            </div>
          </div>

          <div className="preferences-page__item preferences-page__item--toggle">
            <div className="preferences-page__item-content">
              <h3 className="preferences-page__item-title">潮流资讯推送</h3>
            </div>
            <div
              className={`preferences-page__toggle ${preferences.trendNewsPush ? 'preferences-page__toggle--active' : ''}`}
              onClick={handleToggleTrendPush}
            >
              <div className="preferences-page__toggle-thumb"></div>
            </div>
          </div>
        </div>


      </div>

      {/* 底部操作按钮 */}
      <div className="preferences-page__bottom-action">
        <button
          className={`preferences-page__save-btn ${hasChanges ? 'preferences-page__save-btn--active' : ''}`}
          onClick={handleSaveSettings}
          disabled={!hasChanges}
        >
          保存设置
        </button>
      </div>
    </div>
  );
};

export default PreferencesPage;