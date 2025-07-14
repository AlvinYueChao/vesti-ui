// App constants

export const APP_CONFIG = {
  name: '口袋设计师',
  slogan: '你的AI专属设计师',
  version: '1.0.0',
} as const;

export const CLOTHING_CATEGORIES = {
  TOPS: 'tops',
  BOTTOMS: 'bottoms', 
  SHOES: 'shoes',
  ACCESSORIES: 'accessories',
} as const;

export const STYLE_TYPES = {
  CASUAL: 'casual',
  BUSINESS: 'business',
  TRENDY: 'trendy',
  ELEGANT: 'elegant',
  SPORTY: 'sporty',
} as const;

export const WEATHER_CONDITIONS = {
  SUNNY: 'sunny',
  CLOUDY: 'cloudy',
  RAINY: 'rainy',
  SNOWY: 'snowy',
} as const;

export const SCENARIOS = {
  WORK: 'work',
  CASUAL: 'casual',
  DATE: 'date',
  PARTY: 'party',
  VACATION: 'vacation',
  SPORT: 'sport',
} as const;

export const NAVIGATION_TABS = [
  { id: 'home', label: '首页', icon: 'home' },
  { id: 'wardrobe', label: '衣橱', icon: 'wardrobe' },
  { id: 'discover', label: '发现', icon: 'discover' },
  { id: 'profile', label: '我的', icon: 'profile' },
] as const;