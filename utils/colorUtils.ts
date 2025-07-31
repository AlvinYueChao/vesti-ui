// 颜色代码转换为自然语言描述的工具函数

export interface ColorMapping {
  hex: string;
  name: string;
}

// 常见颜色映射表
const COLOR_MAPPINGS: ColorMapping[] = [
  // 白色系
  { hex: '#FFFFFF', name: '纯白色' },
  { hex: '#FFFEF7', name: '米白色' },
  { hex: '#FFF8DC', name: '玉米丝色' },
  { hex: '#F5F5DC', name: '米色' },
  { hex: '#FAF0E6', name: '亚麻色' },
  { hex: '#FDF5E6', name: '老花色' },
  
  // 黑色系
  { hex: '#000000', name: '纯黑色' },
  { hex: '#2F2F2F', name: '深灰黑' },
  { hex: '#36454F', name: '木炭色' },
  
  // 灰色系
  { hex: '#808080', name: '中灰色' },
  { hex: '#A9A9A9', name: '深灰色' },
  { hex: '#D3D3D3', name: '浅灰色' },
  { hex: '#DCDCDC', name: '淡灰色' },
  { hex: '#F5F5F5', name: '烟白色' },
  { hex: '#CCCCCC', name: '银灰色' },
  
  // 红色系
  { hex: '#FF0000', name: '正红色' },
  { hex: '#FF6B6B', name: '珊瑚红' },
  { hex: '#DC143C', name: '深红色' },
  { hex: '#B22222', name: '火砖红' },
  { hex: '#8B0000', name: '暗红色' },
  { hex: '#FFB6C1', name: '浅粉色' },
  { hex: '#FFC0CB', name: '粉红色' },
  { hex: '#FF69B4', name: '热粉色' },
  { hex: '#FF1493', name: '深粉色' },
  
  // 蓝色系
  { hex: '#0000FF', name: '正蓝色' },
  { hex: '#4A90E2', name: '天蓝色' },
  { hex: '#87CEEB', name: '天空蓝' },
  { hex: '#4169E1', name: '皇家蓝' },
  { hex: '#000080', name: '海军蓝' },
  { hex: '#191970', name: '午夜蓝' },
  { hex: '#6495ED', name: '矢车菊蓝' },
  { hex: '#B0E0E6', name: '粉蓝色' },
  { hex: '#ADD8E6', name: '浅蓝色' },
  { hex: '#00BFFF', name: '深天蓝' },
  
  // 绿色系
  { hex: '#008000', name: '正绿色' },
  { hex: '#7ED321', name: '草绿色' },
  { hex: '#32CD32', name: '酸橙绿' },
  { hex: '#228B22', name: '森林绿' },
  { hex: '#006400', name: '深绿色' },
  { hex: '#90EE90', name: '浅绿色' },
  { hex: '#98FB98', name: '苍绿色' },
  { hex: '#00FF7F', name: '春绿色' },
  { hex: '#3CB371', name: '中海绿' },
  
  // 黄色系
  { hex: '#FFFF00', name: '正黄色' },
  { hex: '#F5A623', name: '橙黄色' },
  { hex: '#FFD700', name: '金黄色' },
  { hex: '#FFA500', name: '橙色' },
  { hex: '#FFFFE0', name: '浅黄色' },
  { hex: '#FFFACD', name: '柠檬绸色' },
  { hex: '#F0E68C', name: '卡其色' },
  
  // 紫色系
  { hex: '#800080', name: '正紫色' },
  { hex: '#9013FE', name: '紫罗兰' },
  { hex: '#8A2BE2', name: '蓝紫色' },
  { hex: '#9400D3', name: '暗紫色' },
  { hex: '#DA70D6', name: '兰花紫' },
  { hex: '#DDA0DD', name: '梅红色' },
  { hex: '#E6E6FA', name: '薰衣草色' },
  
  // 棕色系
  { hex: '#8B4513', name: '马鞍棕' },
  { hex: '#A0522D', name: '赭石色' },
  { hex: '#CD853F', name: '秘鲁色' },
  { hex: '#D2691E', name: '巧克力色' },
  { hex: '#8B4513', name: '深棕色' },
  { hex: '#F4A460', name: '沙棕色' },
  { hex: '#DEB887', name: '硬木色' },
  { hex: '#D2B48C', name: '茶色' },
  
  // 其他颜色
  { hex: '#FF4500', name: '橙红色' },
  { hex: '#FF8C00', name: '深橙色' },
  { hex: '#20B2AA', name: '浅海绿' },
  { hex: '#48D1CC', name: '中绿松石' },
  { hex: '#40E0D0', name: '绿松石' },
  { hex: '#00CED1', name: '深绿松石' },
];

/**
 * 将十六进制颜色代码转换为自然语言描述
 * @param hexColor 十六进制颜色代码，如 "#FF0000" 或 "FF0000"
 * @returns 颜色的自然语言描述
 */
export function hexToColorName(hexColor: string): string {
  if (!hexColor) return '未知颜色';
  
  // 标准化颜色代码格式
  const normalizedHex = hexColor.startsWith('#') ? hexColor.toUpperCase() : `#${hexColor.toUpperCase()}`;
  
  // 精确匹配
  const exactMatch = COLOR_MAPPINGS.find(mapping => mapping.hex === normalizedHex);
  if (exactMatch) {
    return exactMatch.name;
  }
  
  // 如果没有精确匹配，尝试近似匹配
  const approximateMatch = findClosestColor(normalizedHex);
  if (approximateMatch) {
    return approximateMatch.name;
  }
  
  // 如果都没有匹配，返回原始颜色代码
  return hexColor;
}

/**
 * 找到最接近的颜色
 * @param targetHex 目标颜色的十六进制代码
 * @returns 最接近的颜色映射
 */
function findClosestColor(targetHex: string): ColorMapping | null {
  if (!targetHex.startsWith('#') || targetHex.length !== 7) {
    return null;
  }
  
  const targetRgb = hexToRgb(targetHex);
  if (!targetRgb) return null;
  
  let closestColor: ColorMapping | null = null;
  let minDistance = Infinity;
  
  for (const mapping of COLOR_MAPPINGS) {
    const mappingRgb = hexToRgb(mapping.hex);
    if (!mappingRgb) continue;
    
    const distance = calculateColorDistance(targetRgb, mappingRgb);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = mapping;
    }
  }
  
  // 只有当距离足够近时才返回近似匹配
  return minDistance < 100 ? closestColor : null;
}

/**
 * 将十六进制颜色转换为RGB
 * @param hex 十六进制颜色代码
 * @returns RGB对象或null
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * 计算两个RGB颜色之间的欧几里得距离
 * @param rgb1 第一个RGB颜色
 * @param rgb2 第二个RGB颜色
 * @returns 颜色距离
 */
function calculateColorDistance(
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number }
): number {
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

/**
 * 批量转换颜色数组
 * @param hexColors 十六进制颜色代码数组
 * @returns 自然语言颜色描述数组
 */
export function convertColorsToNames(hexColors: string[]): string[] {
  return hexColors.map(hexToColorName);
}

/**
 * 从单品名称中提取颜色信息并转换为自然语言
 * @param itemName 单品名称
 * @param hexColor 十六进制颜色代码（可选）
 * @returns 颜色的自然语言描述
 */
export function extractColorFromItem(itemName: string, hexColor?: string): string {
  // 如果提供了十六进制颜色代码，优先使用
  if (hexColor) {
    return hexToColorName(hexColor);
  }
  
  // 从名称中提取颜色关键词
  const colorKeywords = [
    { keywords: ['白', 'white'], name: '白色' },
    { keywords: ['黑', 'black'], name: '黑色' },
    { keywords: ['红', 'red'], name: '红色' },
    { keywords: ['蓝', 'blue'], name: '蓝色' },
    { keywords: ['绿', 'green'], name: '绿色' },
    { keywords: ['黄', 'yellow'], name: '黄色' },
    { keywords: ['紫', 'purple'], name: '紫色' },
    { keywords: ['粉', 'pink'], name: '粉色' },
    { keywords: ['灰', 'gray', 'grey'], name: '灰色' },
    { keywords: ['棕', 'brown'], name: '棕色' },
    { keywords: ['橙', 'orange'], name: '橙色' },
    { keywords: ['米', 'beige'], name: '米色' },
    { keywords: ['卡其', 'khaki'], name: '卡其色' },
    { keywords: ['海军', 'navy'], name: '海军蓝' },
    { keywords: ['天空', 'sky'], name: '天空蓝' },
    { keywords: ['森林', 'forest'], name: '森林绿' },
    { keywords: ['柠檬', 'lemon'], name: '柠檬黄' },
    { keywords: ['薰衣草', 'lavender'], name: '薰衣草色' },
    { keywords: ['珊瑚', 'coral'], name: '珊瑚色' },
    { keywords: ['金', 'gold'], name: '金色' },
    { keywords: ['银', 'silver'], name: '银色' },
  ];
  
  const lowerName = itemName.toLowerCase();
  
  for (const colorInfo of colorKeywords) {
    for (const keyword of colorInfo.keywords) {
      if (lowerName.includes(keyword)) {
        return colorInfo.name;
      }
    }
  }
  
  return '未知颜色';
}