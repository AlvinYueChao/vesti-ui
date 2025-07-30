// 穿搭验证服务
import { ClothingItem, OutfitValidationResult, OutfitValidationError, OutfitComposition } from '../types';
import { translationService } from './translationService';

class OutfitValidationService {
  
  /**
   * 验证穿搭的完整性和合理性
   * 规则：
   * 1. 必须有上装+下装 或 连衣裙（二选一）
   * 2. 必须有鞋子
   * 3. 配饰是可选的
   * 4. 连衣裙不能与下装同时存在
   * 5. 一套穿搭只能有一条连衣裙
   */
  validateOutfit(items: ClothingItem[]): OutfitValidationResult {
    const errors: OutfitValidationError[] = [];
    const warnings: OutfitValidationError[] = [];
    
    // 按类别分组
    const composition = this.categorizeItems(items);
    
    // 验证基本穿搭规则
    this.validateBasicRules(composition, errors);
    
    // 验证连衣裙规则
    this.validateDressRules(composition, errors);
    
    // 验证鞋子
    this.validateShoes(composition, errors);
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * 按类别分组单品
   */
  private categorizeItems(items: ClothingItem[]): OutfitComposition {
    const composition: OutfitComposition = {
      tops: [],
      bottoms: [],
      dresses: [],
      shoes: [],
      accessories: [],
      outerwear: []
    };
    
    items.forEach(item => {
      switch (item.category) {
        case 'tops':
          composition.tops.push(item);
          break;
        case 'bottoms':
          composition.bottoms.push(item);
          break;
        case 'dresses':
          composition.dresses.push(item);
          break;
        case 'shoes':
          composition.shoes.push(item);
          break;
        case 'accessories':
          composition.accessories.push(item);
          break;
        case 'outerwear':
          composition.outerwear.push(item);
          break;
      }
    });
    
    return composition;
  }
  
  /**
   * 验证基本穿搭规则
   */
  private validateBasicRules(composition: OutfitComposition, errors: OutfitValidationError[]): void {
    const hasTops = composition.tops.length > 0;
    const hasBottoms = composition.bottoms.length > 0;
    const hasDresses = composition.dresses.length > 0;
    
    // 规则1: 必须有上装+下装 或 连衣裙
    if (!hasDresses && !hasTops) {
      errors.push({
        code: 'MISSING_TOPS_OR_DRESS',
        message: translationService.translate('validation.missing_tops_or_dress'),
        category: 'tops'
      });
    }
    
    // 规则2: 如果有上装，必须有下装（除非有连衣裙）
    if (hasTops && !hasBottoms && !hasDresses) {
      errors.push({
        code: 'MISSING_BOTTOMS_WITH_TOPS',
        message: translationService.translate('validation.missing_bottoms_with_tops'),
        category: 'bottoms'
      });
    }
  }
  
  /**
   * 验证连衣裙相关规则
   */
  private validateDressRules(composition: OutfitComposition, errors: OutfitValidationError[]): void {
    const hasDresses = composition.dresses.length > 0;
    const hasBottoms = composition.bottoms.length > 0;
    
    // 规则3: 连衣裙不能与下装同时存在
    if (hasDresses && hasBottoms) {
      errors.push({
        code: 'DRESS_WITH_BOTTOMS',
        message: translationService.translate('validation.dress_with_bottoms'),
        category: 'dresses'
      });
    }
    
    // 规则4: 一套穿搭只能有一条连衣裙
    if (composition.dresses.length > 1) {
      errors.push({
        code: 'MULTIPLE_DRESSES',
        message: translationService.translate('validation.multiple_dresses'),
        category: 'dresses'
      });
    }
  }
  
  /**
   * 验证鞋子
   */
  private validateShoes(composition: OutfitComposition, errors: OutfitValidationError[]): void {
    if (composition.shoes.length === 0) {
      errors.push({
        code: 'MISSING_SHOES',
        message: translationService.translate('validation.missing_shoes'),
        category: 'shoes'
      });
    }
  }
  
  /**
   * 检查穿搭是否完整（用于保存前的快速检查）
   */
  isOutfitComplete(items: ClothingItem[]): boolean {
    const validation = this.validateOutfit(items);
    return validation.isValid;
  }
  
  /**
   * 获取穿搭缺失的必要类别
   */
  getMissingRequiredCategories(items: ClothingItem[]): string[] {
    const validation = this.validateOutfit(items);
    return validation.errors
      .filter(error => error.category)
      .map(error => error.category!)
      .filter((category, index, array) => array.indexOf(category) === index); // 去重
  }
  
  /**
   * 检查是否可以添加特定类别的单品
   */
  canAddCategory(currentItems: ClothingItem[], categoryToAdd: string): boolean {
    // 创建临时穿搭来测试
    const testItem: ClothingItem = {
      id: 'test',
      name: 'test',
      category: categoryToAdd as any,
      color: 'test',
      image: '',
      imageUrl: '',
      tags: [],
      addedDate: new Date()
    };
    
    const testItems = [...currentItems, testItem];
    const validation = this.validateOutfit(testItems);
    
    // 如果添加后没有新的错误，则可以添加
    const originalValidation = this.validateOutfit(currentItems);
    return validation.errors.length <= originalValidation.errors.length;
  }
}

export const outfitValidationService = new OutfitValidationService();