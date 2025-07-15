
import React from 'react';
import { ClothingCategory } from '../../types';

interface CategoryFilterProps {
  categories: { id: ClothingCategory | 'all'; label: string; color: string }[];
  activeCategory: ClothingCategory | 'all';
  onCategoryChange: (category: ClothingCategory | 'all') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <nav className="category-filter">
      <div className="category-filter__scroll">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-filter__item ${
              activeCategory === category.id ? 'category-filter__item--active' : ''
            }`}
            onClick={() => onCategoryChange(category.id)}
            style={{ backgroundColor: category.color }}
          >
            {category.label}
          </button>
        ))}
      </div>
    </nav>
  );
};
