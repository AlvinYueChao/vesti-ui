# 口袋搭配师 Web 应用架构设计文档

## 1. 项目概述

### 1.1 项目背景
"口袋搭配师"是一款基于AI技术的个性化服装搭配Web应用，旨在帮助用户管理个人衣橱，提供智能穿搭建议，提升用户的穿搭品味和效率。

### 1.2 核心功能
- 个性化风格测试与用户画像
- 智能服装搭配推荐系统
- 个人衣橱管理与分类
- 天气感知搭配建议
- 穿搭记录与日记功能
- 场景化着装推荐
- 发现页面与时尚资讯

## 2. 技术架构

### 2.1 整体架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端应用       │    │    后端服务      │    │   AI服务引擎     │
│   (Next.js)     │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  React组件  │ │    │ │   API网关   │ │    │ │  风格识别   │ │
│ │  (UI Layer) │ │    │ │             │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  Hooks状态  │ │    │ │  业务逻辑   │ │    │ │  搭配算法   │ │
│ │  管理       │ │◄──►│ │  (Service)  │ │◄──►│ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  API服务层  │ │    │ │   数据层    │ │    │ │  图像识别   │ │
│ │  (Services) │ │    │ │  (Database) │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2.2 前端技术栈
- **框架**: Next.js 15.4.0 + React 18
- **语言**: TypeScript 5.0
- **样式**: SCSS + CSS3
- **状态管理**: React Hooks (useState, useEffect, custom hooks)
- **路由**: Next.js App Router
- **构建工具**: Next.js内置构建系统
- **代码规范**: ESLint + TypeScript

### 2.3 核心模块设计

#### 2.3.1 页面架构
```
pages/
├── index.tsx              # 入口页面（根据onboarding状态路由）
├── _app.tsx              # 应用根组件
├── onboarding/           # 首次启动与风格测试
│   └── StyleTest.tsx     # 风格测试组件
├── home/                 # 首页
│   └── HomePage.tsx      # 首页主组件
├── wardrobe/             # 智能衣橱
│   ├── index.tsx         # 衣橱页面入口
│   └── WardrobePage.tsx  # 衣橱主页面
├── outfit/               # 搭配相关页面
│   ├── result/           # 搭配结果页
│   ├── scenario-selection/ # 场景选择页
│   └── outfit-result.tsx # 搭配结果展示
├── discover/             # 发现页
├── user/                 # 用户相关页面
│   └── profile/          # 个人中心
├── article/              # 文章详情页
└── auth/                 # 认证相关页面
```

#### 2.3.2 组件架构
```
components/
├── common/               # 通用组件
│   ├── BottomNavigation/ # 底部导航
│   ├── Logo/            # Logo组件
│   └── ...              # 其他通用组件
├── ui/                  # UI基础组件
│   ├── Button/          # 按钮组件
│   ├── Card/            # 卡片组件
│   ├── Modal/           # 弹窗组件
│   └── ...              # 其他UI组件
├── wardrobe/            # 衣橱相关组件
│   ├── CategoryFilter/  # 分类筛选
│   ├── WardrobeGrid/    # 衣物网格
│   └── FloatingActionButton/ # 浮动操作按钮
└── discover/            # 发现页组件
    └── ...              # 发现页相关组件
```

#### 2.3.3 数据管理架构
```
hooks/                   # 自定义Hooks
├── useWardrobe.ts       # 衣橱数据管理
└── useOutfitDiary.ts    # 穿搭日记管理

services/                # 服务层
├── api.ts              # API服务封装
└── outfitService.ts    # 搭配推荐服务

types/                   # 类型定义
└── index.ts            # 全局类型定义

utils/                   # 工具函数
└── ...                 # 各种工具函数
```

## 3. 核心功能设计

### 3.1 风格测试系统
```typescript
// 风格测试组件实现
interface StyleOption {
  id: string;
  image: string;
  style: string;
}

// 风格测试流程
const StyleTest: React.FC = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preferences, setPreferences] = useState<string[]>([]);
  
  const styleOptions: StyleOption[] = [
    { id: '1', image: '/assets/images/style-1.jpg', style: 'casual' },
    { id: '2', image: '/assets/images/style-2.jpg', style: 'business' },
    { id: '3', image: '/assets/images/style-3.jpg', style: 'trendy' },
    { id: '4', image: '/assets/images/style-4.jpg', style: 'elegant' }
  ];
  
  // 左滑（不喜欢）和右滑（喜欢）逻辑
  const handleSwipeLeft = () => nextCard();
  const handleSwipeRight = () => {
    const currentStyle = styleOptions[currentIndex]?.style;
    if (currentStyle) {
      setPreferences(prev => [...prev, currentStyle]);
    }
    nextCard();
  };
};
```

### 3.2 智能搭配算法
```typescript
// 搭配推荐服务
class OutfitService {
  // 场景化搭配推荐
  generateScenarioOutfit(scenarioId: string, wardrobeItems: ClothingItem[]): OutfitRecommendation {
    const requiredCategories = SCENARIO_REQUIREMENTS[scenarioId] || ['tops', 'bottoms', 'shoes'];
    const selectedItems: OutfitItem[] = [];
    const missingCategories: string[] = [];

    // 从衣橱中选择每个类别的单品
    for (const category of requiredCategories) {
      const categoryItems = wardrobeItems.filter(item => item.category === category);
      if (categoryItems.length > 0) {
        const selectedItem = this.selectBestItemForScenario(categoryItems, scenarioId);
        selectedItems.push(this.convertToOutfitItem(selectedItem));
      } else {
        missingCategories.push(category);
      }
    }

    return {
      items: selectedItems,
      completeness: selectedItems.length / requiredCategories.length,
      missingCategories,
      hasNetworkImages: false
    };
  }

  // 基于单品的搭配推荐
  generateItemBasedOutfit(selectedItem: ClothingItem, wardrobeItems: ClothingItem[]): OutfitRecommendation {
    const complementaryItems = [this.convertToOutfitItem(selectedItem)];
    const neededCategories = this.getComplementaryCategories(selectedItem.category);
    
    // 为每个需要的类别选择搭配单品
    for (const category of neededCategories) {
      const categoryItems = wardrobeItems.filter(item => 
        item.category === category && item.id !== selectedItem.id
      );
      
      if (categoryItems.length > 0) {
        const complementaryItem = this.selectComplementaryItem(categoryItems, selectedItem);
        complementaryItems.push(this.convertToOutfitItem(complementaryItem));
      }
    }

    return {
      items: complementaryItems,
      completeness: complementaryItems.length / (neededCategories.length + 1),
      missingCategories: [],
      hasNetworkImages: false
    };
  }
}
```

### 3.3 衣橱管理系统
```typescript
// 衣物数据结构
interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory; // 'tops' | 'bottoms' | 'shoes' | 'accessories' | 'outerwear'
  color: string;
  brand?: string;
  image: string;
  imageUrl: string;
  tags: string[];
  addedDate: Date;
  lastWorn?: Date;
}

// 衣橱管理Hook
export const useWardrobe = (userId: string) => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addItem = async (item: Omit<ClothingItem, 'id'>) => {
    const response = await apiService.addClothingItem(userId, item);
    if (response.success && response.data) {
      setItems(prev => [...prev, response.data as ClothingItem]);
      return response.data;
    }
  };

  const getItemsByCategory = (category: ClothingCategory) => {
    return items.filter(item => item.category === category);
  };

  return { items, loading, error, addItem, getItemsByCategory };
};
```

## 4. 用户体验设计

### 4.1 交互流程
1. **首次使用流程**
   - 启动应用 → 风格测试（滑动卡片选择偏好） → 生成用户画像 → 进入首页

2. **日常使用流程**
   - 打开应用 → 查看今日推荐 → 选择搭配 → 记录穿搭日记

3. **衣物管理流程**
   - 进入衣橱 → 分类浏览/添加新衣物 → AI识别分类 → 确认入库

4. **搭配推荐流程**
   - 场景着装：选择场景 → AI推荐搭配 → 查看详情 → 保存/分享
   - 单品搭配：选择单品 → AI推荐搭配 → 查看详情 → 保存/分享

### 4.2 页面导航结构
```
底部导航栏:
├── 首页 (home) - 今日推荐、快捷操作
├── 衣橱 (wardrobe) - 衣物管理、分类浏览
├── 发现 (discover) - 时尚资讯、搭配灵感
└── 我的 (profile) - 个人设置、穿搭日记
```

### 4.3 视觉设计规范
```scss
// 设计系统 (styles/colors.scss)
:root {
  // 主色调
  --primary-color: #1A1A1A;      // 基础黑
  --secondary-color: #F0F2F5;    // 高级灰
  --accent-color: #FF6B6B;       // 珊瑚粉
  --text-color: #333333;         // 深灰
  
  // 字体大小
  --font-size-title: 18px;
  --font-size-body: 14px;
  --font-size-caption: 12px;
  
  // 间距
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 48px;
  
  // 圆角
  --border-radius-sm: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;
}
```

## 5. 性能优化策略

### 5.1 图片优化
- 使用WebP格式和现代图片格式
- 图片懒加载（loading="lazy"）
- 响应式图片（不同尺寸设备适配）
- CDN加速和图片压缩

### 5.2 代码优化
- Next.js自动代码分割
- React组件懒加载（React.lazy）
- 合理使用React.memo避免不必要渲染
- 自定义Hooks复用逻辑

### 5.3 用户体验优化
- 骨架屏loading状态
- 本地存储缓存（localStorage）
- 预加载关键资源
- 流畅的CSS动画过渡
- 错误边界处理

### 5.4 数据管理优化
- Mock数据开发模式
- API请求错误处理
- 数据状态管理优化
- 防抖和节流处理

## 6. 数据安全与隐私

### 6.1 数据加密
- HTTPS传输加密
- 敏感数据本地存储加密
- 图片上传安全校验
- API请求认证机制

### 6.2 隐私保护
- 最小化数据收集原则
- 用户数据本地优先存储
- 透明的数据使用说明
- 用户数据删除机制

## 7. 部署与发布

### 7.1 开发环境
- **开发工具**: VS Code + Next.js开发服务器
- **版本控制**: Git
- **代码规范**: ESLint + TypeScript
- **包管理**: npm/yarn
- **样式预处理**: SCSS

### 7.2 构建与部署
```bash
# 开发环境
npm run dev

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 生产构建
npm run build

# 生产启动
npm run start
```

### 7.3 发布流程
- 开发 → 类型检查 → 代码检查 → 构建 → 部署
- 支持Vercel、Netlify等平台一键部署
- 版本管理与回滚机制

## 8. 核心功能详细说明

### 8.1 穿搭日记功能
```typescript
// 穿搭记录数据结构
interface OutfitRecord {
  id: string;
  date: string;
  dayOfWeek: string;
  weather: {
    location: string;
    temperature: string;
    condition: string;
  };
  colors: string[];
  image: string;
  description?: string;
  items: ClothingItem[];
  scenario?: string;
  aiComment?: string;
  aiDesignerNote?: string;
}

// 穿搭日记管理Hook
export const useOutfitDiary = (userId: string) => {
  const [records, setRecords] = useState<OutfitRecord[]>([]);
  
  const saveOutfitRecord = async (record: Omit<OutfitRecord, 'id'>) => {
    // 保存穿搭记录到后端
  };
  
  const getRecordsForMonth = (date: Date) => {
    // 获取指定月份的穿搭记录
  };
  
  return { records, saveOutfitRecord, getRecordsForMonth };
};
```

### 8.2 场景化搭配推荐
```typescript
// 支持的场景类型
const SCENARIO_REQUIREMENTS = {
  'work-commute': ['tops', 'bottoms', 'shoes'],      // 上班通勤
  'weekend-date': ['tops', 'bottoms', 'shoes'],      // 周末约会
  'beach-vacation': ['tops', 'bottoms', 'shoes'],    // 海边度假
  'business-meeting': ['tops', 'bottoms', 'shoes'],  // 商务会议
  'casual-shopping': ['tops', 'bottoms', 'shoes'],   // 休闲购物
  'party-night': ['tops', 'bottoms', 'shoes']        // 派对夜晚
};

// 网图补充机制
// 当用户衣橱中缺少某类单品时，系统会使用预设的网图进行补充
const NETWORK_FALLBACK_ITEMS = {
  'work-commute': {
    tops: [{ id: 'net-work-shirt-1', name: '白色商务衬衫', ... }],
    bottoms: [{ id: 'net-work-pants-1', name: '黑色西装裤', ... }],
    // ...
  }
};
```

## 9. 后续扩展规划

### 9.1 功能扩展
- **社交分享功能**: 穿搭分享到社交媒体
- **购物推荐集成**: 基于搭配推荐相似商品
- **虚拟试穿功能**: AR/VR试穿体验
- **搭配师社区**: 用户互动和专业建议
- **季节性推荐**: 基于季节和天气的智能推荐

### 9.2 技术升级
- **AI算法优化**: 更精准的风格识别和搭配推荐
- **图像识别增强**: 自动识别衣物属性和风格
- **个性化推荐**: 基于用户行为的深度学习推荐
- **跨平台扩展**: 移动端App、小程序等多平台支持
- **实时协作**: 多用户实时搭配建议和讨论

### 9.3 数据智能化
- **用户行为分析**: 深度了解用户偏好和习惯
- **趋势预测**: 基于大数据的时尚趋势分析
- **个性化标签**: 动态生成用户专属的风格标签
- **智能提醒**: 基于天气、日程的穿搭提醒