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
  image: string;
  tags: string[];
  addedDate: Date;
  lastWorn?: Date;
}

export type ClothingCategory = 'tops' | 'bottoms' | 'shoes' | 'accessories';

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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}