import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const HelpFeedbackPage: React.FC = () => {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: '如何上传我的衣物？',
      answer: '您可以通过以下步骤上传衣物：\n1. 点击首页的"+"按钮\n2. 选择拍照或从相册选择\n3. 添加衣物信息和标签\n4. 点击保存完成上传'
    },
    {
      id: 2,
      question: 'AI如何进行推荐？',
      answer: 'AI推荐系统会根据以下因素为您推荐搭配：\n1. 您的衣物颜色和风格\n2. 当前天气和季节\n3. 您的穿搭偏好和历史记录\n4. 流行趋势和搭配规则'
    },
    {
      id: 3,
      question: '如何删除衣橱里的单品？',
      answer: '删除衣物的方法：\n1. 进入"我的衣橱"页面\n2. 长按要删除的衣物\n3. 选择"删除"选项\n4. 确认删除操作'
    }
  ];

  const handleFAQToggle = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      alert('请输入反馈内容');
      return;
    }

    // 模拟提交反馈
    setTimeout(() => {
      alert('反馈已收到，感谢您的支持！');
      setFeedbackText('');
      setUploadedImages([]);
    }, 500);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="help-feedback-page">
      {/* Header */}
      <div className="help-feedback-page__header">
        <button 
          className="back-button"
          onClick={() => router.back()}
        >
          <img src="/assets/icons/actions/chevron-left.svg" alt="返回" onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'inline';
          }} />
          <span style={{display: 'none'}}>←</span>
        </button>
        <h1 className="help-feedback-page__title">帮助与反馈</h1>
        <div className="help-feedback-page__spacer"></div>
      </div>

      <div className="help-feedback-page__container">
        {/* FAQ Section */}
        <div className="help-feedback-page__faq-section">
          <h2 className="help-feedback-page__section-title">常见问题 (FAQ)</h2>
          
          {faqData.map((item) => (
            <div key={item.id} className="help-feedback-page__faq-item">
              <button
                className="help-feedback-page__faq-question"
                onClick={() => handleFAQToggle(item.id)}
              >
                <span className="help-feedback-page__question-text">{item.question}</span>
                <span className={`help-feedback-page__arrow ${
                  expandedFAQ === item.id ? 'help-feedback-page__arrow--expanded' : ''
                }`}>
                  ▼
                </span>
              </button>
              
              {expandedFAQ === item.id && (
                <div className="help-feedback-page__faq-answer">
                  {item.answer.split('\n').map((line, index) => (
                    <p key={index} className="help-feedback-page__answer-line">{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feedback Section */}
        <div className="help-feedback-page__feedback-section">
          <h2 className="help-feedback-page__section-title">意见反馈</h2>
          
          <textarea
            className="help-feedback-page__textarea"
            placeholder="请描述您遇到的问题或宝贵建议..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          
          {/* Upload Section */}
          <div className="help-feedback-page__upload-area">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <label 
              htmlFor="image-upload" 
              className="help-feedback-page__upload-button"
            >
              +
            </label>
            <span className="help-feedback-page__upload-label">上传截图（选填）</span>
          </div>

          {/* Image Preview */}
          {uploadedImages.length > 0 && (
            <div className="help-feedback-page__images">
              {uploadedImages.map((image, index) => (
                <div key={index} className="help-feedback-page__image-wrapper">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`上传图片 ${index + 1}`}
                    className="help-feedback-page__image"
                  />
                  <button
                    className="help-feedback-page__remove-btn"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="help-feedback-page__submit-area">
        <button
          className="help-feedback-page__submit-button"
          onClick={handleSubmitFeedback}
        >
          提交反馈
        </button>
      </div>
    </div>
  );
};

export default HelpFeedbackPage;