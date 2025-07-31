import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { OutfitResultPage } from './OutfitResultPage';
import { useWardrobe } from '../../../hooks/useWardrobe';
import { useOutfitDiary } from '../../../hooks/useOutfitDiary';
import { outfitService, OutfitRecommendation } from '../../../services/outfitService';
import { hexToColorName, extractColorFromItem, convertColorsToNames } from '../../../utils/colorUtils';

const OutfitResultWrapper: React.FC = () => {
  const router = useRouter();
  const { type, scenarioId, scenarioName, itemId, itemName } = router.query;
  const { items: wardrobeItems, loading: wardrobeLoading } = useWardrobe('user-123');
  const { saveOutfitRecord } = useOutfitDiary('user-123');
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [showNetworkImageDialog, setShowNetworkImageDialog] = useState(false);
  const [pendingRecommendation, setPendingRecommendation] = useState<OutfitRecommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Generate outfit recommendation based on wardrobe items
  useEffect(() => {
    if (wardrobeLoading || !wardrobeItems) return;

    let initialRecommendation: OutfitRecommendation;

    if (type === 'scenario' && scenarioId) {
      initialRecommendation = outfitService.generateScenarioOutfit(scenarioId as string, wardrobeItems);
    } else if (type === 'item-based' && itemId) {
      const selectedItem = wardrobeItems.find(item => item.id === itemId);
      if (selectedItem) {
        initialRecommendation = outfitService.generateItemBasedOutfit(selectedItem, wardrobeItems);
      } else {
        // Fallback if item not found
        initialRecommendation = {
          items: [],
          completeness: 0,
          missingCategories: ['tops', 'bottoms', 'shoes'],
          hasNetworkImages: false
        };
      }
    } else {
      return;
    }

    // Check if we need to show network image dialog
    if (initialRecommendation.completeness < 1 && initialRecommendation.missingCategories.length > 0) {
      setPendingRecommendation(initialRecommendation);
      setShowNetworkImageDialog(true);
    } else {
      setRecommendation(initialRecommendation);
    }
  }, [wardrobeLoading, wardrobeItems, type, scenarioId, itemId]);

  const handleUseNetworkImages = () => {
    if (!pendingRecommendation) return;

    const enhancedRecommendation = outfitService.fillWithNetworkImages(
      pendingRecommendation,
      scenarioId as string
    );

    setRecommendation(enhancedRecommendation);
    setShowNetworkImageDialog(false);
    setPendingRecommendation(null);
  };

  const handleUseIncompleteOutfit = () => {
    if (!pendingRecommendation) return;

    setRecommendation(pendingRecommendation);
    setShowNetworkImageDialog(false);
    setPendingRecommendation(null);
  };

  const handleGenerateNewOutfit = async (lockedItems: any[]) => {
    if (!wardrobeItems) return;

    setIsGenerating(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      let newRecommendation: OutfitRecommendation;

      if (type === 'scenario' && scenarioId) {
        newRecommendation = outfitService.generateScenarioOutfitWithLocked(
          scenarioId as string,
          wardrobeItems,
          lockedItems,
          recommendation?.items || []
        );
      } else if (type === 'item-based' && itemId) {
        const selectedItem = wardrobeItems.find(item => item.id === itemId);
        if (selectedItem) {
          newRecommendation = outfitService.generateItemBasedOutfitWithLocked(
            selectedItem,
            wardrobeItems,
            lockedItems,
            recommendation?.items || []
          );
        } else {
          return;
        }
      } else {
        return;
      }

      // Check if we need network images for the new recommendation
      if (newRecommendation.completeness < 1 && newRecommendation.missingCategories.length > 0) {
        setPendingRecommendation(newRecommendation);
        setShowNetworkImageDialog(true);
      } else {
        setRecommendation(newRecommendation);
      }
    } catch (error) {
      console.error('Failed to generate new outfit:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptOutfit = async (items: any[]) => {
    if (isSaving) return; // 防止重复点击

    setIsSaving(true);

    try {
      console.log('开始保存穿搭记录...', items);

      // 获取当前日期信息
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const dayOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][today.getDay()];

      // 提取颜色信息（使用颜色工具函数）
      const extractColors = (items: any[]) => {
        const colorMap: Record<string, string> = {
          '蓝': '#4A90E2',
          '白': '#FFFFFF',
          '黑': '#000000',
          '红': '#FF6B6B',
          '灰': '#CCCCCC',
          '绿': '#7ED321',
          '黄': '#F5A623',
          '紫': '#9013FE',
          '棕': '#8B4513',
          '粉': '#FFB6C1'
        };

        const colors: string[] = [];
        items.forEach(item => {
          if (item.name) {
            Object.keys(colorMap).forEach(colorName => {
              if (item.name.includes(colorName) && !colors.includes(colorMap[colorName])) {
                colors.push(colorMap[colorName]);
              }
            });
          }
        });

        return colors.length > 0 ? colors : ['#CCCCCC']; // 默认颜色
      };

      const colors = extractColors(items);

      // 转换 items 数据结构以匹配详情页面期望的格式
      const formattedItems = items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category, // 保持原始category值
        color: extractColorFromItem(item.name, item.color), // 使用颜色工具函数转换为自然语言
        material: item.material || '棉', // 简化处理，实际应从item数据中获取
        image: item.image,
        imageUrl: item.image, // 添加必需的imageUrl属性
        tags: item.tags || [], // 添加必需的tags属性
        addedDate: item.addedDate || new Date(), // 添加必需的addedDate属性
        brand: item.brand,
        subType: item.subType,
        lastWorn: item.lastWorn
      }));

      // 创建穿搭记录
      const outfitRecord = {
        date: dateStr,
        dayOfWeek,
        weather: {
          location: '上海',
          temperature: '25°C',
          condition: '晴'
        },
        colors,
        image: '/assets/images/virtual-tryon-placeholder.jpg', // 虚拟试穿图片占位符
        description: `基于${scenarioName || itemName || '推荐'}的搭配`,
        items: formattedItems, // 使用格式化后的items
        scenario: scenarioId as string || undefined,
        aiComment: recommendation ? outfitService.generateAIComment(
          recommendation,
          scenarioId as string,
          itemName as string
        ) : '精心搭配的组合',
        // 添加详情页面需要的字段
        aiDesignerNote: recommendation ? outfitService.generateAIComment(
          recommendation,
          scenarioId as string,
          itemName as string
        ) : '精心搭配的组合'
      };

      console.log('准备保存的记录:', outfitRecord);

      // 保存到穿搭日记
      const savedRecord = await saveOutfitRecord(outfitRecord);
      console.log('保存成功:', savedRecord);

      // 短暂延迟后跳转，确保保存完成
      setTimeout(() => {
        router.push('/outfit/diary?refresh=true');
      }, 100);

    } catch (error) {
      console.error('保存穿搭记录失败:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  if (wardrobeLoading) {
    return (
      <div className="outfit-result-page loading">
        <div className="loading-spinner">正在分析您的衣橱...</div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="outfit-result-page loading">
        <div className="loading-spinner">正在生成搭配推荐...</div>
      </div>
    );
  }

  const pageTitle = (scenarioName as string) || (itemName as string) || '搭配推荐';
  const aiComment = outfitService.generateAIComment(
    recommendation,
    scenarioId as string,
    itemName as string
  );

  return (
    <>
      <OutfitResultPage
        scenario={pageTitle}
        items={recommendation.items}
        aiComment={aiComment}
        onGenerateNewOutfit={handleGenerateNewOutfit}
        onAcceptOutfit={handleAcceptOutfit}
        isGenerating={isGenerating}
        isSaving={isSaving}
      />

      {showNetworkImageDialog && (
        <NetworkImageDialog
          missingCategories={pendingRecommendation?.missingCategories || []}
          onUseNetworkImages={handleUseNetworkImages}
          onUseIncomplete={handleUseIncompleteOutfit}
        />
      )}
    </>
  );
};

// Network Image Dialog Component
interface NetworkImageDialogProps {
  missingCategories: string[];
  onUseNetworkImages: () => void;
  onUseIncomplete: () => void;
}

const NetworkImageDialog: React.FC<NetworkImageDialogProps> = ({
  missingCategories,
  onUseNetworkImages,
  onUseIncomplete
}) => {
  const getCategoryDisplayName = (category: string) => {
    const categoryNames: Record<string, string> = {
      'tops': '上装',
      'bottoms': '下装',
      'shoes': '鞋子',
      'outerwear': '外套',
      'accessories': '配饰'
    };
    return categoryNames[category] || category;
  };

  return (
    <div className="network-image-dialog-overlay">
      <div className="network-image-dialog">
        <div className="network-image-dialog__header">
          <h3>搭配提示</h3>
        </div>

        <div className="network-image-dialog__content">
          <div className="network-image-dialog__icon">👗</div>
          <p className="network-image-dialog__message">
            您的衣橱中缺少以下类型的单品：
          </p>
          <div className="network-image-dialog__missing-items">
            {missingCategories.map(category => (
              <span key={category} className="missing-item-tag">
                {getCategoryDisplayName(category)}
              </span>
            ))}
          </div>
          <p className="network-image-dialog__suggestion">
            我们可以使用网图暂代这些单品，帮您完成搭配预览。
          </p>
        </div>

        <div className="network-image-dialog__actions">
          <button
            className="dialog-button dialog-button--secondary"
            onClick={onUseIncomplete}
          >
            仅显示现有单品
          </button>
          <button
            className="dialog-button dialog-button--primary"
            onClick={onUseNetworkImages}
          >
            使用网图暂代
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutfitResultWrapper;