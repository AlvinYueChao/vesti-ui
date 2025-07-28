import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWardrobe } from '../../../hooks/useWardrobe';
import { ClothingCategory } from '../../../types';

interface AIAnalysisResult {
  category: ClothingCategory;
  colors: string[];
  tags: string[];
  name: string;
}

const categories = [
  { id: 'tops', label: '上装', color: '#FFB5B5' },
  { id: 'bottoms', label: '下装', color: '#B5E7FF' },
  { id: 'shoes', label: '鞋子', color: '#FFE5B5' },
  { id: 'accessories', label: '配饰', color: '#E5B5FF' },
  { id: 'outerwear', label: '外套', color: '#C5E1A5' }
];

const predefinedColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#AED6F1', '#D7BDE2',
  '#000000', '#FFFFFF', '#808080', '#8B4513', '#2F4F4F'
];

const AddItemEditPage: React.FC = () => {
  const router = useRouter();
  const { addItem } = useWardrobe('user-123');

  // 检查sessionStorage是否可用
  const isSessionStorageAvailable = () => {
    try {
      const test = '__test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>('tops');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [itemName, setItemName] = useState('');
  const [brand, setBrand] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log('Edit page useEffect triggered');
    let imageFound = false;
    
    // 首先尝试从sessionStorage获取图片数据
    if (isSessionStorageAvailable()) {
      console.log('SessionStorage is available');
      const storedImage = sessionStorage.getItem('uploadedImage');
      if (storedImage) {
        console.log('Found stored image, length:', storedImage.length);
        console.log('Image starts with:', storedImage.substring(0, 30));
        setUploadedImage(storedImage);
        imageFound = true;
      } else {
        console.log('No image found in sessionStorage');
        // 列出sessionStorage中的所有键
        console.log('SessionStorage keys:', Object.keys(sessionStorage));
      }
    } else {
      console.log('SessionStorage is not available');
    }
    
    // 如果sessionStorage中没有或不可用，尝试从URL参数获取（fallback）
    if (!imageFound) {
      const imageFromQuery = router.query.image as string;
      if (imageFromQuery) {
        console.log('Found image from query, length:', imageFromQuery.length);
        setUploadedImage(imageFromQuery);
        imageFound = true;
      } else {
        console.log('No image found in query parameters');
      }
    }
    
    if (!imageFound) {
      console.log('No image found in sessionStorage or query');
    }
    
    // 获取AI分析结果
    const aiResultStr = router.query.aiResult as string;
    if (aiResultStr) {
      console.log('Found AI result:', aiResultStr.substring(0, 100));
      try {
        const aiResult: AIAnalysisResult = JSON.parse(aiResultStr);
        setSelectedCategory(aiResult.category);
        setSelectedColors(aiResult.colors);
        setTags(aiResult.tags);
        setItemName(aiResult.name);
      } catch (error) {
        console.error('Failed to parse AI result:', error);
      }
    } else {
      console.log('No AI result found in query');
    }
  }, [router.query, router.isReady]);

  // 添加一个额外的effect来处理router准备就绪后的情况
  useEffect(() => {
    if (router.isReady && !uploadedImage) {
      console.log('Router is ready, checking for image again');
      
      if (isSessionStorageAvailable()) {
        const storedImage = sessionStorage.getItem('uploadedImage');
        if (storedImage) {
          console.log('Found stored image on router ready, length:', storedImage.length);
          setUploadedImage(storedImage);
        }
      }
    }
  }, [router.isReady, uploadedImage]);

  const handleCancel = () => {
    // 清理sessionStorage中的图片数据
    sessionStorage.removeItem('uploadedImage');
    router.back();
  };

  const handleSave = async () => {
    if (!itemName.trim()) {
      alert('请输入单品名称');
      return;
    }

    setSaving(true);
    try {
      await addItem({
        name: itemName,
        category: selectedCategory,
        color: selectedColors.join(', ') || '未知',
        brand: brand || undefined,
        image: uploadedImage,
        imageUrl: uploadedImage,
        tags: tags,
        addedDate: new Date()
      });

      // 清理sessionStorage中的图片数据
      sessionStorage.removeItem('uploadedImage');
      
      // 保存成功，返回衣橱页面
      router.push('/wardrobe');
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleCategorySelect = (category: ClothingCategory) => {
    setSelectedCategory(category);
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  return (
    <div className="add-item-edit-page">
      {/* 顶部导航栏 */}
      <header className="add-item-edit-page__header">
        <button className="add-item-edit-page__cancel-btn" onClick={handleCancel}>
          取消
        </button>
        <h1 className="add-item-edit-page__title">编辑单品信息</h1>
        <button 
          className="add-item-edit-page__save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </header>

      <div className="add-item-edit-page__content">
        {/* 单品预览图 */}
        <div className="add-item-edit-page__preview">
          {uploadedImage ? (
            <img 
              src={uploadedImage} 
              alt="单品预览" 
              className="add-item-edit-page__preview-image"
              onLoad={() => {
                console.log('Image loaded successfully');
              }}
              onError={(e) => {
                console.error('Image failed to load');
                console.error('Image src starts with:', uploadedImage.substring(0, 50));
                console.error('Image src length:', uploadedImage.length);
                // 如果图片加载失败，显示占位符
                e.currentTarget.style.display = 'none';
                const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                if (placeholder) {
                  placeholder.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div 
            className="add-item-edit-page__preview-placeholder"
            style={{ display: uploadedImage ? 'none' : 'flex' }}
          >
            <span>📷</span>
            <p>{uploadedImage ? '图片加载失败' : '暂无图片'}</p>
            {/* 调试信息 */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.7 }}>
                {uploadedImage && <div>图片数据长度: {uploadedImage.length}</div>}
                <button 
                  onClick={() => {
                    const stored = sessionStorage.getItem('uploadedImage');
                    console.log('Manual check - SessionStorage image:', stored ? `Found (${stored.length} chars)` : 'Not found');
                    console.log('Current uploadedImage state:', uploadedImage ? `Set (${uploadedImage.length} chars)` : 'Empty');
                    alert(`SessionStorage: ${stored ? 'Found' : 'Not found'}\nState: ${uploadedImage ? 'Set' : 'Empty'}`);
                  }}
                  style={{ 
                    padding: '0.25rem 0.5rem', 
                    fontSize: '0.7rem', 
                    marginTop: '0.25rem',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                  }}
                >
                  检查存储状态
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 信息编辑区 */}
        <div className="add-item-edit-page__form">
          {/* 单品名称 */}
          <div className="add-item-edit-page__field">
            <label className="add-item-edit-page__label">单品名称</label>
            <input
              type="text"
              className="add-item-edit-page__input"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="请输入单品名称"
            />
          </div>

          {/* 品牌 */}
          <div className="add-item-edit-page__field">
            <label className="add-item-edit-page__label">品牌（可选）</label>
            <input
              type="text"
              className="add-item-edit-page__input"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="请输入品牌名称"
            />
          </div>

          {/* 分类 */}
          <div className="add-item-edit-page__field">
            <label className="add-item-edit-page__label">分类</label>
            <div className="add-item-edit-page__category-chips">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`add-item-edit-page__category-chip ${
                    selectedCategory === category.id ? 'active' : ''
                  }`}
                  onClick={() => handleCategorySelect(category.id as ClothingCategory)}
                  style={{
                    backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                    borderColor: category.color
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* 颜色 */}
          <div className="add-item-edit-page__field">
            <label className="add-item-edit-page__label">颜色</label>
            <div className="add-item-edit-page__color-palette">
              {predefinedColors.map(color => (
                <button
                  key={color}
                  className={`add-item-edit-page__color-dot ${
                    selectedColors.includes(color) ? 'selected' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorToggle(color)}
                />
              ))}
            </div>
          </div>

          {/* 风格标签 */}
          <div className="add-item-edit-page__field">
            <label className="add-item-edit-page__label">风格标签</label>
            <div className="add-item-edit-page__tags">
              {tags.map(tag => (
                <span key={tag} className="add-item-edit-page__tag">
                  {tag}
                  <button
                    className="add-item-edit-page__tag-remove"
                    onClick={() => handleTagRemove(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="add-item-edit-page__tag-input-container">
              <input
                type="text"
                className="add-item-edit-page__tag-input"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="+ 添加标签"
              />
              {newTag.trim() && (
                <button
                  className="add-item-edit-page__tag-add-btn"
                  onClick={handleTagAdd}
                >
                  添加
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemEditPage;