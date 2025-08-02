import React, { useState } from 'react';
import { StyleLabels } from '../../components/common/StyleLabels';

interface StyleTestProps {
  onComplete?: () => void;
}

type GenderType = 'female' | 'male' | null;

export const StyleTest: React.FC<StyleTestProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedGender, setSelectedGender] = useState<GenderType>(null);

  const handleGenderSelect = (gender: GenderType) => {
    setSelectedGender(gender);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleStyleLabelsComplete = () => {
    // 保存性别选择到localStorage
    try {
      const existingPreferences = JSON.parse(localStorage.getItem('user_style_preferences') || '{}');
      existingPreferences.gender = selectedGender;
      localStorage.setItem('user_style_preferences', JSON.stringify(existingPreferences));
    } catch (error) {
      console.error('Error saving gender preference:', error);
    }

    if (onComplete) {
      onComplete();
    }
  };

  if (step === 1) {
    return (
      <div className="style-test" style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: '20px'
      }}>
        {/* Header */}
        <div className="style-test__header" style={{
          textAlign: 'center',
          marginBottom: '40px',
          marginTop: '20px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 12px 0',
            color: '#333'
          }}>
            你想探索哪种风格？
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: '0',
            lineHeight: '1.4'
          }}>
            选择你偏好的穿搭类型，我们将为你个性化推荐
          </p>
        </div>

        {/* Content */}
        <div className="style-test__content" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Female Option */}
          <div
            onClick={() => handleGenderSelect('female')}
            style={{
              border: '2px solid #FF6B6B',
              borderRadius: '16px',
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#fff',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              color: '#FF6B6B'
            }}>
              👗
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: '#333'
            }}>
              女士穿搭
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: '0'
            }}>
              探索连衣裙、半裙、高跟鞋等风格
            </p>
          </div>

          {/* Male Option */}
          <div
            onClick={() => handleGenderSelect('male')}
            style={{
              border: '2px solid #E5E5E5',
              borderRadius: '16px',
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#fff',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              color: '#999'
            }}>
              👔
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: '#333'
            }}>
              男士穿搭
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: '0'
            }}>
              探索西装、衬衫、工装裤等风格
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <StyleLabels
        title="我的风格标签"
        showBackButton={true}
        showBottomButton={true}
        bottomButtonText="开启设计之旅"
        onComplete={handleStyleLabelsComplete}
        onBack={handleBack}
      />
    );
  }

  return null;
};