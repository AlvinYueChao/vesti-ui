
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useWardrobe } from '../../hooks/useWardrobe';
import { ClothingCategory } from '../../types';
import { CategoryFilter } from '../../components/wardrobe/CategoryFilter';
import { WardrobeGrid } from '../../components/wardrobe/WardrobeGrid';
import { FloatingActionButton } from '../../components/wardrobe/FloatingActionButton';
import { BottomNavigation } from '../../components/common/BottomNavigation';
import { useTranslation } from '../../hooks/useTranslation';

export const WardrobePage: React.FC = () => {
  const router = useRouter();
  const { mode } = router.query; // Get mode from query params
  const isSelectMode = mode === 'select';
  const { tCategory } = useTranslation();

  const categories = [
    { id: 'all', label: '全部', color: '#FF6B6B' },
    { id: 'tops', label: tCategory('tops'), color: '#FFB5B5' },
    { id: 'bottoms', label: tCategory('bottoms'), color: '#B5E7FF' },
    { id: 'dresses', label: tCategory('dresses'), color: '#FFD1DC' },
    { id: 'shoes', label: tCategory('shoes'), color: '#FFE5B5' },
    { id: 'accessories', label: tCategory('accessories'), color: '#E5B5FF' },
    { id: 'outerwear', label: tCategory('outerwear'), color: '#C5E1A5' }
  ];
  
  // Assuming a fixed user ID for now
  const userId = 'user-123';
  const { items, loading, getItemsByCategory } = useWardrobe(userId);
  const [activeCategory, setActiveCategory] = useState<ClothingCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState('wardrobe');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleCategoryChange = (category: ClothingCategory | 'all') => {
    setActiveCategory(category);
  };

  const handleItemSelect = (itemId: string) => {
    if (isSelectMode) {
      const item = items.find(i => i.id === itemId);
      if (item) {
        // Navigate to outfit result page with selected item
        router.push({
          pathname: '/outfit/result',
          query: {
            type: 'item-based',
            itemId: item.id,
            itemName: item.name
          }
        });
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddItem = () => {
    // 跳转到添加单品的上传页面
    router.push('/wardrobe/add/upload');
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
        router.push('/user/profile');
        break;
      default:
        break;
    }
  };

  const filteredItems = activeCategory === 'all'
    ? items
    : getItemsByCategory(activeCategory);

  return (
    <div className="wardrobe-page">
      {isSelectMode && (
        <header className="wardrobe-page__header">
          <button className="back-button" onClick={handleBack}>
            <img src="/assets/icons/actions/chevron-left.svg" alt="返回" onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'inline';
            }} />
            <span style={{display: 'none'}}>←</span>
          </button>
          <h1 className="page-title">选择单品</h1>
        </header>
      )}

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <WardrobeGrid 
        items={filteredItems} 
        loading={loading}
        selectMode={isSelectMode}
        onItemSelect={handleItemSelect}
      />

      {!isSelectMode && <FloatingActionButton onClick={handleAddItem} />}

      {!isSelectMode && <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />}
    </div>
  );
};
