// 国际化Hook
import { useState, useEffect } from 'react';
import { translationService, SupportedLocale } from '../services/translationService';

export const useTranslation = () => {
  const [locale, setLocale] = useState<SupportedLocale>(translationService.getCurrentLocale());

  const changeLocale = (newLocale: SupportedLocale) => {
    translationService.setLocale(newLocale);
    setLocale(newLocale);
  };

  const t = (key: string, defaultValue?: string) => {
    return translationService.translate(key, defaultValue);
  };

  const tCategory = (category: string) => {
    return translationService.translateClothingCategory(category as any);
  };

  const tColor = (color: string) => {
    return translationService.translateColor(color);
  };

  const tMaterial = (material: string) => {
    return translationService.translateMaterial(material);
  };

  const tBrand = (brand: string) => {
    return translationService.translateBrand(brand);
  };

  return {
    locale,
    changeLocale,
    t,
    tCategory,
    tColor,
    tMaterial,
    tBrand,
    getSupportedLocales: () => translationService.getSupportedLocales()
  };
};