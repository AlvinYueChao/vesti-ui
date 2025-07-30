// 衣橱增强功能演示页面
import React, { useState } from 'react';
import { ClothingItem } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { useOutfitValidation } from '../../hooks/useOutfitValidation';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { OutfitValidationAlert } from '../../components/outfit/OutfitValidationAlert';

const WardrobeEnhancementsDemo: React.FC = () => {
  const { t, tCategory, tColor, tMaterial, locale } = useTranslation();
  const { validationResult, validateOutfit, isValidating } = useOutfitValidation();

  // 示例单品数据
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);

  const sampleItems: ClothingItem[] = [
    {
      id: '1',
      name: '白色衬衫',
      category: 'tops',
      color: 'white',
      material: 'cotton',
      brand: 'uniqlo',
      image: '/assets/images/white-shirt.jpg',
      imageUrl: '/assets/images/white-shirt.jpg',
      tags: ['商务', '基础款'],
      addedDate: new Date()
    },
    {
      id: '2',
      name: '黑色西装裤',
      category: 'bottoms',
      color: 'black',
      material: 'wool',
      brand: 'zara',
      image: '/assets/images/black-pants.jpg',
      imageUrl: '/assets/images/black-pants.jpg',
      tags: ['正式', '商务'],
      addedDate: new Date()
    },
    {
      id: '3',
      name: '碎花连衣裙',
      category: 'dresses',
      color: 'blue',
      material: 'chiffon',
      brand: 'hm',
      image: '/assets/images/floral-dress.jpg',
      imageUrl: '/assets/images/floral-dress.jpg',
      tags: ['甜美', '约会'],
      addedDate: new Date()
    },
    {
      id: '4',
      name: '黑色皮鞋',
      category: 'shoes',
      color: 'black',
      material: 'leather',
      brand: 'nike',
      image: '/assets/images/black-shoes.jpg',
      imageUrl: '/assets/images/black-shoes.jpg',
      tags: ['正式', '商务'],
      addedDate: new Date()
    },
    {
      id: '5',
      name: '丝巾',
      category: 'accessories',
      color: 'red',
      material: 'silk',
      image: '/assets/images/silk-scarf.jpg',
      imageUrl: '/assets/images/silk-scarf.jpg',
      tags: ['优雅', '配饰'],
      addedDate: new Date()
    }
  ];

  const handleItemToggle = (item: ClothingItem) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);
    if (isSelected) {
      setSelectedItems(prev => prev.filter(selected => selected.id !== item.id));
    } else {
      setSelectedItems(prev => [...prev, item]);
    }
  };

  const handleValidateOutfit = () => {
    validateOutfit(selectedItems);
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  return (
    <div className="wardrobe-enhancements-demo">
      <header className="demo-header">
        <h1>衣橱增强功能演示</h1>
        <LanguageSwitcher className="demo-language-switcher" />
      </header>

      <div className="demo-content">
        {/* 功能介绍 */}
        <section className="demo-section">
          <h2>新增功能</h2>
          <ul>
            <li>✅ 添加"连衣裙"单品类型</li>
            <li>✅ 穿搭必要性验证（上装+下装 或 连衣裙 + 鞋子）</li>
            <li>✅ 国际化支持（中文/英文切换）</li>
          </ul>
        </section>

        {/* 国际化演示 */}
        <section className="demo-section">
          <h2>国际化演示</h2>
          <p>当前语言: {locale}</p>
          <div className="translation-examples">
            <div className="translation-row">
              <span>类型翻译:</span>
              <span>{tCategory('tops')} | {tCategory('bottoms')} | {tCategory('dresses')} | {tCategory('shoes')}</span>
            </div>
            <div className="translation-row">
              <span>颜色翻译:</span>
              <span>{tColor('red')} | {tColor('blue')} | {tColor('black')} | {tColor('white')}</span>
            </div>
            <div className="translation-row">
              <span>材质翻译:</span>
              <span>{tMaterial('cotton')} | {tMaterial('silk')} | {tMaterial('wool')}</span>
            </div>
          </div>
        </section>

        {/* 单品选择 */}
        <section className="demo-section">
          <h2>选择单品组合穿搭</h2>
          <div className="items-grid">
            {sampleItems.map(item => (
              <div
                key={item.id}
                className={`item-card ${selectedItems.some(selected => selected.id === item.id) ? 'selected' : ''}`}
                onClick={() => handleItemToggle(item)}
              >
                <div className="item-image-placeholder">
                  <span className="item-category-icon">
                    {item.category === 'tops' && '👔'}
                    {item.category === 'bottoms' && '👖'}
                    {item.category === 'dresses' && '👗'}
                    {item.category === 'shoes' && '👞'}
                    {item.category === 'accessories' && '🧣'}
                  </span>
                </div>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>{tCategory(item.category)} | {tColor(item.color)}</p>
                  <p>{tMaterial(item.material || '')} | {item.brand?.toUpperCase()}</p>
                </div>
                {selectedItems.some(selected => selected.id === item.id) && (
                  <div className="item-selected-indicator">✓</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 已选择的单品 */}
        <section className="demo-section">
          <h2>已选择的单品 ({selectedItems.length})</h2>
          {selectedItems.length > 0 ? (
            <div className="selected-items">
              {selectedItems.map(item => (
                <span key={item.id} className="selected-item-tag">
                  {item.name} ({tCategory(item.category)})
                </span>
              ))}
            </div>
          ) : (
            <p>请选择单品来组成穿搭</p>
          )}
        </section>

        {/* 验证控制 */}
        <section className="demo-section">
          <h2>穿搭验证</h2>
          <div className="validation-controls">
            <button 
              onClick={handleValidateOutfit}
              disabled={selectedItems.length === 0 || isValidating}
              className="validate-btn"
            >
              {isValidating ? '验证中...' : '验证穿搭'}
            </button>
            <button 
              onClick={clearSelection}
              className="clear-btn"
            >
              清空选择
            </button>
          </div>

          {/* 验证结果 */}
          {validationResult && (
            <OutfitValidationAlert 
              validationResult={validationResult}
              className="demo-validation-result"
            />
          )}
        </section>

        {/* 验证规则说明 */}
        <section className="demo-section">
          <h2>验证规则说明</h2>
          <div className="validation-rules">
            <h3>必要性规则：</h3>
            <ul>
              <li>必须包含 <strong>上装+下装</strong> 或 <strong>连衣裙</strong>（二选一）</li>
              <li>必须包含 <strong>鞋子</strong></li>
              <li>配饰是可选的</li>
            </ul>
            <h3>限制规则：</h3>
            <ul>
              <li>连衣裙不能与下装同时存在</li>
              <li>一套穿搭只能包含一条连衣裙</li>
            </ul>
          </div>
        </section>

        {/* 测试用例 */}
        <section className="demo-section">
          <h2>快速测试</h2>
          <div className="quick-tests">
            <button 
              onClick={() => setSelectedItems([sampleItems[0], sampleItems[1], sampleItems[3]])}
              className="test-btn"
            >
              测试：上装+下装+鞋子 ✅
            </button>
            <button 
              onClick={() => setSelectedItems([sampleItems[2], sampleItems[3]])}
              className="test-btn"
            >
              测试：连衣裙+鞋子 ✅
            </button>
            <button 
              onClick={() => setSelectedItems([sampleItems[0], sampleItems[1]])}
              className="test-btn"
            >
              测试：缺少鞋子 ❌
            </button>
            <button 
              onClick={() => setSelectedItems([sampleItems[2], sampleItems[1], sampleItems[3]])}
              className="test-btn"
            >
              测试：连衣裙+下装 ❌
            </button>
          </div>
        </section>
      </div>

      <style jsx>{`
        .wardrobe-enhancements-demo {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .demo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #eee;
        }

        .demo-section {
          margin-bottom: 40px;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .demo-section h2 {
          margin-top: 0;
          color: #333;
        }

        .translation-examples {
          background: white;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #007bff;
        }

        .translation-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .translation-row span:first-child {
          font-weight: bold;
          color: #666;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .item-card {
          background: white;
          border: 2px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .item-card:hover {
          border-color: #007bff;
          transform: translateY(-2px);
        }

        .item-card.selected {
          border-color: #28a745;
          background: #f8fff9;
        }

        .item-image-placeholder {
          width: 60px;
          height: 60px;
          background: #f0f0f0;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }

        .item-category-icon {
          font-size: 24px;
        }

        .item-info h4 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .item-info p {
          margin: 2px 0;
          color: #666;
          font-size: 14px;
        }

        .item-selected-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #28a745;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .selected-items {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .selected-item-tag {
          background: #007bff;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
        }

        .validation-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .validate-btn, .clear-btn, .test-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .validate-btn {
          background: #007bff;
          color: white;
        }

        .validate-btn:hover:not(:disabled) {
          background: #0056b3;
        }

        .validate-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .clear-btn {
          background: #6c757d;
          color: white;
        }

        .clear-btn:hover {
          background: #545b62;
        }

        .validation-rules {
          background: white;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #28a745;
        }

        .validation-rules h3 {
          margin-top: 0;
          color: #333;
        }

        .validation-rules ul {
          margin-bottom: 15px;
        }

        .validation-rules li {
          margin-bottom: 5px;
        }

        .quick-tests {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .test-btn {
          background: #17a2b8;
          color: white;
          font-size: 13px;
        }

        .test-btn:hover {
          background: #138496;
        }

        .demo-validation-result {
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};

export default WardrobeEnhancementsDemo;