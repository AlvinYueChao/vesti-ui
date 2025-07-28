// 图片工具函数
export const getPlaceholderImage = (originalPath?: string): string => {
  if (originalPath && originalPath !== '/assets/icons/placeholder-icon.svg') {
    console.warn(`Image not found: ${originalPath}, using placeholder instead`);
  }
  return '/assets/icons/placeholder-icon.svg';
};

export const logImageUsage = (context: string) => {
  console.warn(`Using placeholder image in ${context} - original images not available`);
};