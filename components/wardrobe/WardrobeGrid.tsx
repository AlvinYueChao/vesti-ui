
import React from 'react';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleItemClick = (itemId: string) => {
    if (selectMode && onItemSelect) {
      onItemSelect(itemId);
    } else if (!selectMode) {
      // 普通模式下点击单品进入详情页
      router.push(`/wardrobe/item/${itemId}`);
    }
  };

  return (
    <main className="wardrobe-grid">
      {items.map(item => (
        <Card 
          key={item.id} 
          className={`wardrobe-item wardrobe-item--clickable ${selectMode ? 'wardrobe-item--selectable' : ''}`}
          onClick={() => handleItemClick(item.id)}
        >
          <div className="wardrobe-item__image">
            <img src={item.image} alt={item.name} />
            {/* 外套类型的上装显示外套图标 */}
            {item.category === 'tops' && item.subType === 'outerwear' && (
              <div className="wardrobe-item__outerwear-icon">🧥</div>
            )}
          </div>
          {selectMode && (
            <div className="wardrobe-item__select-indicator">
              <span>点击选择</span>
            </div>
          )}
          {!selectMode && (
            <div className="wardrobe-item__info">
              <span className="wardrobe-item__name">{item.name}</span>
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
