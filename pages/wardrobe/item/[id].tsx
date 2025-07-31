import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWardrobe } from '../../../hooks/useWardrobe';
import { useOutfitDiary } from '../../../hooks/useOutfitDiary';
import { ClothingItem } from '../../../types';
import { extractColorFromItem } from '../../../utils/colorUtils';

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
  const [removingFromWardrobe, setRemovingFromWardrobe] = useState(false);
  
  const { items: wardrobeItems, addItem: addToWardrobe, removeItem: removeFromWardrobe, loading: wardrobeLoading } = useWardrobe('user-123');
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

    // 首先在衣橱中查找（通过ID匹配）
    const wardrobeItem = wardrobeItems.find(item => item.id === id);
    
    if (wardrobeItem) {
      const naturalColor = extractColorFromItem(wardrobeItem.name, wardrobeItem.color);
      setItemDetail({
        ...wardrobeItem,
        description: `这是一件${naturalColor}的${wardrobeItem.name}，来自${wardrobeItem.brand || '未知品牌'}。`,
        material: getItemMaterial(wardrobeItem.category),
        stylingTips: getItemStylingTips(wardrobeItem.category, naturalColor),
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
      // 检查是否已经通过名称、颜色、品牌等属性在衣橱中存在相同单品
      const matchingWardrobeItem = wardrobeItems.find(item => 
        item.name === outfitItem!.name && 
        item.color === outfitItem!.color && 
        item.category === outfitItem!.category &&
        item.brand === outfitItem!.brand
      );

      const naturalColor = extractColorFromItem(outfitItem.name, outfitItem.color);
      setItemDetail({
        ...outfitItem,
        description: `这是一件${naturalColor}的${outfitItem.name}，推荐用于搭配。`,
        material: outfitItem.material || getItemMaterial(outfitItem.category),
        stylingTips: getItemStylingTips(outfitItem.category, naturalColor),
        isInWardrobe: !!matchingWardrobeItem
      });
    }
    
    setLoading(false);
  }, [id, wardrobeItems, records, wardrobeLoading, diaryLoading]);

  // 监听衣橱变化，实时更新单品的衣橱状态
  useEffect(() => {
    if (itemDetail) {
      // 通过ID或属性匹配检查是否在衣橱中
      const isNowInWardrobe = wardrobeItems.some(item => 
        item.id === itemDetail.id || 
        (item.name === itemDetail.name && 
         item.color === itemDetail.color && 
         item.category === itemDetail.category &&
         item.brand === itemDetail.brand)
      );
      
      if (isNowInWardrobe !== itemDetail.isInWardrobe) {
        setItemDetail(prev => prev ? { ...prev, isInWardrobe: isNowInWardrobe } : null);
      }
    }
  }, [wardrobeItems, itemDetail?.id, itemDetail?.name, itemDetail?.color, itemDetail?.category, itemDetail?.brand]);

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
      // 黑色系
      '纯黑色': '经典百搭，可以与任何颜色组合',
      '黑色': '经典百搭，可以与任何颜色组合',
      '深灰黑': '低调沉稳，适合正式场合',
      
      // 白色系
      '纯白色': '清爽干净，适合春夏季节',
      '白色': '清爽干净，适合春夏季节',
      '米白色': '温和柔软，比纯白更温暖',
      '米色': '自然舒适，容易搭配',
      
      // 蓝色系
      '正蓝色': '沉稳可靠，商务休闲皆宜',
      '蓝色': '沉稳可靠，商务休闲皆宜',
      '天蓝色': '清新活力，适合春夏搭配',
      '海军蓝': '经典正式，适合商务场合',
      '午夜蓝': '深邃优雅，适合晚装',
      
      // 红色系
      '正红色': '热情活力，适合作为亮点色',
      '红色': '热情活力，适合作为亮点色',
      '珊瑚红': '温暖活泼，适合春夏季节',
      '深红色': '成熟稳重，适合秋冬搭配',
      
      // 灰色系
      '中灰色': '低调优雅，容易搭配',
      '灰色': '低调优雅，容易搭配',
      '浅灰色': '温和中性，适合日常搭配',
      '深灰色': '沉稳大气，适合正式场合',
      
      // 绿色系
      '正绿色': '自然清新，适合休闲搭配',
      '绿色': '自然清新，适合休闲搭配',
      '草绿色': '活力青春，适合春夏季节',
      '森林绿': '沉稳自然，适合秋冬搭配',
      
      // 黄色系
      '金黄色': '明亮温暖，适合作为点缀色',
      '黄色': '明亮温暖，适合作为点缀色',
      '柠檬黄': '清新活泼，适合春夏搭配',
      
      // 紫色系
      '紫色': '神秘优雅，适合晚装或特殊场合',
      '紫罗兰': '浪漫优雅，适合约会搭配',
      '薰衣草色': '温柔浪漫，适合春夏季节',
      
      // 棕色系
      '棕色': '温暖自然，适合秋冬搭配',
      '深棕色': '成熟稳重，适合正式场合',
      '茶色': '温和自然，容易搭配',
      '驼色': '经典优雅，适合秋冬外套'
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
      // 检查是否已经存在相同的单品（通过属性匹配）
      const existingItem = wardrobeItems.find(item => 
        item.name === itemDetail.name && 
        item.color === itemDetail.color && 
        item.category === itemDetail.category &&
        item.brand === itemDetail.brand
      );

      if (existingItem) {
        // 如果已经存在，直接更新状态
        setItemDetail(prev => prev ? { ...prev, isInWardrobe: true } : null);
        alert('该单品已在您的衣橱中！');
        return;
      }

      // 准备添加到衣橱的单品数据
      const itemToAdd = {
        name: itemDetail.name,
        category: itemDetail.category,
        color: itemDetail.color,
        brand: itemDetail.brand,
        material: itemDetail.material,
        image: itemDetail.image || itemDetail.imageUrl || '',
        imageUrl: itemDetail.image || itemDetail.imageUrl || '',
        tags: itemDetail.tags || [],
        addedDate: new Date()
      };
      
      await addToWardrobe(itemToAdd);
      
      // 立即更新状态
      setItemDetail(prev => prev ? { 
        ...prev, 
        isInWardrobe: true
      } : null);
      
      alert('已成功添加到衣橱！');
    } catch (error) {
      console.error('添加到衣橱失败:', error);
      alert('添加失败，请重试');
    } finally {
      setAddingToWardrobe(false);
    }
  };

  const handleRemoveFromWardrobe = async () => {
    if (!itemDetail || !itemDetail.isInWardrobe) return;
    
    // 确认删除
    const confirmMessage = `确定要从衣橱中删除"${itemDetail.name}"吗？\n\n删除后将无法恢复。`;
    if (!confirm(confirmMessage)) {
      return;
    }
    
    setRemovingFromWardrobe(true);
    try {
      // 找到衣橱中对应的单品ID
      const wardrobeItem = wardrobeItems.find(item => 
        item.id === itemDetail.id || 
        (item.name === itemDetail.name && 
         item.color === itemDetail.color && 
         item.category === itemDetail.category &&
         item.brand === itemDetail.brand)
      );

      if (!wardrobeItem) {
        alert('未找到要删除的单品');
        return;
      }

      await removeFromWardrobe(wardrobeItem.id);
      
      // 立即更新状态
      setItemDetail(prev => prev ? { 
        ...prev, 
        isInWardrobe: false
      } : null);
      
      alert('已成功从衣橱中删除！');
    } catch (error) {
      console.error('从衣橱删除失败:', error);
      alert('删除失败，请重试');
    } finally {
      setRemovingFromWardrobe(false);
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
            {/* 如果是外套类型的上装，显示外套标签 */}
            {itemDetail.category === 'tops' && itemDetail.subType === 'outerwear' && (
              <span className="item-detail-page__tag item-detail-page__tag--outerwear">外套</span>
            )}
            {/* 使用自然语言显示颜色 */}
            <span className="item-detail-page__tag">
              {extractColorFromItem(itemDetail.name, itemDetail.color)}
            </span>
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
        {!itemDetail.isInWardrobe ? (
          <button 
            className="item-detail-page__action-btn item-detail-page__action-btn--primary"
            onClick={handleAddToWardrobe}
            disabled={addingToWardrobe}
          >
            {addingToWardrobe ? '添加中...' : '添加到衣橱'}
          </button>
        ) : (
          <button 
            className="item-detail-page__action-btn item-detail-page__action-btn--danger"
            onClick={handleRemoveFromWardrobe}
            disabled={removingFromWardrobe}
          >
            {removingFromWardrobe ? '删除中...' : '从衣橱删除'}
          </button>
        )}
      </div>
    </div>
  );
};

export default WardrobeItemDetail;