import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { OutfitResultPage } from './OutfitResultPage';
import { useWardrobe } from '../../../hooks/useWardrobe';
import { outfitService, OutfitRecommendation } from '../../../services/outfitService';

const OutfitResultWrapper: React.FC = () => {
  const router = useRouter();
  const { type, scenarioId, scenarioName, itemId, itemName } = router.query;
  const { items: wardrobeItems, loading: wardrobeLoading } = useWardrobe('user-123');
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [showNetworkImageDialog, setShowNetworkImageDialog] = useState(false);
  const [pendingRecommendation, setPendingRecommendation] = useState<OutfitRecommendation | null>(null);

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