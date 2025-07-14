import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';

interface ClothingItem {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'shoes' | 'accessories';
  image: string;
  color: string;
  brand?: string;
}

type CategoryFilter = 'all' | 'tops' | 'bottoms' | 'shoes' | 'accessories';

export const WardrobePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [items, setItems] = useState<ClothingItem[]>([
    {
      id: '1',
      name: '白色衬衫',
      category: 'tops',
      image: '/assets/images/shirt-white.jpg',
      color: 'white',
      brand: 'Uniqlo'
    },
    {
      id: '2',
      name: '黑色西装裤',
      category: 'bottoms', 
      image: '/assets/images/pants-black.jpg',
      color: 'black'
    }
  ]);

  const categories = [
    { id: 'all', label: '全部', color: '#FF6B6B' },
    { id: 'tops', label: '上装', color: '#FFB5B5' },
    { id: 'bottoms', label: '下装', color: '#B5E7FF' },
    { id: 'shoes', label: '鞋子', color: '#FFE5B5' },
    { id: 'accessories', label: '配饰', color: '#E5B5FF' }
  ];

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const handleCategoryChange = (category: CategoryFilter) => {
    setActiveCategory(category);
  };

  const handleAddItem = () => {
    console.log('Add new clothing item');
  };

  return (
    <div className="wardrobe-page">
      <header className="wardrobe-page__header">
        <h1 className="wardrobe-page__title">智能衣橱</h1>
      </header>

      <nav className="category-filter">
        <div className="category-filter__scroll">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-filter__item ${
                activeCategory === category.id ? 'category-filter__item--active' : ''
              }`}
              onClick={() => handleCategoryChange(category.id as CategoryFilter)}
              style={{ backgroundColor: category.color }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="wardrobe-grid">
        {filteredItems.map(item => (
          <Card key={item.id} className="wardrobe-item">
            <div className="wardrobe-item__image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="wardrobe-item__info">
              <h3 className="wardrobe-item__name">{item.name}</h3>
              <p className="wardrobe-item__details">
                {item.color} {item.brand && `• ${item.brand}`}
              </p>
            </div>
          </Card>
        ))}
        
        {/* Empty state placeholders */}
        {Array.from({ length: 6 - filteredItems.length }).map((_, index) => (
          <Card key={`placeholder-${index}`} className="wardrobe-item wardrobe-item--placeholder">
            <div className="wardrobe-item__placeholder">
              <span className="wardrobe-item__placeholder-icon">?</span>
            </div>
          </Card>
        ))}
      </main>

      <button 
        className="fab fab--add"
        onClick={handleAddItem}
      >
        +
      </button>
    </div>
  );
};