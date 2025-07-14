// Utility helper functions

export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  return `${temp}°${unit}`;
};

export const getWeatherIcon = (condition: string): string => {
  const icons: Record<string, string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
  };
  return icons[condition] || '🌤️';
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    all: '#FF6B6B',
    tops: '#FFB5B5',
    bottoms: '#B5E7FF', 
    shoes: '#FFE5B5',
    accessories: '#E5B5FF',
  };
  return colors[category] || '#F0F2F5';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const classNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};