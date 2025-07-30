// 翻译服务测试
import { translationService } from '../../services/translationService';

describe('TranslationService', () => {
  beforeEach(() => {
    // 重置为默认语言
    translationService.setLocale('zh-CN');
  });

  describe('setLocale and getCurrentLocale', () => {
    it('should set and get current locale', () => {
      translationService.setLocale('en-US');
      expect(translationService.getCurrentLocale()).toBe('en-US');
    });
  });

  describe('translate', () => {
    it('should translate keys in Chinese', () => {
      translationService.setLocale('zh-CN');
      expect(translationService.translate('category.tops')).toBe('上装');
      expect(translationService.translate('color.red')).toBe('红色');
    });

    it('should translate keys in English', () => {
      translationService.setLocale('en-US');
      expect(translationService.translate('category.tops')).toBe('Tops');
      expect(translationService.translate('color.red')).toBe('Red');
    });

    it('should return default value for missing keys', () => {
      const result = translationService.translate('missing.key', 'default');
      expect(result).toBe('default');
    });

    it('should return key itself if no default provided', () => {
      const result = translationService.translate('missing.key');
      expect(result).toBe('missing.key');
    });
  });

  describe('translateClothingCategory', () => {
    it('should translate clothing categories in Chinese', () => {
      translationService.setLocale('zh-CN');
      expect(translationService.translateClothingCategory('tops')).toBe('上装');
      expect(translationService.translateClothingCategory('bottoms')).toBe('下装');
      expect(translationService.translateClothingCategory('dresses')).toBe('连衣裙');
      expect(translationService.translateClothingCategory('shoes')).toBe('鞋子');
      expect(translationService.translateClothingCategory('accessories')).toBe('配饰');
    });

    it('should translate clothing categories in English', () => {
      translationService.setLocale('en-US');
      expect(translationService.translateClothingCategory('tops')).toBe('Tops');
      expect(translationService.translateClothingCategory('bottoms')).toBe('Bottoms');
      expect(translationService.translateClothingCategory('dresses')).toBe('Dresses');
      expect(translationService.translateClothingCategory('shoes')).toBe('Shoes');
      expect(translationService.translateClothingCategory('accessories')).toBe('Accessories');
    });
  });

  describe('translateColor', () => {
    it('should translate colors in Chinese', () => {
      translationService.setLocale('zh-CN');
      expect(translationService.translateColor('red')).toBe('红色');
      expect(translationService.translateColor('blue')).toBe('蓝色');
      expect(translationService.translateColor('black')).toBe('黑色');
    });

    it('should translate colors in English', () => {
      translationService.setLocale('en-US');
      expect(translationService.translateColor('red')).toBe('Red');
      expect(translationService.translateColor('blue')).toBe('Blue');
      expect(translationService.translateColor('black')).toBe('Black');
    });

    it('should handle case insensitive colors', () => {
      translationService.setLocale('zh-CN');
      expect(translationService.translateColor('RED')).toBe('红色');
      expect(translationService.translateColor('Red')).toBe('红色');
    });
  });

  describe('translateMaterial', () => {
    it('should translate materials in Chinese', () => {
      translationService.setLocale('zh-CN');
      expect(translationService.translateMaterial('cotton')).toBe('棉');
      expect(translationService.translateMaterial('silk')).toBe('丝绸');
      expect(translationService.translateMaterial('wool')).toBe('羊毛');
    });

    it('should translate materials in English', () => {
      translationService.setLocale('en-US');
      expect(translationService.translateMaterial('cotton')).toBe('Cotton');
      expect(translationService.translateMaterial('silk')).toBe('Silk');
      expect(translationService.translateMaterial('wool')).toBe('Wool');
    });
  });

  describe('loadTranslations', () => {
    it('should load additional translations', () => {
      const additionalTranslations = {
        'test.key': '测试值'
      };
      
      translationService.loadTranslations('zh-CN', additionalTranslations);
      expect(translationService.translate('test.key')).toBe('测试值');
    });
  });

  describe('getSupportedLocales', () => {
    it('should return supported locales', () => {
      const locales = translationService.getSupportedLocales();
      expect(locales).toContain('zh-CN');
      expect(locales).toContain('en-US');
    });
  });
});