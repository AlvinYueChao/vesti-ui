
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useWardrobe } from '../../hooks/useWardrobe';
import { ClothingCategory } from '../../types';
import { CategoryFilter } from '../../components/wardrobe/CategoryFilter';
import { WardrobeGrid } from '../../components/wardrobe/WardrobeGrid';
import { FloatingActionButton } from '../../components/wardrobe/FloatingActionButton';
import { BottomNavigation } from '../../components/common/BottomNavigation';

const categories = [
  { id: 'all', label: '全部', color: '#FF6B6B' },
  { id: 'tops', label: '上装', color: '#FFB5B5' },
  { id: 'bottoms', label: '下装', color: '#B5E7FF' },
  { id: 'shoes', label: '鞋子', color: '#FFE5B5' },
  { id: 'accessories', label: '配饰', color: '#E5B5FF' }
];

export const WardrobePage: React.FC = () => {
  const router = useRouter();
  const { mode } = router.query; // Get mode from query params
  const isSelectMode = mode === 'select';
  
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
          pathname: '/outfit-result',
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
    // TODO: Implement logic to show an "add item" modal or navigate to a new page
    console.log('Add new clothing item');
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

  const filteredItems = activeCategory === 'all'
    ? items
    : getItemsByCategory(activeCategory);

  return (
    <div className="wardrobe-page">
      <header className="wardrobe-page__header">
        {isSelectMode && (
          <button className="back-button" onClick={handleBack}>
            <img src="/assets/icons/actions/chevron-left.svg" alt="返回" />
          </button>
        )}
        <h1 className="wardrobe-page__title">
          {isSelectMode ? '选择要搭配的单品' : '智能衣橱'}
        </h1>
      </header>

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
