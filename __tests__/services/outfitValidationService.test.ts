// 穿搭验证服务测试
import { outfitValidationService } from '../../services/outfitValidationService';
import { ClothingItem, TopsSubType } from '../../types';

describe('OutfitValidationService', () => {
  // 创建测试用的单品
  const createMockItem = (
    category: string, 
    id: string = Math.random().toString(),
    subType?: TopsSubType
  ): ClothingItem => ({
    id,
    name: `Test ${category}`,
    category: category as any,
    subType,
    color: 'test',
    image: 'test.jpg',
    imageUrl: 'test.jpg',
    tags: [],
    addedDate: new Date()
  });

  // 测试数据
  const testItems = {
    regularTop: createMockItem('tops', 'regular-top', 'regular'),
    outerwear: createMockItem('tops', 'outerwear', 'outerwear'),
    bottom: createMockItem('bottoms', 'bottom'),
    dress: createMockItem('dresses', 'dress'),
    shoes: createMockItem('shoes', 'shoes'),
    accessory: createMockItem('accessories', 'accessory'),
    // 用于测试重复的单品
    regularTop2: createMockItem('tops', 'regular-top-2', 'regular'),
    bottom2: createMockItem('bottoms', 'bottom-2'),
    dress2: createMockItem('dresses', 'dress-2'),
    outerwear2: createMockItem('tops', 'outerwear-2', 'outerwear')
  };

  describe('有效路径测试', () => {
    it('有效路径1: 上装 + 下装 + 鞋子', () => {
      const items = [testItems.regularTop, testItems.bottom, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('有效路径2: 连衣裙 + 鞋子', () => {
      const items = [testItems.dress, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('有效路径1 + 配饰: 上装 + 下装 + 鞋子 + 配饰', () => {
      const items = [testItems.regularTop, testItems.bottom, testItems.shoes, testItems.accessory];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('有效路径2 + 配饰: 连衣裙 + 鞋子 + 配饰', () => {
      const items = [testItems.dress, testItems.shoes, testItems.accessory];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('特殊有效: 连衣裙 + 外套 + 鞋子（分层搭配）', () => {
      const items = [testItems.dress, testItems.outerwear, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('特殊有效: 连衣裙 + 外套 + 鞋子 + 配饰', () => {
      const items = [testItems.dress, testItems.outerwear, testItems.shoes, testItems.accessory];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('多外套有效: 上装 + 外套 + 下装 + 鞋子', () => {
      const items = [testItems.regularTop, testItems.outerwear, testItems.bottom, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('无效冲突测试', () => {
    it('无效冲突1: 连衣裙 + 下装', () => {
      const items = [testItems.dress, testItems.bottom, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('DRESS_WITH_BOTTOMS');
      expect(result.errors[0].message).toContain('功能属性重叠');
    });

    it('无效冲突2: 连衣裙 + 普通上装', () => {
      const items = [testItems.dress, testItems.regularTop, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('DRESS_WITH_REGULAR_TOPS');
      expect(result.errors[0].message).toContain('需排除外套等分层情况');
    });

    it('无效冲突3: 多个同层级上装（T恤+衬衫）', () => {
      const items = [testItems.regularTop, testItems.regularTop2, testItems.bottom, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MULTIPLE_REGULAR_TOPS');
      expect(result.errors[0].message).toContain('同层级功能属性重叠');
    });

    it('无效冲突4: 多个下装（裤子+裙子）', () => {
      const items = [testItems.regularTop, testItems.bottom, testItems.bottom2, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MULTIPLE_BOTTOMS');
      expect(result.errors[0].message).toContain('同层级功能属性重叠');
    });

    it('无效冲突: 多个连衣裙', () => {
      const items = [testItems.dress, testItems.dress2, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MULTIPLE_DRESSES');
      expect(result.errors[0].message).toContain('一套穿搭只能有一条连衣裙');
    });
  });

  describe('无效基础测试', () => {
    it('无效基础1: 上装 + 鞋子（缺少下半身覆盖）', () => {
      const items = [testItems.regularTop, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MISSING_BOTTOMS');
      expect(result.errors[0].message).toContain('缺少下半身覆盖');
    });

    it('无效基础2: 下装 + 鞋子（缺少上半身覆盖）', () => {
      const items = [testItems.bottom, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MISSING_TOPS');
      expect(result.errors[0].message).toContain('缺少上半身覆盖');
    });

    it('缺少鞋子: 上装 + 下装', () => {
      const items = [testItems.regularTop, testItems.bottom];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MISSING_SHOES');
      expect(result.errors[0].message).toContain('缺少鞋子');
    });

    it('缺少鞋子: 连衣裙', () => {
      const items = [testItems.dress];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MISSING_SHOES');
      expect(result.errors[0].message).toContain('缺少鞋子');
    });

    it('缺少上装或连衣裙: 只有鞋子', () => {
      const items = [testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MISSING_TOPS_OR_DRESS');
      expect(result.errors[0].message).toContain('需要上装或连衣裙');
    });

    it('空穿搭', () => {
      const items: ClothingItem[] = [];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('特殊规则测试', () => {
    it('外套可以与连衣裙搭配', () => {
      const items = [testItems.dress, testItems.outerwear, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('普通上装不能与连衣裙搭配', () => {
      const items = [testItems.dress, testItems.regularTop, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe('DRESS_WITH_REGULAR_TOPS');
    });

    it('多个外套可以搭配（分层）', () => {
      const items = [testItems.outerwear, testItems.outerwear2, testItems.bottom, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('外套 + 普通上装 + 下装 + 鞋子', () => {
      const items = [testItems.outerwear, testItems.regularTop, testItems.bottom, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('配饰可以添加到任何有效搭配', () => {
      // 测试各种有效搭配 + 配饰
      const validOutfits = [
        [testItems.regularTop, testItems.bottom, testItems.shoes],
        [testItems.dress, testItems.shoes],
        [testItems.dress, testItems.outerwear, testItems.shoes]
      ];

      validOutfits.forEach(outfit => {
        const withAccessory = [...outfit, testItems.accessory];
        const result = outfitValidationService.validateOutfit(withAccessory);
        expect(result.isValid).toBe(true);
      });
    });

    it('subType为undefined的上装默认为regular', () => {
      const topWithoutSubType = createMockItem('tops', 'no-subtype');
      const items = [testItems.dress, topWithoutSubType, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe('DRESS_WITH_REGULAR_TOPS');
    });
  });

  describe('复合错误测试', () => {
    it('多个错误: 连衣裙 + 下装 + 多个连衣裙', () => {
      const items = [testItems.dress, testItems.dress2, testItems.bottom, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      
      const errorCodes = result.errors.map(e => e.code);
      expect(errorCodes).toContain('MULTIPLE_DRESSES');
      expect(errorCodes).toContain('DRESS_WITH_BOTTOMS');
    });

    it('多个错误: 多个上装 + 多个下装', () => {
      const items = [testItems.regularTop, testItems.regularTop2, testItems.bottom, testItems.bottom2, testItems.shoes];
      const result = outfitValidationService.validateOutfit(items);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      
      const errorCodes = result.errors.map(e => e.code);
      expect(errorCodes).toContain('MULTIPLE_REGULAR_TOPS');
      expect(errorCodes).toContain('MULTIPLE_BOTTOMS');
    });
  });

  describe('工具方法测试', () => {
    describe('isOutfitComplete', () => {
      it('完整搭配返回true', () => {
        const items = [testItems.regularTop, testItems.bottom, testItems.shoes];
        expect(outfitValidationService.isOutfitComplete(items)).toBe(true);
      });

      it('不完整搭配返回false', () => {
        const items = [testItems.regularTop, testItems.bottom];
        expect(outfitValidationService.isOutfitComplete(items)).toBe(false);
      });
    });

    describe('getMissingRequiredCategories', () => {
      it('返回缺失的类别', () => {
        const items = [testItems.regularTop];
        const missing = outfitValidationService.getMissingRequiredCategories(items);
        
        expect(missing).toContain('bottoms');
        expect(missing).toContain('shoes');
      });

      it('完整搭配返回空数组', () => {
        const items = [testItems.dress, testItems.shoes];
        const missing = outfitValidationService.getMissingRequiredCategories(items);
        
        expect(missing).toHaveLength(0);
      });
    });

    describe('canAddCategory', () => {
      it('可以添加鞋子到上装+下装', () => {
        const items = [testItems.regularTop, testItems.bottom];
        const canAdd = outfitValidationService.canAddCategory(items, 'shoes');
        
        expect(canAdd).toBe(true);
      });

      it('不能添加下装到连衣裙搭配', () => {
        const items = [testItems.dress, testItems.shoes];
        const canAdd = outfitValidationService.canAddCategory(items, 'bottoms');
        
        expect(canAdd).toBe(false);
      });

      it('可以添加外套到连衣裙搭配', () => {
        const items = [testItems.dress, testItems.shoes];
        const canAdd = outfitValidationService.canAddCategory(items, 'tops', 'outerwear');
        
        expect(canAdd).toBe(true);
      });

      it('不能添加普通上装到连衣裙搭配', () => {
        const items = [testItems.dress, testItems.shoes];
        const canAdd = outfitValidationService.canAddCategory(items, 'tops', 'regular');
        
        expect(canAdd).toBe(false);
      });
    });

    describe('getOutfitRules', () => {
      it('返回所有穿搭规则', () => {
        const rules = outfitValidationService.getOutfitRules();
        
        expect(rules).toHaveLength(8);
        expect(rules.some(r => r.id === 'valid_path_1')).toBe(true);
        expect(rules.some(r => r.id === 'valid_path_2')).toBe(true);
      });
    });

    describe('isValidCombination', () => {
      it('有效组合返回true', () => {
        expect(outfitValidationService.isValidCombination(['tops', 'bottoms', 'shoes'])).toBe(true);
        expect(outfitValidationService.isValidCombination(['dresses', 'shoes'])).toBe(true);
      });

      it('无效组合返回false', () => {
        expect(outfitValidationService.isValidCombination(['dresses', 'bottoms'])).toBe(false);
        expect(outfitValidationService.isValidCombination(['tops', 'shoes'])).toBe(false);
      });
    });

    describe('getRecommendedCombinations', () => {
      it('返回推荐的有效组合', () => {
        const recommended = outfitValidationService.getRecommendedCombinations();
        
        expect(recommended.length).toBe(2);
        expect(recommended.every(r => r.isValid)).toBe(true);
        expect(recommended.some(r => r.id === 'valid_path_1')).toBe(true);
        expect(recommended.some(r => r.id === 'valid_path_2')).toBe(true);
      });
    });
  });
});