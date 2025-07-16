
import React from 'react';
import { ClothingItem } from '../../types';
import { Card } from '../ui/Card';

interface WardrobeGridProps {
  items: ClothingItem[];
  loading: boolean;
  selectMode?: boolean;
  onItemSelect?: (itemId: string) => void;
}

export const WardrobeGrid: React.FC<WardrobeGridProps> = ({ 
  items, 
  loading, 
  selectMode = false, 
  onItemSelect 
}) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  const handleItemClick = (itemId: string) => {
    if (selectMode && onItemSelect) {
      onItemSelect(itemId);
    }
  };

  return (
    <main className="wardrobe-grid">
      {items.map(item => (
        <Card 
          key={item.id} 
          className={`wardrobe-item ${selectMode ? 'wardrobe-item--selectable' : ''}`}
          onClick={() => handleItemClick(item.id)}
        >
          <div className="wardrobe-item__image">
            <img src={item.image} alt={item.name} />
          </div>
          <div className="wardrobe-item__info">
            <h3 className="wardrobe-item__name">{item.name}</h3>
            <p className="wardrobe-item__details">
              {item.color} {item.brand && `• ${item.brand}`}
            </p>
          </div>
          {selectMode && (
            <div className="wardrobe-item__select-indicator">
              <span>点击选择</span>
            </div>
          )}
        </Card>
      ))}
      {/* Empty state placeholders */}
      {!selectMode && Array.from({ length: Math.max(0, 6 - items.length) }).map((_, index) => (
        <Card key={`placeholder-${index}`} className="wardrobe-item wardrobe-item--placeholder">
          <div className="wardrobe-item__placeholder">
            <span className="wardrobe-item__placeholder-icon">?</span>
          </div>
        </Card>
      ))}
    </main>
  );
};
