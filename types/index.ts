// Type definitions for the application

export interface User {
  id: string;
  name: string;
  preferences: StylePreferences;
  wardrobe: ClothingItem[];
}

export interface StylePreferences {
  preferredStyles: string[];
  bodyType?: string;
  favoriteColors: string[];
  dislikedItems?: string[];
}

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  color: string;
  brand?: string;
  material?: string;
  image: string;
  imageUrl: string;
  tags: string[];
  addedDate: Date;
  lastWorn?: Date;
}

export type ClothingCategory = 'tops' | 'bottoms' | 'shoes' | 'accessories' | 'outerwear' | 'dresses';

export interface OutfitRecommendation {
  id: string;
  items: ClothingItem[];
  style: string;
  scenario: string;
  confidence: number;
  reasoning: string;
  image?: string;
}

export interface ScenarioOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface OutfitResult {
  id: string;
  type: 'scenario' | 'item-based';
  title: string;
  subtitle?: string;
  targetItem?: ClothingItem;
  scenario?: ScenarioOption;
  outfits: OutfitRecommendation[];
  currentIndex: number;
}

export interface WeatherInfo {
  location: string;
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
}

export interface OutfitHistory {
  id: string;
  outfit: OutfitRecommendation;
  wornDate: Date;
  rating?: number;
  notes?: string;
}

export interface SwipeAction {
  direction: 'left' | 'right';
  item: any;
}

export interface NavigationTab {
  id: string;
  label: string;
  icon: string;
  path?: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  thumbnail: string;
  readCount: string;
  category: string;
  isBookmarked: boolean;
  content?: string;
  author?: string;
  publishDate?: Date;
  tags?: string[];
}

export interface BannerData {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 穿搭验证相关类型
export interface OutfitValidationError {
  code: string;
  message: string;
  category?: ClothingCategory;
}

export interface OutfitValidationResult {
  isValid: boolean;
  errors: OutfitValidationError[];
  warnings?: OutfitValidationError[];
}

export interface OutfitComposition {
  tops: ClothingItem[];
  bottoms: ClothingItem[];
  dresses: ClothingItem[];
  shoes: ClothingItem[];
  accessories: ClothingItem[];
  outerwear: ClothingItem[];
}