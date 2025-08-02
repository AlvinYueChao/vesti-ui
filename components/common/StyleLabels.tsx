import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface StyleTag {
  id: string;
  name: string;
}

interface StyleLabelsProps {
  title?: string;
  showBackButton?: boolean;
  showBottomButton?: boolean;
  bottomButtonText?: string;
  onComplete?: () => void;
  onBack?: () => void;
}

export const StyleLabels: React.FC<StyleLabelsProps> = ({
  title = '我的风格标签',
  showBackButton = true,
  showBottomButton = false,
  bottomButtonText = '保存',
  onComplete,
  onBack
}) => {
  const router = useRouter();
  const [step, setStep] = useState<'main' | 'add-tag'>('main');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<StyleTag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [editMode, setEditMode] = useState(false);

  const defaultStyleTags: StyleTag[] = [
    { id: 'simple', name: '简约' },
    { id: 'casual', name: '通勤' },
    { id: 'sweet', name: '甜美' },
    { id: 'formal', name: '法式' },
    { id: 'vintage', name: '复古' },
    { id: 'leisure', name: '休闲' },
    { id: 'literary', name: '文艺' },
    { id: 'street', name: '街头' },
    { id: 'elegant', name: '优雅' },
    { id: 'forest', name: '森系' },
    { id: 'intellectual', name: '知性' },
    { id: 'sporty', name: '运动' },
  ];

  const allTags = [...defaultStyleTags, ...customTags];

  useEffect(() => {
    // 加载已保存的标签数据
    const loadStyleLabels = () => {
      try {
        // 首先尝试从风格测试结果加载
        const styleTestPreferences = localStorage.getItem('user_style_preferences');
        if (styleTestPreferences) {
          const testData = JSON.parse(styleTestPreferences);
          if (testData.tags) {
            setSelectedTags(testData.tags);
          }
          if (testData.customTags) {
            setCustomTags(testData.customTags);
          }
        }

        // 然后尝试从用户偏好设置加载
        const userPreferences = localStorage.getItem('userPreferences');
        if (userPreferences) {
          const preferences = JSON.parse(userPreferences);
          if (preferences.styleLabels) {
            // 将字符串数组转换为ID数组
            const tagIds = preferences.styleLabels.map((name: string) => {
              const defaultTag = defaultStyleTags.find(tag => tag.name === name);
              return defaultTag ? defaultTag.id : `custom_${name}`;
            });
            setSelectedTags(tagIds);
          }
        }
      } catch (error) {
        console.error('Error loading style labels:', error);
      }
    };

    loadStyleLabels();
  }, []);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleBack = () => {
    if (step === 'add-tag') {
      setStep('main');
      setNewTagName('');
    } else if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleShowAddTag = () => {
    setStep('add-tag');
  };

  const handleSaveCustomTag = () => {
    if (newTagName.trim()) {
      const newTag: StyleTag = {
        id: `custom_${Date.now()}`,
        name: newTagName.trim()
      };
      setCustomTags(prev => [...prev, newTag]);
      setSelectedTags(prev => [...prev, newTag.id]);
      setNewTagName('');
      setStep('main');
    }
  };

  const handleCancelAddTag = () => {
    setNewTagName('');
    setStep('main');
  };

  const handleRemoveCustomTag = (tagId: string) => {
    setCustomTags(prev => prev.filter(tag => tag.id !== tagId));
    setSelectedTags(prev => prev.filter(id => id !== tagId));
  };

  const handleLongPress = (tagId: string) => {
    if (tagId.startsWith('custom_')) {
      setEditMode(true);
    }
  };

  const handleSave = () => {
    try {
      // 保存到风格测试结果
      const styleTestData = {
        tags: selectedTags,
        customTags: customTags
      };
      localStorage.setItem('user_style_preferences', JSON.stringify(styleTestData));

      // 保存到用户偏好设置
      const selectedTagNames = selectedTags.map(tagId => {
        const tag = allTags.find(t => t.id === tagId);
        return tag ? tag.name : tagId;
      });

      const userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
      userPreferences.styleLabels = selectedTagNames;
      localStorage.setItem('userPreferences', JSON.stringify(userPreferences));

      if (onComplete) {
        onComplete();
      } else {
        router.back();
      }
    } catch (error) {
      console.error('Error saving style labels:', error);
      alert('保存失败，请重试');
    }
  };

  // Add Tag Page
  if (step === 'add-tag') {
    return (
      <div className="style-labels" style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: '20px'
      }}>
        {/* Header */}
        <div className="style-labels__header" style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
          marginTop: '10px',
          height: '44px'
        }}>
          <button
            className="back-button"
            onClick={handleBack}
            style={{
              position: 'absolute',
              left: '0',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#F8F8F8',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src="/assets/icons/actions/chevron-left.svg"
              alt="返回"
              style={{ width: '16px', height: '16px' }}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const span = target.nextElementSibling as HTMLSpanElement;
                if (span) span.style.display = 'inline';
              }}
            />
            <span style={{ display: 'none', fontSize: '16px' }}>←</span>
          </button>
          <h1 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0',
            color: '#333'
          }}>
            添加标签
          </h1>
        </div>

        {/* Content */}
        <div className="add-tag__content" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            marginBottom: '30px'
          }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '500',
              color: '#333',
              marginBottom: '12px'
            }}>
              标签名称
            </label>
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="请输入标签名称"
              autoFocus
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#fff',
                boxSizing: 'border-box'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveCustomTag();
                }
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{
            marginTop: 'auto',
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={handleCancelAddTag}
              style={{
                flex: 1,
                padding: '16px',
                border: '1px solid #E5E5E5',
                borderRadius: '12px',
                backgroundColor: '#fff',
                color: '#666',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              取消
            </button>
            <button
              onClick={handleSaveCustomTag}
              disabled={!newTagName.trim()}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: newTagName.trim() ? '#FF6B6B' : '#E5E5E5',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: newTagName.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease'
              }}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="style-labels" style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      padding: '20px'
    }}>
      {/* Header */}
      <div className="style-labels__header" style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        marginTop: '10px',
        height: '44px',
        paddingBottom: '20px',
        borderBottom: '1px solid #E5E5E5'
      }}>
        {showBackButton && (
          <button
            className="back-button"
            onClick={handleBack}
            style={{
              position: 'absolute',
              left: '0',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#F8F8F8',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src="/assets/icons/actions/chevron-left.svg"
              alt="返回"
              style={{ width: '16px', height: '16px' }}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const span = target.nextElementSibling as HTMLSpanElement;
                if (span) span.style.display = 'inline';
              }}
            />
            <span style={{ display: 'none', fontSize: '16px' }}>←</span>
          </button>
        )}
        <h1 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: '0',
          color: '#333'
        }}>
          {title}
        </h1>
      </div>

      <div className="style-labels__subtitle" style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '500',
          margin: '0 0 6px 0',
          color: '#333'
        }}>
          选择你喜欢的风格（可多选）
        </h2>
        <p style={{
          fontSize: '13px',
          color: '#999',
          margin: '0'
        }}>
          这将帮助我们为你做更精准的推荐
        </p>
      </div>

      {/* Tags Grid */}
      <div className="style-labels__tags" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        marginBottom: '30px'
      }}>
        {allTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => !editMode && handleTagToggle(tag.id)}
            onMouseDown={() => {
              if (tag.id.startsWith('custom_')) {
                const timer = setTimeout(() => handleLongPress(tag.id), 500);
                const handleMouseUp = () => {
                  clearTimeout(timer);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                document.addEventListener('mouseup', handleMouseUp);
              }
            }}
            style={{
              position: 'relative',
              padding: '10px 6px',
              borderRadius: '6px',
              border: selectedTags.includes(tag.id) ? '1px solid #FF6B6B' : '1px solid #E5E5E5',
              backgroundColor: selectedTags.includes(tag.id) ? '#FFF5F5' : '#F8F8F8',
              color: selectedTags.includes(tag.id) ? '#FF6B6B' : '#666',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: selectedTags.includes(tag.id) ? '500' : '400'
            }}
          >
            {tag.name}
            {editMode && tag.id.startsWith('custom_') && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveCustomTag(tag.id);
                }}
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '4px',
                  fontSize: '12px',
                  color: '#FF6B6B',
                  cursor: 'pointer',
                  lineHeight: '1',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </span>
            )}
          </button>
        ))}

        {/* Add Custom Tag Button */}
        <button
          onClick={handleShowAddTag}
          style={{
            padding: '10px 6px',
            borderRadius: '6px',
            border: '1px dashed #E5E5E5',
            backgroundColor: 'transparent',
            color: '#999',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          +
        </button>
      </div>

      {/* Edit Mode Controls */}
      {editMode && (
        <div style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setEditMode(false)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#fff',
              color: '#666',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            完成
          </button>
        </div>
      )}

      {/* Footer */}
      {showBottomButton && (
        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              backgroundColor: '#FF6B6B',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {bottomButtonText}
          </button>
        </div>
      )}
    </div>
  );
};