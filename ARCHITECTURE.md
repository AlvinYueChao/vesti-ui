# 口袋搭配师微信小程序架构设计文档

## 1. 项目概述

### 1.1 项目背景
"口袋搭配师"是一款基于AI技术的个性化服装搭配微信小程序，旨在帮助用户管理个人衣橱，提供智能穿搭建议，提升用户的穿搭品味和效率。

### 1.2 核心功能
- 个性化风格测试
- 智能服装搭配推荐
- 个人衣橱管理
- 天气感知搭配建议
- 穿搭记录与分享

## 2. 技术架构

### 2.1 整体架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   微信小程序端    │    │    后端服务      │    │   AI服务引擎     │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  用户界面   │ │    │ │   API网关   │ │    │ │  风格识别   │ │
│ │  (UI Layer) │ │    │ │             │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  状态管理   │ │    │ │  业务逻辑   │ │    │ │  搭配算法   │ │
│ │  (Store)    │ │◄──►│ │  (Service)  │ │◄──►│ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  数据访问   │ │    │ │   数据层    │ │    │ │  图像识别   │ │
│ │  (API)      │ │    │ │  (Database) │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2.2 前端技术栈
- **框架**: 微信小程序原生开发
- **状态管理**: 自定义Store模式
- **UI组件**: 自定义组件库
- **样式**: WXSS + CSS3
- **工具库**: 
  - 图片处理
  - 日期时间处理
  - 数据格式化

### 2.3 核心模块设计

#### 2.3.1 页面架构
```
pages/
├── onboarding/         # 首次启动与风格测试
│   ├── index.wxml
│   ├── index.wxss
│   ├── index.js
│   └── index.json
├── home/              # 首页
│   ├── index.wxml
│   ├── index.wxss
│   ├── index.js
│   └── index.json
├── wardrobe/          # 智能衣橱
│   ├── index.wxml
│   ├── index.wxss
│   ├── index.js
│   └── index.json
├── outfit/            # 搭配结果页
│   ├── index.wxml
│   ├── index.wxss
│   ├── index.js
│   └── index.json
├── discovery/         # 发现页
│   ├── index.wxml
│   ├── index.wxss
│   ├── index.js
│   └── index.json
└── profile/           # 个人中心
    ├── index.wxml
    ├── index.wxss
    ├── index.js
    └── index.json
```

#### 2.3.2 组件架构
```
components/
├── common/            # 通用组件
│   ├── button/        # 按钮组件
│   ├── card/          # 卡片组件
│   ├── modal/         # 弹窗组件
│   ├── loading/       # 加载组件
│   └── navbar/        # 导航栏组件
├── business/          # 业务组件
│   ├── style-card/    # 风格卡片
│   ├── outfit-item/   # 搭配单品
│   ├── weather-bar/   # 天气栏
│   ├── clothing-grid/ # 衣物网格
│   └── swipe-cards/   # 滑动卡片
└── layout/            # 布局组件
    ├── tab-bar/       # 底部导航
    ├── header/        # 页面头部
    └── container/     # 容器组件
```

#### 2.3.3 数据流架构
```
utils/
├── store/             # 状态管理
│   ├── index.js       # 主store
│   ├── modules/
│   │   ├── user.js    # 用户状态
│   │   ├── wardrobe.js# 衣橱状态
│   │   ├── outfit.js  # 搭配状态
│   │   └── app.js     # 应用状态
│   └── actions/       # 动作定义
├── api/               # API请求
│   ├── request.js     # 请求封装
│   ├── user.js        # 用户相关API
│   ├── wardrobe.js    # 衣橱相关API
│   ├── outfit.js      # 搭配相关API
│   └── weather.js     # 天气相关API
├── helpers/           # 工具函数
│   ├── image.js       # 图片处理
│   ├── date.js        # 日期处理
│   ├── format.js      # 数据格式化
│   └── storage.js     # 本地存储
└── constants/         # 常量定义
    ├── colors.js      # 颜色常量
    ├── styles.js      # 样式常量
    └── config.js      # 配置常量
```

## 3. 核心功能设计

### 3.1 风格测试系统
```javascript
// 风格测试流程
StyleQuiz: {
  questions: [
    {
      id: 'style_preference',
      type: 'swipe_cards',
      images: ['casual.jpg', 'formal.jpg', 'vintage.jpg'],
      weights: { casual: 1, formal: 2, vintage: 3 }
    }
  ],
  algorithm: 'preference_scoring',
  result: 'user_style_profile'
}
```

### 3.2 智能搭配算法
```javascript
// 搭配推荐逻辑
OutfitRecommendation: {
  inputs: {
    weather: 'temperature, humidity, condition',
    occasion: 'work, casual, formal, date',
    user_style: 'style_profile_vector',
    available_items: 'wardrobe_items_array'
  },
  processing: {
    color_matching: 'color_harmony_rules',
    style_consistency: 'style_compatibility_matrix',
    weather_appropriateness: 'weather_clothing_mapping'
  },
  output: {
    outfit_combinations: 'ranked_outfit_list',
    explanation: 'ai_generated_reasoning'
  }
}
```

### 3.3 衣橱管理系统
```javascript
// 衣物数据结构
ClothingItem: {
  id: 'unique_identifier',
  image: 'image_url',
  category: 'top/bottom/shoes/accessories',
  color: 'primary_color_hex',
  style: 'style_tags_array',
  season: 'spring/summer/autumn/winter',
  occasion: 'casual/formal/sport',
  brand: 'brand_name',
  purchase_date: 'date',
  wear_count: 'number',
  last_worn: 'date'
}
```

## 4. 用户体验设计

### 4.1 交互流程
1. **首次使用流程**
   - 启动小程序 → 风格测试 → 生成用户画像 → 进入首页

2. **日常使用流程**
   - 打开应用 → 查看今日推荐 → 选择搭配 → 记录穿搭

3. **衣物管理流程**
   - 进入衣橱 → 添加新衣物 → AI识别分类 → 确认入库

### 4.2 视觉设计规范
```javascript
// 设计token
DesignTokens: {
  colors: {
    primary: '#1A1A1A',      // 基础黑
    secondary: '#F0F2F5',    // 高级灰
    accent: '#FF6B6B',       // 珊瑚粉
    text: '#333333'          // 深灰
  },
  typography: {
    title: '18-22rpx',
    body: '14-16rpx',
    caption: '12rpx'
  },
  spacing: {
    xs: '8rpx',
    sm: '16rpx',
    md: '24rpx',
    lg: '32rpx',
    xl: '48rpx'
  },
  borderRadius: {
    sm: '8rpx',
    md: '12rpx',
    lg: '16rpx'
  }
}
```

## 5. 性能优化策略

### 5.1 图片优化
- 使用WebP格式
- 图片懒加载
- 缩略图与原图分离
- CDN加速

### 5.2 代码优化
- 按需加载组件
- 减少setData调用
- 合理使用缓存
- 代码分包

### 5.3 用户体验优化
- 骨架屏loading
- 离线数据缓存
- 预加载关键资源
- 流畅的动画过渡

## 6. 数据安全与隐私

### 6.1 数据加密
- 敏感数据传输加密
- 本地存储加密
- 图片上传安全校验

### 6.2 隐私保护
- 最小化数据收集
- 用户授权机制
- 数据删除机制

## 7. 部署与发布

### 7.1 开发环境
- 微信开发者工具
- 版本控制：Git
- 代码规范：ESLint

### 7.2 发布流程
- 开发 → 测试 → 预发布 → 生产发布
- 小程序代码审核
- 版本管理与回滚

## 8. 后续扩展规划

### 8.1 功能扩展
- 社交分享功能
- 购物推荐集成
- 虚拟试穿功能
- 搭配师社区

### 8.2 技术升级
- 引入更先进的AI算法
- 增强现实(AR)试穿
- 个性化推荐优化
- 跨平台扩展