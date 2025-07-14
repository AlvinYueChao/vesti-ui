// Custom hook for wardrobe management

import { useState, useEffect } from 'react';
import { ClothingItem, ClothingCategory } from '../types';
import { apiService } from '../services/api';

export const useWardrobe = (userId: string) => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWardrobe();
  }, [userId]);

  const loadWardrobe = async () => {
    try {
      setLoading(true);
      const response = await apiService.getWardrobe(userId);
      if (response.success && response.data) {
        setItems(response.data);
      } else {
        setError(response.error || 'Failed to load wardrobe');
      }
    } catch (err) {
      setError('Failed to load wardrobe');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<ClothingItem, 'id'>) => {
    try {
      const response = await apiService.addClothingItem(userId, item);
      if (response.success && response.data) {
        setItems(prev => [...prev, response.data as ClothingItem]);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to add item');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
      throw err;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await apiService.removeClothingItem(userId, itemId);
      if (response.success) {
        setItems(prev => prev.filter(item => item.id !== itemId));
      } else {
        throw new Error(response.error || 'Failed to remove item');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
      throw err;
    }
  };

  const getItemsByCategory = (category: ClothingCategory) => {
    return items.filter(item => item.category === category);
  };

  const searchItems = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.color.toLowerCase().includes(lowerQuery) ||
      item.brand?.toLowerCase().includes(lowerQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  return {
    items,
    loading,
    error,
    addItem,
    removeItem,
    getItemsByCategory,
    searchItems,
    refreshWardrobe: loadWardrobe,
  };
};