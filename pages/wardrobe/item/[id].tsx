import React from 'react';
import { useRouter } from 'next/router';

const WardrobeItemDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const handleBack = () => {
    router.back();
  };

  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <button 
        onClick={handleBack}
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          padding: '0.5rem'
        }}
      >
        ‹ 返回
      </button>
      
      <h1 style={{ color: '#333', marginBottom: '1rem' }}>衣橱单品详情</h1>
      <p style={{ color: '#666', fontSize: '1.125rem' }}>单品 ID: {id}</p>
      <p style={{ color: '#999', marginTop: '2rem' }}>
        这里将显示单品的详细信息，包括图片、描述、搭配建议等。
      </p>
    </div>
  );
};

export default WardrobeItemDetail;