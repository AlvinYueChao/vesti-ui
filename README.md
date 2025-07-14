# 口袋设计师 (Pocket Designer)

一款基于AI的个性化服装搭配助手应用，帮助用户管理衣橱并获得专业的穿搭建议。

## 功能特色

- 🤖 **AI智能搭配**: 基于用户偏好和场景需求，提供个性化穿搭建议
- 👗 **智能衣橱管理**: 数字化管理个人衣物，支持拍照识别和分类
- 🌤️ **天气感知推荐**: 结合实时天气信息，推荐适合的服装搭配
- 📱 **简约现代界面**: 符合现代审美的简洁设计，操作流畅直观
- 💫 **风格个性化**: 通过风格测试了解用户偏好，提供定制化体验

## 项目结构

```
assets/
├── icons/          # 应用图标资源
│   ├── navigation/ # 导航栏图标
│   ├── actions/    # 操作按钮图标
│   ├── weather/    # 天气图标
│   └── clothing/   # 服装分类图标
└── images/         # 图片资源

components/
├── common/         # 通用组件
│   ├── Logo.tsx
│   └── BottomNavigation.tsx
└── ui/            # UI基础组件
    ├── Button.tsx
    ├── Card.tsx
    └── SwipeCard.tsx

pages/
├── onboarding/    # 引导页面
├── home/          # 首页
├── wardrobe/      # 衣橱页面
└── outfit-result/ # 搭配结果页

styles/            # 样式文件
├── colors.scss    # 色彩规范
├── typography.scss # 字体规范
└── components.scss # 组件样式

utils/             # 工具函数
├── constants.ts
└── helpers.ts

services/          # 服务层
└── api.ts        # API接口

hooks/             # 自定义Hooks
└── useWardrobe.ts

types/             # TypeScript类型定义
└── index.ts
```

## 核心页面

### 1. 风格测试页 (StyleTest)
- 用户首次使用时的风格偏好测试
- 卡片滑动交互，收集用户喜好数据
- 为后续推荐建立用户画像基础

### 2. 首页 (HomePage)
- 显示每日穿搭推荐
- 实时天气信息集成
- 快捷功能入口

### 3. 智能衣橱 (WardrobePage)
- 服装分类管理和展示
- 网格布局展示衣物
- 支持添加新衣物

### 4. 搭配结果页 (OutfitResultPage)
- 展示完整搭配方案
- AI搭配理由说明
- 保存或重新生成选项

## 设计规范

### 色彩系统
- **主色**: #1A1A1A (基础黑)
- **辅色**: #F0F2F5 (高级灰)  
- **点缀色**: #FF6B6B (珊瑚粉)
- **文本色**: #333333 (深灰)

### 字体规范
- **中文字体**: 苹方 (PingFang SC) / 思源黑体
- **英文字体**: SF Pro / Helvetica Neue
- **字号**: 标题 18-22pt, 正文 14-16pt, 辅助文字 12pt

## 开发指南

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 类型检查
```bash
npm run type-check
```

## 技术栈

- **前端框架**: React + Next.js
- **类型系统**: TypeScript
- **样式处理**: SCSS
- **状态管理**: React Hooks
- **API通信**: Fetch API

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情