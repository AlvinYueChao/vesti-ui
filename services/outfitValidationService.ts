// 穿搭验证服务
import { ClothingItem, OutfitValidationResult, OutfitValidationError, OutfitComposition, OutfitRule } from '../types';
import { translationService } from './translationService';

class OutfitValidationService {

  // 基础穿搭规则（基于提供的表格）
  private readonly outfitRules: OutfitRule[] = [
    {
      id: 'valid_path_1',
      name: '有效路径1',
      combination: ['tops', 'bottoms', 'shoes'],
      isValid: true,
      note: '可选加配饰',
      allowsAccessories: true
    },
    {
      id: 'valid_path_2',
      name: '有效路径2',
      combination: ['dresses', 'shoes'],
      isValid: true,
      note: '可选加配饰',
      allowsAccessories: true
    },
    {
      id: 'invalid_conflict_1',
      name: '无效冲突1',
      combination: ['dresses', 'bottoms'],
      isValid: false,
      note: '功能属性重叠'
    },
    {
      id: 'invalid_conflict_2',
      name: '无效冲突2',
      combination: ['dresses', 'tops'],
      isValid: false,
      note: '功能属性重叠（需排除外套等分层情况）'
    },
    {
      id: 'invalid_conflict_3',
      name: '无效冲突3',
      combination: ['tops', 'tops'],
      isValid: false,
      note: '同层级功能属性重叠（如T恤+衬衫）'
    },
    {
      id: 'invalid_conflict_4',
      name: '无效冲突4',
      combination: ['bottoms', 'bottoms'],
      isValid: false,
      note: '同层级功能属性重叠（如裤子+裙子）'
    },
    {
      id: 'invalid_incomplete_1',
      name: '无效基础1',
      combination: ['tops', 'shoes'],
      isValid: false,
      note: '缺少下半身覆盖'
    },
    {
      id: 'invalid_incomplete_2',
      name: '无效基础2',
      combination: ['bottoms', 'shoes'],
      isValid: false,
      note: '缺少上半身覆盖'
    }
  ];

  /**
   * 验证穿搭的完整性和合理性
   * 基于基础穿搭规则表格实现
   */
  validateOutfit(items: ClothingItem[]): OutfitValidationResult {
    const errors: OutfitValidationError[] = [];
    const warnings: OutfitValidationError[] = [];

    // 按类别分组
    const composition = this.categorizeItems(items);

    // 验证基础穿搭规则
    this.validateByRules(composition, errors);

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
      accessories: []
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
      }
    });

    return composition;
  }

  /**
   * 基于规则表格验证穿搭
   */
  private validateByRules(composition: OutfitComposition, errors: OutfitValidationError[]): void {
    const hasTops = composition.tops.length > 0;
    const hasBottoms = composition.bottoms.length > 0;
    const hasDresses = composition.dresses.length > 0;
    const hasShoes = composition.shoes.length > 0;

    // 1. 首先检查是否有多个同类型单品（同层级功能属性重叠）
    this.validateDuplicateCategories(composition, errors);

    // 2. 检查冲突规则（这些规则无论如何都不能违反）
    if (hasDresses && hasBottoms) {
      // 无效冲突1: 连衣裙+下装
      errors.push({
        code: 'DRESS_WITH_BOTTOMS',
        message: '连衣裙不能与下装同时搭配（功能属性重叠）',
        category: 'dresses'
      });
    }

    if (hasDresses && hasTops && !this.canTopsMatchWithDress(composition.tops)) {
      // 无效冲突2: 连衣裙+普通上装（排除外套情况）
      errors.push({
        code: 'DRESS_WITH_REGULAR_TOPS',
        message: '连衣裙不能与普通上装同时搭配（需排除外套等分层情况）',
        category: 'dresses'
      });
    }

    // 3. 检查基础完整性（必须有鞋子）
    if (!hasShoes) {
      errors.push({
        code: 'MISSING_SHOES',
        message: '缺少鞋子',
        category: 'shoes'
      });
    }

    // 4. 检查基础有效路径
    const hasValidPath1 = hasTops && hasBottoms && hasShoes; // 上装+下装+鞋子
    const hasValidPath2 = hasDresses && hasShoes && (!hasTops || this.canTopsMatchWithDress(composition.tops)) && !hasBottoms; // 连衣裙+鞋子（可选外套）

    if (!hasValidPath1 && !hasValidPath2) {
      // 检查具体缺失什么
      if (hasTops && !hasBottoms && !hasDresses) {
        // 无效基础1: 上装+鞋子（缺少下半身覆盖）
        errors.push({
          code: 'MISSING_BOTTOMS',
          message: '缺少下半身覆盖',
          category: 'bottoms'
        });
      } else if (hasBottoms && !hasTops && !hasDresses) {
        // 无效基础2: 下装+鞋子（缺少上半身覆盖）
        errors.push({
          code: 'MISSING_TOPS',
          message: '缺少上半身覆盖',
          category: 'tops'
        });
      } else if (!hasTops && !hasDresses) {
        errors.push({
          code: 'MISSING_TOPS_OR_DRESS',
          message: '需要上装或连衣裙',
          category: 'tops'
        });
      }
    }
  }

  /**
   * 验证是否有重复的同类型单品
   */
  private validateDuplicateCategories(composition: OutfitComposition, errors: OutfitValidationError[]): void {
    // 检查多个连衣裙
    if (composition.dresses.length > 1) {
      errors.push({
        code: 'MULTIPLE_DRESSES',
        message: '一套穿搭只能有一条连衣裙',
        category: 'dresses'
      });
    }

    // 检查多个同层级上装（排除外套情况）
    const regularTops = composition.tops.filter(item => item.subType !== 'outerwear');
    if (regularTops.length > 1) {
      errors.push({
        code: 'MULTIPLE_REGULAR_TOPS',
        message: '同层级功能属性重叠（如T恤+衬衫）',
        category: 'tops'
      });
    }

    // 检查多个下装
    if (composition.bottoms.length > 1) {
      errors.push({
        code: 'MULTIPLE_BOTTOMS',
        message: '同层级功能属性重叠（如裤子+裙子）',
        category: 'bottoms'
      });
    }
  }

  /**
   * 检查上装是否可以与连衣裙搭配（外套可以，普通上装不可以）
   */
  private canTopsMatchWithDress(tops: ClothingItem[]): boolean {
    return tops.every(item => item.subType === 'outerwear');
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
  canAddCategory(currentItems: ClothingItem[], categoryToAdd: string, subType?: string): boolean {
    // 创建临时穿搭来测试
    const testItem: ClothingItem = {
      id: 'test',
      name: 'test',
      category: categoryToAdd as any,
      subType: subType as any,
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

  /**
   * 获取穿搭规则列表
   */
  getOutfitRules(): OutfitRule[] {
    return this.outfitRules;
  }

  /**
   * 检查特定组合是否有效
   */
  isValidCombination(categories: string[]): boolean {
    const rule = this.outfitRules.find(rule =>
      rule.combination.length === categories.length &&
      rule.combination.every(cat => categories.includes(cat))
    );
    return rule ? rule.isValid : false;
  }

  /**
   * 获取推荐的穿搭组合
   */
  getRecommendedCombinations(): OutfitRule[] {
    return this.outfitRules.filter(rule => rule.isValid);
  }
}

export const outfitValidationService = new OutfitValidationService();