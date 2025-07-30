// 穿搭验证Hook
import { useState, useCallback } from 'react';
import { ClothingItem, OutfitValidationResult } from '../types';
import { outfitValidationService } from '../services/outfitValidationService';

export const useOutfitValidation = () => {
  const [validationResult, setValidationResult] = useState<OutfitValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateOutfit = useCallback(async (items: ClothingItem[]) => {
    setIsValidating(true);
    try {
      const result = outfitValidationService.validateOutfit(items);
      setValidationResult(result);
      return result;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const isOutfitComplete = useCallback((items: ClothingItem[]) => {
    return outfitValidationService.isOutfitComplete(items);
  }, []);

  const getMissingCategories = useCallback((items: ClothingItem[]) => {
    return outfitValidationService.getMissingRequiredCategories(items);
  }, []);

  const canAddCategory = useCallback((currentItems: ClothingItem[], categoryToAdd: string) => {
    return outfitValidationService.canAddCategory(currentItems, categoryToAdd);
  }, []);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  return {
    validationResult,
    isValidating,
    validateOutfit,
    isOutfitComplete,
    getMissingCategories,
    canAddCategory,
    clearValidation
  };
};