import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface BlockedItem {
  id: string;
  name: string;
  category: string;
  color: string;
  image: string;
}

const BlockedItemsPage: React.FC = () => {
  const router = useRouter();
  const [blockedItems, setBlockedItems] = useState<BlockedItem[]>([]);

  // Mock data for blocked items
  const mockBlockedItems: BlockedItem[] = [
    {
      id: 'item-1',
      name: '豹纹连衣裙',
      category: '连衣裙',
      color: '豹纹',
      image: '/assets/images/blocked-striped-shirt.jpg'
    },
    {
      id: 'item-2',
      name: '亮片上衣',
      category: '上装',
      color: '银色',
      image: '/assets/images/blocked-white-shorts.jpg'
    },
    {
      id: 'item-3',
      name: '超短裙',
      category: '下装',
      color: '黑色',
      image: '/assets/images/blocked-black-suit-pants.jpg'
    }
  ];

  useEffect(() => {
    // 从本地存储加载屏蔽的单品
    const loadBlockedItems = () => {
      try {
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
          const preferences = JSON.parse(savedPreferences);
          const blockedItemIds = preferences.blockedItems || [];
          
          // 根据ID过滤出对应的单品详情
          const filteredItems = mockBlockedItems.filter(item => 
            blockedItemIds.includes(item.id)
          );
          setBlockedItems(filteredItems);
        } else {
          // 如果没有保存的偏好设置，使用默认的屏蔽单品
          setBlockedItems(mockBlockedItems);
        }
      } catch (error) {
        console.error('Error loading blocked items:', error);
        setBlockedItems(mockBlockedItems);
      }
    };

    loadBlockedItems();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleUnblockItem = (itemId: string) => {
    if (confirm('确定要取消屏蔽这件单品吗？')) {
      // 更新本地状态
      setBlockedItems(prev => prev.filter(item => item.id !== itemId));
      
      // 更新本地存储
      try {
        const savedPreferences = localStorage.getItem('userPreferences');
        const preferences = savedPreferences ? JSON.parse(savedPreferences) : {
          styleLabels: ['简约', '通勤'],
          blockedItems: ['item-1', 'item-2', 'item-3'],
          dailyDesignPush: true,
          trendNewsPush: false
        };
        
        preferences.blockedItems = preferences.blockedItems?.filter((id: string) => id !== itemId) || [];
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        
        console.log('Updated blocked items:', preferences.blockedItems);
      } catch (error) {
        console.error('Error updating blocked items:', error);
      }
    }
  };

  return (
    <div className="blocked-items-page">
      <header className="blocked-items-page__header">
        <button className="blocked-items-page__back-btn" onClick={handleBack}>
          ‹
        </button>
        <h1 className="blocked-items-page__title">屏蔽的单品</h1>
        <div className="blocked-items-page__header-spacer"></div>
      </header>

      <div className="blocked-items-page__content">
        {blockedItems.length === 0 ? (
          <div className="blocked-items-page__empty">
            <div className="blocked-items-page__empty-icon">🚫</div>
            <p className="blocked-items-page__empty-text">暂无屏蔽的单品</p>
            <p className="blocked-items-page__empty-subtitle">
              在搭配推荐中，您可以选择屏蔽不喜欢的单品类型
            </p>
          </div>
        ) : (
          <div className="blocked-items-page__list">
            {blockedItems.map(item => (
              <div key={item.id} className="blocked-items-page__item">
                <div className="blocked-items-page__item-image">
                  <span>?</span>
                </div>
                <div className="blocked-items-page__item-info">
                  <h3 className="blocked-items-page__item-name">{item.name}</h3>
                  <div className="blocked-items-page__item-details">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>{item.color}</span>
                  </div>
                </div>
                <button 
                  className="blocked-items-page__unblock-btn"
                  onClick={() => handleUnblockItem(item.id)}
                >
                  取消屏蔽
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockedItemsPage;