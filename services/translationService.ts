// 国际化翻译服务
import { ClothingCategory } from '../types';

export type SupportedLocale = 'zh-CN' | 'en-US';

interface TranslationDictionary {
  [key: string]: string;
}

interface LocaleTranslations {
  [locale: string]: TranslationDictionary;
}

// 翻译字典
const translations: LocaleTranslations = {
  'zh-CN': {
    // 服装类型
    'category.tops': '上装',
    'category.bottoms': '下装',
    'category.shoes': '鞋子',
    'category.accessories': '配饰',
    'category.outerwear': '外套',
    'category.dresses': '连衣裙',
    
    // 颜色
    'color.red': '红色',
    'color.blue': '蓝色',
    'color.green': '绿色',
    'color.yellow': '黄色',
    'color.black': '黑色',
    'color.white': '白色',
    'color.gray': '灰色',
    'color.pink': '粉色',
    'color.purple': '紫色',
    'color.orange': '橙色',
    'color.brown': '棕色',
    'color.navy': '深蓝色',
    'color.beige': '米色',
    'color.khaki': '卡其色',
    
    // 材质
    'material.cotton': '棉',
    'material.silk': '丝绸',
    'material.wool': '羊毛',
    'material.linen': '亚麻',
    'material.polyester': '聚酯纤维',
    'material.denim': '牛仔布',
    'material.leather': '皮革',
    'material.cashmere': '羊绒',
    'material.chiffon': '雪纺',
    'material.velvet': '天鹅绒',
    
    // 品牌（示例）
    'brand.uniqlo': '优衣库',
    'brand.zara': 'ZARA',
    'brand.hm': 'H&M',
    'brand.nike': '耐克',
    'brand.adidas': '阿迪达斯',
    
    // 验证错误信息
    'validation.missing_tops_or_dress': '穿搭必须包含上装或连衣裙',
    'validation.missing_bottoms_with_tops': '选择上装时必须搭配下装',
    'validation.missing_shoes': '穿搭必须包含鞋子',
    'validation.dress_with_bottoms': '连衣裙不能与下装同时搭配',
    'validation.multiple_dresses': '一套穿搭只能包含一条连衣裙',
  },
  
  'en-US': {
    // 服装类型
    'category.tops': 'Tops',
    'category.bottoms': 'Bottoms',
    'category.shoes': 'Shoes',
    'category.accessories': 'Accessories',
    'category.outerwear': 'Outerwear',
    'category.dresses': 'Dresses',
    
    // 颜色
    'color.red': 'Red',
    'color.blue': 'Blue',
    'color.green': 'Green',
    'color.yellow': 'Yellow',
    'color.black': 'Black',
    'color.white': 'White',
    'color.gray': 'Gray',
    'color.pink': 'Pink',
    'color.purple': 'Purple',
    'color.orange': 'Orange',
    'color.brown': 'Brown',
    'color.navy': 'Navy',
    'color.beige': 'Beige',
    'color.khaki': 'Khaki',
    
    // 材质
    'material.cotton': 'Cotton',
    'material.silk': 'Silk',
    'material.wool': 'Wool',
    'material.linen': 'Linen',
    'material.polyester': 'Polyester',
    'material.denim': 'Denim',
    'material.leather': 'Leather',
    'material.cashmere': 'Cashmere',
    'material.chiffon': 'Chiffon',
    'material.velvet': 'Velvet',
    
    // 品牌
    'brand.uniqlo': 'UNIQLO',
    'brand.zara': 'ZARA',
    'brand.hm': 'H&M',
    'brand.nike': 'Nike',
    'brand.adidas': 'Adidas',
    
    // 验证错误信息
    'validation.missing_tops_or_dress': 'Outfit must include tops or dress',
    'validation.missing_bottoms_with_tops': 'Bottoms are required when selecting tops',
    'validation.missing_shoes': 'Outfit must include shoes',
    'validation.dress_with_bottoms': 'Dress cannot be paired with bottoms',
    'validation.multiple_dresses': 'Only one dress allowed per outfit',
  }
};

class TranslationService {
  private currentLocale: SupportedLocale = 'zh-CN';
  
  setLocale(locale: SupportedLocale): void {
    this.currentLocale = locale;
  }
  
  getCurrentLocale(): SupportedLocale {
    return this.currentLocale;
  }
  
  translate(key: string, defaultValue?: string): string {
    const localeTranslations = translations[this.currentLocale];
    return localeTranslations?.[key] || defaultValue || key;
  }
  
  translateClothingCategory(category: ClothingCategory): string {
    return this.translate(`category.${category}`, category);
  }
  
  translateColor(color: string): string {
    // 尝试直接翻译，如果没有找到则尝试小写版本
    const lowerColor = color.toLowerCase();
    return this.translate(`color.${lowerColor}`, color);
  }
  
  translateMaterial(material: string): string {
    const lowerMaterial = material.toLowerCase();
    return this.translate(`material.${lowerMaterial}`, material);
  }
  
  translateBrand(brand: string): string {
    const lowerBrand = brand.toLowerCase();
    return this.translate(`brand.${lowerBrand}`, brand);
  }
  
  // 加载额外的翻译数据（用于扩展）
  loadTranslations(locale: SupportedLocale, additionalTranslations: TranslationDictionary): void {
    if (!translations[locale]) {
      translations[locale] = {};
    }
    Object.assign(translations[locale], additionalTranslations);
  }
  
  // 获取所有支持的语言
  getSupportedLocales(): SupportedLocale[] {
    return ['zh-CN', 'en-US'];
  }
}

export const translationService = new TranslationService();