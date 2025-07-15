
import React from 'react';
import { ClothingItem } from '../../types';
import { Card } from '../ui/Card';

interface WardrobeGridProps {
  items: ClothingItem[];
  loading: boolean;
}

export const WardrobeGrid: React.FC<WardrobeGridProps> = ({ items, loading }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="wardrobe-grid">
      {items.map(item => (
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
      {Array.from({ length: Math.max(0, 6 - items.length) }).map((_, index) => (
        <Card key={`placeholder-${index}`} className="wardrobe-item wardrobe-item--placeholder">
          <div className="wardrobe-item__placeholder">
            <span className="wardrobe-item__placeholder-icon">?</span>
          </div>
        </Card>
      ))}
    </main>
  );
};
