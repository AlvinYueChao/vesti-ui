
import React, { useState } from 'react';
import { useWardrobe } from '../../hooks/useWardrobe';
import { ClothingCategory } from '../../types';
import { CategoryFilter } from '../../components/wardrobe/CategoryFilter';
import { WardrobeGrid } from '../../components/wardrobe/WardrobeGrid';
import { FloatingActionButton } from '../../components/wardrobe/FloatingActionButton';

const categories = [
  { id: 'all', label: '全部', color: '#FF6B6B' },
  { id: 'tops', label: '上装', color: '#FFB5B5' },
  { id: 'bottoms', label: '下装', color: '#B5E7FF' },
  { id: 'shoes', label: '鞋子', color: '#FFE5B5' },
  { id: 'accessories', label: '配饰', color: '#E5B5FF' }
];

export const WardrobePage: React.FC = () => {
  // Assuming a fixed user ID for now
  const userId = 'user-123';
  const { items, loading, getItemsByCategory } = useWardrobe(userId);
  const [activeCategory, setActiveCategory] = useState<ClothingCategory | 'all'>('all');

  const handleCategoryChange = (category: ClothingCategory | 'all') => {
    setActiveCategory(category);
  };

  const handleAddItem = () => {
    // TODO: Implement logic to show an "add item" modal or navigate to a new page
    console.log('Add new clothing item');
  };

  const filteredItems = activeCategory === 'all'
    ? items
    : getItemsByCategory(activeCategory);

  return (
    <div className="wardrobe-page">
      <header className="wardrobe-page__header">
        <h1 className="wardrobe-page__title">智能衣橱</h1>
      </header>

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <WardrobeGrid items={filteredItems} loading={loading} />

      <FloatingActionButton onClick={handleAddItem} />
    </div>
  );
};
