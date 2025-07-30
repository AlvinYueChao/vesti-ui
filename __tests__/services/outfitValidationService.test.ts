// 穿搭验证服务测试
import { outfitValidationService } from '../../services/outfitValidationService';
import { ClothingItem } from '../../types';

describe('OutfitValidationService', () => {
  const createMockItem = (category: string, id: string = Math.random().toString()): ClothingItem => ({
    id,
    name: `Test ${category}`,
    category: category as any,
    color: 'test',
    image: 'test.jpg',
    imageUrl: 'test.jpg',
    tags: [],
    addedDate: new Date()
  });

  describe('validateOutfit', () => {
    it('should validate complete outfit with tops + bottoms + shoes', () => {
      const items = [
        createMockItem('tops'),
        createMockItem('bottoms'),
        createMockItem('shoes')
      ];

      const result = outfitValidationService.validateOutfit(items);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate complete outfit with dress + shoes', () => {
      const items = [
        createMockItem('dresses'),
        createMockItem('shoes')
      ];

      const result = outfitValidationService.validateOutfit(items);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should allow accessories as optional items', () => {
      const items = [
        createMockItem('tops'),
        createMockItem('bottoms'),
        createMockItem('shoes'),
        createMockItem('accessories')
      ];

      const result = outfitValidationService.validateOutfit(items);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject outfit missing shoes', () => {
      const items = [
        createMockItem('tops'),
        createMockItem('bottoms')
      ];

      const result = outfitValidationService.validateOutfit(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MISSING_SHOES');
    });

    it('should reject outfit with only tops (missing bottoms)', () => {
      const items = [
        createMockItem('tops'),
        createMockItem('shoes')
      ];

      const result = outfitValidationService.validateOutfit(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MISSING_BOTTOMS_WITH_TOPS');
    });

    it('should reject outfit with dress and bottoms together', () => {
      const items = [
        createMockItem('dresses'),
        createMockItem('bottoms'),
        createMockItem('shoes')
      ];

      const result = outfitValidationService.validateOutfit(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('DRESS_WITH_BOTTOMS');
    });

    it('should reject outfit with multiple dresses', () => {
      const items = [
        createMockItem('dresses', '1'),
        createMockItem('dresses', '2'),
        createMockItem('shoes')
      ];

      const result = outfitValidationService.validateOutfit(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MULTIPLE_DRESSES');
    });

    it('should reject outfit with no tops or dress', () => {
      const items = [
        createMockItem('bottoms'),
        createMockItem('shoes')
      ];

      const result = outfitValidationService.validateOutfit(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MISSING_TOPS_OR_DRESS');
    });
  });

  describe('isOutfitComplete', () => {
    it('should return true for complete outfit', () => {
      const items = [
        createMockItem('tops'),
        createMockItem('bottoms'),
        createMockItem('shoes')
      ];

      const result = outfitValidationService.isOutfitComplete(items);
      expect(result).toBe(true);
    });

    it('should return false for incomplete outfit', () => {
      const items = [
        createMockItem('tops'),
        createMockItem('bottoms')
      ];

      const result = outfitValidationService.isOutfitComplete(items);
      expect(result).toBe(false);
    });
  });

  describe('getMissingRequiredCategories', () => {
    it('should return missing categories', () => {
      const items = [
        createMockItem('tops')
      ];

      const missing = outfitValidationService.getMissingRequiredCategories(items);
      expect(missing).toContain('bottoms');
      expect(missing).toContain('shoes');
    });

    it('should return empty array for complete outfit', () => {
      const items = [
        createMockItem('dresses'),
        createMockItem('shoes')
      ];

      const missing = outfitValidationService.getMissingRequiredCategories(items);
      expect(missing).toHaveLength(0);
    });
  });

  describe('canAddCategory', () => {
    it('should allow adding shoes to tops+bottoms', () => {
      const items = [
        createMockItem('tops'),
        createMockItem('bottoms')
      ];

      const canAdd = outfitValidationService.canAddCategory(items, 'shoes');
      expect(canAdd).toBe(true);
    });

    it('should not allow adding bottoms to dress outfit', () => {
      const items = [
        createMockItem('dresses'),
        createMockItem('shoes')
      ];

      const canAdd = outfitValidationService.canAddCategory(items, 'bottoms');
      expect(canAdd).toBe(false);
    });
  });
});