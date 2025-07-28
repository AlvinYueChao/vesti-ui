import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AddItemUploadPage: React.FC = () => {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(true);

  useEffect(() => {
    // 模拟从相册选择或拍照后的图片上传
    const imageData = router.query.image as string;
    if (imageData) {
      setUploadedImage(imageData);
      setShowPicker(false);
      startProcessing();
    }
    // 如果没有图片数据，默认显示选择界面（showPicker初始值为true）
  }, [router.query]);

  const showImagePicker = () => {
    setShowPicker(true);
  };

  const handleImageSelect = (useCamera: boolean) => {
    setShowPicker(false);
    
    // 创建文件输入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (useCamera) {
      input.capture = 'environment'; // 优先使用后置摄像头
    }
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          console.log('Image loaded, length:', imageData.length);
          setUploadedImage(imageData);
          startProcessing(imageData); // 直接传递图片数据
        };
        reader.readAsDataURL(file);
      } else {
        // 用户取消了选择，重新显示选择界面
        setShowPicker(true);
      }
    };
    
    input.click();
  };

  const startProcessing = (imageData?: string) => {
    setProcessing(true);
    
    // 使用传入的imageData或当前的uploadedImage状态
    const currentImage = imageData || uploadedImage;
    
    // 模拟AI处理过程，3秒后跳转到编辑页面
    setTimeout(() => {
      // 生成随机的AI分析结果
      const mockResults = [
        {
          category: 'tops',
          colors: ['#4A90E2', '#FFFFFF'],
          tags: ['休闲', '通勤'],
          name: '蓝色衬衫'
        },
        {
          category: 'bottoms',
          colors: ['#2F4F4F', '#000000'],
          tags: ['正式', '商务'],
          name: '深色西装裤'
        },
        {
          category: 'shoes',
          colors: ['#8B4513', '#FFFFFF'],
          tags: ['休闲', '运动'],
          name: '棕色休闲鞋'
        },
        {
          category: 'accessories',
          colors: ['#FFD700', '#000000'],
          tags: ['优雅', '配饰'],
          name: '金色手表'
        }
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      // 将图片数据存储到sessionStorage中，避免URL长度限制
      if (currentImage) {
        console.log('Storing image to sessionStorage, length:', currentImage.length);
        try {
          sessionStorage.setItem('uploadedImage', currentImage);
          
          // 验证存储是否成功
          const verifyStored = sessionStorage.getItem('uploadedImage');
          if (verifyStored && verifyStored.length === currentImage.length) {
            console.log('Image stored and verified successfully in sessionStorage');
          } else {
            console.error('Image storage verification failed');
          }
        } catch (error) {
          console.error('Failed to store image in sessionStorage:', error);
          // 如果sessionStorage失败，通过URL参数传递（可能会有长度限制）
          console.log('Falling back to URL parameter');
        }
      } else {
        console.error('No image data available to store');
      }
      
      router.push({
        pathname: '/wardrobe/add/edit',
        query: {
          aiResult: JSON.stringify(randomResult)
        }
      });
    }, 3000);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="add-item-upload-page">
      {/* 顶部导航栏 */}
      <header className="add-item-upload-page__header">
        <button className="add-item-upload-page__cancel-btn" onClick={handleCancel}>
          ✕
        </button>
        <h1 className="add-item-upload-page__title">添加新单品</h1>
        <div className="add-item-upload-page__header-spacer"></div>
      </header>

      {/* 内容区域 */}
      <div className="add-item-upload-page__content">
        {showPicker ? (
          /* 图片选择界面 */
          <div className="add-item-upload-page__picker">
            <div className="add-item-upload-page__picker-icon">📷</div>
            <h2 className="add-item-upload-page__picker-title">选择添加方式</h2>
            <p className="add-item-upload-page__picker-subtitle">
              拍摄或选择您要添加的单品照片
            </p>
            <div className="add-item-upload-page__picker-buttons">
              <button 
                className="add-item-upload-page__picker-btn add-item-upload-page__picker-btn--camera"
                onClick={() => handleImageSelect(true)}
              >
                📸 拍照
              </button>
              <button 
                className="add-item-upload-page__picker-btn add-item-upload-page__picker-btn--gallery"
                onClick={() => handleImageSelect(false)}
              >
                🖼️ 从相册选择
              </button>
            </div>
          </div>
        ) : (
          /* 处理中界面 */
          <>
            <div className="add-item-upload-page__animation-container">
              {/* 衣物轮廓 */}
              <div className="add-item-upload-page__item-silhouette">
                <div className="add-item-upload-page__item-shape"></div>
                {/* 扫描线动效 */}
                <div className="add-item-upload-page__scan-line"></div>
              </div>
            </div>

            {/* 状态文案 */}
            <div className="add-item-upload-page__status">
              <h2 className="add-item-upload-page__main-title">
                AI设计师正在分析您的单品...
              </h2>
              <p className="add-item-upload-page__sub-title">
                正在进行背景移除、品类识别、色彩分析
              </p>
            </div>

            {/* 进度指示器 */}
            <div className="add-item-upload-page__progress">
              <div className="add-item-upload-page__progress-bar">
                <div className="add-item-upload-page__progress-fill"></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddItemUploadPage;