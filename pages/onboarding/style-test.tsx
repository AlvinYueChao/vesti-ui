import React from 'react';
import { useRouter } from 'next/router';
import { StyleTest } from './StyleTest';

const StyleTestPage: React.FC = () => {
  const router = useRouter();

  const handleComplete = () => {
    console.log('Style test completed, navigating to home page...');
    // 风格测试完成后跳转到首页
    router.push('/home').then(() => {
      console.log('Navigation to /home successful');
    }).catch((error) => {
      console.error('Navigation to /home failed:', error);
    });
  };

  return <StyleTest onComplete={handleComplete} />;
};

export default StyleTestPage;