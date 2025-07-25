import { ClothingItem, ClothingCategory } from '../types';

export interface OutfitItem {
  id: string;
  name: string;
  image: string;
  category: string;
  isFromWardrobe?: boolean;
  isNetworkImage?: boolean;
}

export interface OutfitRecommendation {
  items: OutfitItem[];
  completeness: number; // 0-1, 搭配完整度
  missingCategories: string[];
  hasNetworkImages: boolean;
}

// 场景所需的基本单品类别
const SCENARIO_REQUIREMENTS: Record<string, ClothingCategory[]> = {
  'work-commute': ['tops', 'bottoms', 'shoes'],
  'weekend-date': ['tops', 'bottoms', 'shoes'],
  'beach-vacation': ['tops', 'bottoms', 'shoes'],
  'business-meeting': ['tops', 'bottoms', 'shoes'],
  'casual-shopping': ['tops', 'bottoms', 'shoes'],
  'party-night': ['tops', 'bottoms', 'shoes']
};

// 网图备选单品
const NETWORK_FALLBACK_ITEMS: Record<string, Record<ClothingCategory, OutfitItem[]>> = {
  'work-commute': {
    tops: [
      {
        id: 'net-work-shirt-1',
        name: '白色商务衬衫',
        image: '/assets/images/network/work-shirt-white.jpg',
        category: 'tops',
        isNetworkImage: true
      },
      {
        id: 'net-work-shirt-2',
        name: '浅蓝色衬衫',
        image: '/assets/images/network/work-shirt-blue.jpg',
        category: 'tops',
        isNetworkImage: true
      }
    ],
    bottoms: [
      {
        id: 'net-work-pants-1',
        name: '黑色西装裤',
        image: '/assets/images/network/work-pants-black.jpg',
        category: 'bottoms',
        isNetworkImage: true
      },
      {
        id: 'net-work-pants-2',
        name: '深灰色西装裤',
        image: '/assets/images/network/work-pants-gray.jpg',
        category: 'bottoms',
        isNetworkImage: true
      }
    ],
    shoes: [
      {
        id: 'net-work-shoes-1',
        name: '黑色皮鞋',
        image: '/assets/images/network/work-shoes-black.jpg',
        category: 'shoes',
        isNetworkImage: true
      }
    ],
    accessories: [],
    outerwear: []
  },
  'weekend-date': {
    tops: [
      {
        id: 'net-date-top-1',
        name: '粉色针织衫',
        image: '/assets/images/network/date-top-pink.jpg',
        category: 'tops',
        isNetworkImage: true
      }
    ],
    bottoms: [
      {
        id: 'net-date-bottom-1',
        name: '白色A字裙',
        image: '/assets/images/network/date-skirt-white.jpg',
        category: 'bottoms',
        isNetworkImage: true
      }
    ],
    shoes: [
      {
        id: 'net-date-shoes-1',
        name: '小白鞋',
        image: '/assets/images/network/date-shoes-white.jpg',
        category: 'shoes',
        isNetworkImage: true
      }
    ],
    accessories: [],
    outerwear: []
  },
  'beach-vacation': {
    tops: [
      {
        id: 'net-beach-top-1',
        name: '蓝色条纹T恤',
        image: '/assets/images/network/beach-top-stripe.jpg',
        category: 'tops',
        isNetworkImage: true
      }
    ],
    bottoms: [
      {
        id: 'net-beach-bottom-1',
        name: '白色短裤',
        image: '/assets/images/network/beach-shorts-white.jpg',
        category: 'bottoms',
        isNetworkImage: true
      }
    ],
    shoes: [
      {
        id: 'net-beach-shoes-1',
        name: '棕色凉鞋',
        image: '/assets/images/network/beach-sandals-brown.jpg',
        category: 'shoes',
        isNetworkImage: true
      }
    ],
    accessories: [],
    outerwear: []
  },
  'business-meeting': {
    tops: [
      {
        id: 'net-business-top-1',
        name: '白色正装衬衫',
        image: '/assets/images/network/business-shirt-white.jpg',
        category: 'tops',
        isNetworkImage: true
      }
    ],
    bottoms: [
      {
        id: 'net-business-bottom-1',
        name: '深蓝色西装裤',
        image: '/assets/images/network/business-pants-navy.jpg',
        category: 'bottoms',
        isNetworkImage: true
      }
    ],
    shoes: [
      {
        id: 'net-business-shoes-1',
        name: '黑色正装皮鞋',
        image: '/assets/images/network/business-shoes-black.jpg',
        category: 'shoes',
        isNetworkImage: true
      }
    ],
    accessories: [],
    outerwear: []
  },
  'casual-shopping': {
    tops: [
      {
        id: 'net-casual-top-1',
        name: '舒适T恤',
        image: '/assets/images/network/casual-tee.jpg',
        category: 'tops',
        isNetworkImage: true
      }
    ],
    bottoms: [
      {
        id: 'net-casual-bottom-1',
        name: '牛仔裤',
        image: '/assets/images/network/casual-jeans.jpg',
        category: 'bottoms',
        isNetworkImage: true
      }
    ],
    shoes: [
      {
        id: 'net-casual-shoes-1',
        name: '运动鞋',
        image: '/assets/images/network/casual-sneakers.jpg',
        category: 'shoes',
        isNetworkImage: true
      }
    ],
    accessories: [],
    outerwear: []
  },
  'party-night': {
    tops: [
      {
        id: 'net-party-top-1',
        name: '黑色小礼服',
        image: '/assets/images/network/party-dress-black.jpg',
        category: 'tops',
        isNetworkImage: true
      }
    ],
    bottoms: [],
    shoes: [
      {
        id: 'net-party-shoes-1',
        name: '高跟鞋',
        image: '/assets/images/network/party-heels.jpg',
        category: 'shoes',
        isNetworkImage: true
      }
    ],
    accessories: [],
    outerwear: []
  }
};

class OutfitService {
  // 从衣橱中为场景生成搭配
  generateScenarioOutfit(scenarioId: string, wardrobeItems: ClothingItem[]): OutfitRecommendation {
    const requiredCategories = SCENARIO_REQUIREMENTS[scenarioId] || ['tops', 'bottoms', 'shoes'];
    const selectedItems: OutfitItem[] = [];
    const missingCategories: string[] = [];

    // 尝试从衣橱中选择每个类别的单品
    for (const category of requiredCategories) {
      const categoryItems = wardrobeItems.filter(item => item.category === category);
      
      if (categoryItems.length > 0) {
        // 选择最适合场景的单品（这里简化为随机选择）
        const selectedItem = this.selectBestItemForScenario(categoryItems, scenarioId);
        selectedItems.push({
          id: selectedItem.id,
          name: selectedItem.name,
          image: selectedItem.imageUrl,
          category: selectedItem.category,
          isFromWardrobe: true
        });
      } else {
        missingCategories.push(category);
      }
    }

    // 计算完整度
    const completeness = selectedItems.length / requiredCategories.length;

    return {
      items: selectedItems,
      completeness,
      missingCategories,
      hasNetworkImages: false
    };
  }

  // 为缺失的类别添加网图单品
  fillWithNetworkImages(recommendation: OutfitRecommendation, scenarioId: string): OutfitRecommendation {
    const networkItems = NETWORK_FALLBACK_ITEMS[scenarioId];
    if (!networkItems) return recommendation;

    const updatedItems = [...recommendation.items];
    let hasNetworkImages = recommendation.hasNetworkImages;

    for (const missingCategory of recommendation.missingCategories) {
      const categoryNetworkItems = networkItems[missingCategory as ClothingCategory];
      if (categoryNetworkItems && categoryNetworkItems.length > 0) {
        // 选择第一个网图单品
        updatedItems.push(categoryNetworkItems[0]);
        hasNetworkImages = true;
      }
    }

    return {
      items: updatedItems,
      completeness: updatedItems.length / (SCENARIO_REQUIREMENTS[scenarioId]?.length || 3),
      missingCategories: recommendation.missingCategories.filter(category => {
        const categoryNetworkItems = networkItems[category as ClothingCategory];
        return !categoryNetworkItems || categoryNetworkItems.length === 0;
      }),
      hasNetworkImages
    };
  }

  // 基于选中单品生成搭配
  generateItemBasedOutfit(selectedItem: ClothingItem, wardrobeItems: ClothingItem[]): OutfitRecommendation {
    const selectedOutfitItem: OutfitItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      image: selectedItem.imageUrl,
      category: selectedItem.category,
      isFromWardrobe: true
    };

    const complementaryItems: OutfitItem[] = [selectedOutfitItem];
    const neededCategories = this.getComplementaryCategories(selectedItem.category as ClothingCategory);
    const missingCategories: string[] = [];

    // 为每个需要的类别选择搭配单品
    for (const category of neededCategories) {
      const categoryItems = wardrobeItems.filter(item => 
        item.category === category && item.id !== selectedItem.id
      );
      
      if (categoryItems.length > 0) {
        const complementaryItem = this.selectComplementaryItem(categoryItems, selectedItem);
        complementaryItems.push({
          id: complementaryItem.id,
          name: complementaryItem.name,
          image: complementaryItem.imageUrl,
          category: complementaryItem.category,
          isFromWardrobe: true
        });
      } else {
        missingCategories.push(category);
      }
    }

    const totalNeeded = neededCategories.length + 1; // +1 for the selected item
    const completeness = complementaryItems.length / totalNeeded;

    return {
      items: complementaryItems,
      completeness,
      missingCategories,
      hasNetworkImages: false
    };
  }

  // 选择最适合场景的单品
  private selectBestItemForScenario(items: ClothingItem[], scenarioId: string): ClothingItem {
    // 这里可以实现更复杂的选择逻辑，比如根据颜色、风格等
    // 目前简化为随机选择
    return items[Math.floor(Math.random() * items.length)];
  }

  // 获取互补的类别
  private getComplementaryCategories(selectedCategory: ClothingCategory): ClothingCategory[] {
    switch (selectedCategory) {
      case 'tops':
        return ['bottoms', 'shoes'];
      case 'bottoms':
        return ['tops', 'shoes'];
      case 'shoes':
        return ['tops', 'bottoms'];
      case 'outerwear':
        return ['tops', 'bottoms', 'shoes'];
      case 'accessories':
        return ['tops', 'bottoms'];
      default:
        return ['tops', 'bottoms', 'shoes'];
    }
  }

  // 选择互补的单品
  private selectComplementaryItem(items: ClothingItem[], selectedItem: ClothingItem): ClothingItem {
    // 这里可以实现颜色搭配、风格匹配等逻辑
    // 目前简化为随机选择
    return items[Math.floor(Math.random() * items.length)];
  }

  // 生成AI评论
  generateAIComment(recommendation: OutfitRecommendation, scenarioId?: string, selectedItemName?: string): string {
    if (recommendation.hasNetworkImages) {
      const wardrobeItemCount = recommendation.items.filter(item => item.isFromWardrobe).length;
      const networkItemCount = recommendation.items.filter(item => item.isNetworkImage).length;
      
      let comment = '';
      if (scenarioId) {
        comment = this.getScenarioComment(scenarioId);
      } else if (selectedItemName) {
        comment = `基于您选择的"${selectedItemName}"，我为您推荐了这些搭配单品。`;
      }
      
      comment += ` 由于您的衣橱中缺少${networkItemCount}件适合的单品，我们使用了网图进行暂代。建议您考虑添加这些类型的单品到衣橱中。`;
      
      return comment;
    } else {
      if (scenarioId) {
        return this.getScenarioComment(scenarioId) + ' 所有单品都来自您的个人衣橱，搭配更贴合您的风格。';
      } else if (selectedItemName) {
        return `基于您选择的"${selectedItemName}"，我从您的衣橱中为您推荐了这些搭配单品，整体风格协调统一。`;
      }
    }
    
    return '为您精心挑选的搭配组合，时尚又实用。';
  }

  private getScenarioComment(scenarioId: string): string {
    switch (scenarioId) {
      case 'work-commute':
        return '经典的商务休闲搭配，既专业又舒适，非常适合日常通勤。';
      case 'weekend-date':
        return '温柔浪漫的约会造型，既优雅又不失活力。';
      case 'beach-vacation':
        return '轻松惬意的度假风情，完美贴合海边环境，时尚又舒适。';
      case 'business-meeting':
        return '正式专业的商务形象，整体搭配得体，适合重要商务场合。';
      case 'casual-shopping':
        return '舒适自在的休闲组合，非常适合长时间购物活动。';
      case 'party-night':
        return '时尚亮眼的派对造型，既优雅又充满魅力。';
      default:
        return '为您精心挑选的搭配组合。';
    }
  }
}

export const outfitService = new OutfitService();