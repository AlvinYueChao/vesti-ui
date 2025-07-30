import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWardrobe } from '../../../hooks/useWardrobe';
import { useOutfitDiary } from '../../../hooks/useOutfitDiary';
import { ClothingItem } from '../../../types';

interface ItemDetailInfo extends ClothingItem {
  description?: string;
  material?: string;
  stylingTips?: string[];
  isInWardrobe: boolean;
}

const WardrobeItemDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [itemDetail, setItemDetail] = useState<ItemDetailInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToWardrobe, setAddingToWardrobe] = useState(false);
  
  const { items: wardrobeItems, addItem: addToWardrobe, loading: wardrobeLoading } = useWardrobe('user-123');
  const { records, loading: diaryLoading } = useOutfitDiary('user-123');

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      setLoading(false);
      return;
    }

    // 等待数据加载完成
    if (wardrobeLoading || diaryLoading) {
      return;
    }

    // 首先在衣橱中查找
    const wardrobeItem = wardrobeItems.find(item => item.id === id);
    
    if (wardrobeItem) {
      setItemDetail({
        ...wardrobeItem,
        description: `这是一件${wardrobeItem.color}的${wardrobeItem.name}，来自${wardrobeItem.brand || '未知品牌'}。`,
        material: getItemMaterial(wardrobeItem.category),
        stylingTips: getItemStylingTips(wardrobeItem.category, wardrobeItem.color),
        isInWardrobe: true
      });
      setLoading(false);
      return;
    }

    // 如果衣橱中没有，在穿搭记录中查找
    let outfitItem: ClothingItem | null = null;
    for (const record of records) {
      const foundItem = record.items.find(item => item.id === id);
      if (foundItem) {
        outfitItem = foundItem;
        break;
      }
    }

    if (outfitItem) {
      setItemDetail({
        ...outfitItem,
        description: `这是一件${outfitItem.color}的${outfitItem.name}，推荐用于搭配。`,
        material: outfitItem.material || getItemMaterial(outfitItem.category),
        stylingTips: getItemStylingTips(outfitItem.category, outfitItem.color),
        isInWardrobe: false
      });
    }
    
    setLoading(false);
  }, [id, wardrobeItems, records, wardrobeLoading, diaryLoading]);

  // 监听衣橱变化，实时更新单品的衣橱状态
  useEffect(() => {
    if (itemDetail && !itemDetail.isInWardrobe) {
      const isNowInWardrobe = wardrobeItems.some(item => item.id === itemDetail.id);
      if (isNowInWardrobe) {
        setItemDetail(prev => prev ? { ...prev, isInWardrobe: true } : null);
      }
    }
  }, [wardrobeItems, itemDetail]);

  const getItemMaterial = (category: string): string => {
    const materials: Record<string, string> = {
      'tops': '棉质',
      'bottoms': '牛仔布',
      'shoes': '皮革',
      'accessories': '金属',
      'outerwear': '羊毛'
    };
    return materials[category] || '混合材质';
  };

  const getItemStylingTips = (category: string, color: string): string[] => {
    const baseTips: Record<string, string[]> = {
      'tops': ['可以搭配牛仔裤营造休闲感', '配西装裤适合正式场合', '叠穿外套增加层次感'],
      'bottoms': ['搭配简约上衣突出下装', '选择合适的鞋子很重要', '注意整体色彩平衡'],
      'shoes': ['与整体风格保持一致', '考虑场合的正式程度', '颜色可以呼应其他配饰'],
      'accessories': ['起到画龙点睛的作用', '不要过度搭配', '与主要单品形成呼应'],
      'outerwear': ['作为整体造型的重点', '内搭要简洁', '颜色可以大胆一些']
    };
    
    const colorTips: Record<string, string> = {
      '黑色': '经典百搭，可以与任何颜色组合',
      '白色': '清爽干净，适合春夏季节',
      '蓝色': '沉稳可靠，商务休闲皆宜',
      '红色': '热情活力，适合作为亮点色',
      '灰色': '低调优雅，容易搭配'
    };

    const tips = baseTips[category] || ['注意整体搭配的和谐性'];
    const colorTip = colorTips[color];
    
    return colorTip ? [...tips, colorTip] : tips;
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddToWardrobe = async () => {
    if (!itemDetail || itemDetail.isInWardrobe) return;
    
    setAddingToWardrobe(true);
    try {
      const newItem = await addToWardrobe({
        name: itemDetail.name,
        category: itemDetail.category,
        color: itemDetail.color,
        brand: itemDetail.brand,
        material: itemDetail.material,
        image: itemDetail.image || itemDetail.imageUrl || '',
        imageUrl: itemDetail.image || itemDetail.imageUrl || '',
        tags: itemDetail.tags || [],
        addedDate: new Date()
      });
      
      // 立即更新状态
      setItemDetail(prev => prev ? { ...prev, isInWardrobe: true } : null);
      alert('已成功添加到衣橱！');
    } catch (error) {
      console.error('添加到衣橱失败:', error);
      alert('添加失败，请重试');
    } finally {
      setAddingToWardrobe(false);
    }
  };

  if (loading || wardrobeLoading || diaryLoading) {
    return (
      <div className="item-detail-page">
        <header className="item-detail-page__header">
          <button className="item-detail-page__back-btn" onClick={handleBack}>
            ‹
          </button>
          <h1 className="item-detail-page__title">单品详情</h1>
          <div className="item-detail-page__header-spacer"></div>
        </header>
        <div className="item-detail-page__loading">加载中...</div>
      </div>
    );
  }

  if (!itemDetail) {
    return (
      <div className="item-detail-page">
        <header className="item-detail-page__header">
          <button className="item-detail-page__back-btn" onClick={handleBack}>
            ‹
          </button>
          <h1 className="item-detail-page__title">单品详情</h1>
          <div className="item-detail-page__header-spacer"></div>
        </header>
        <div className="item-detail-page__error">
          <div className="item-detail-page__error-icon">😔</div>
          <div className="item-detail-page__error-text">单品不存在</div>
          <button 
            className="item-detail-page__error-btn"
            onClick={handleBack}
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="item-detail-page">
      {/* 顶部导航栏 */}
      <header className="item-detail-page__header">
        <button className="item-detail-page__back-btn" onClick={handleBack}>
          ‹
        </button>
        <h1 className="item-detail-page__title">单品详情</h1>
        <div className="item-detail-page__header-spacer"></div>
      </header>

      {/* 单品主图 */}
      <div className="item-detail-page__main-image">
        {itemDetail.image || itemDetail.imageUrl ? (
          <img 
            src={itemDetail.image || itemDetail.imageUrl} 
            alt={itemDetail.name}
            className="item-detail-page__image"
          />
        ) : (
          <div className="item-detail-page__image-placeholder">
            <span className="item-detail-page__image-icon">📷</span>
            <p className="item-detail-page__image-text">暂无图片</p>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="item-detail-page__content">
        {/* 基本信息 */}
        <div className="item-detail-page__basic-info">
          <h2 className="item-detail-page__name">{itemDetail.name}</h2>
          <div className="item-detail-page__tags">
            <span className="item-detail-page__tag">{itemDetail.category}</span>
            <span className="item-detail-page__tag">{itemDetail.color}</span>
            {itemDetail.material && (
              <span className="item-detail-page__tag">{itemDetail.material}</span>
            )}
            {itemDetail.brand && (
              <span className="item-detail-page__tag">{itemDetail.brand}</span>
            )}
          </div>
        </div>

        {/* 描述信息 */}
        {itemDetail.description && (
          <div className="item-detail-page__description">
            <h3 className="item-detail-page__section-title">单品描述</h3>
            <p className="item-detail-page__description-text">
              {itemDetail.description}
            </p>
          </div>
        )}

        {/* 搭配建议 */}
        {itemDetail.stylingTips && itemDetail.stylingTips.length > 0 && (
          <div className="item-detail-page__styling-tips">
            <h3 className="item-detail-page__section-title">搭配建议</h3>
            <ul className="item-detail-page__tips-list">
              {itemDetail.stylingTips.map((tip, index) => (
                <li key={index} className="item-detail-page__tip-item">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 衣橱状态 */}
        {!itemDetail.isInWardrobe && (
          <div className="item-detail-page__wardrobe-status">
            <div className="item-detail-page__status-info">
              <span className="item-detail-page__status-icon">ℹ️</span>
              <span className="item-detail-page__status-text">
                此单品尚未添加到您的衣橱中
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="item-detail-page__actions">
        {!itemDetail.isInWardrobe && (
          <button 
            className="item-detail-page__action-btn item-detail-page__action-btn--primary"
            onClick={handleAddToWardrobe}
            disabled={addingToWardrobe}
          >
            {addingToWardrobe ? '添加中...' : '添加到衣橱'}
          </button>
        )}
      </div>
    </div>
  );
};

export default WardrobeItemDetail;