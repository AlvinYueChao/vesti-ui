import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { BottomNavigation } from '../../components/common/BottomNavigation';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  onClick: () => void;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  // 核心功能菜单项
  const coreMenuItems: MenuItem[] = [
    {
      id: 'outfit-diary',
      title: '穿搭日记',
      icon: '📅',
      color: '#FF6B6B',
      onClick: () => {
        router.push('/outfit-diary');
      }
    },
    {
      id: 'my-favorites',
      title: '我的收藏',
      icon: '🔖',
      color: '#4ECDC4',
      onClick: () => {
        router.push('/profile/favorites');
      }
    }
  ];

  // 设置菜单项
  const settingsMenuItems: MenuItem[] = [
    {
      id: 'preferences',
      title: '偏好设置',
      icon: '⚙️',
      color: '#45B7D1',
      onClick: () => {
        // TODO: 跳转到偏好设置页面
        console.log('Navigate to preferences');
      }
    },
    {
      id: 'help-feedback',
      title: '帮助与反馈',
      icon: '❓',
      color: '#96CEB4',
      onClick: () => {
        // TODO: 跳转到帮助与反馈页面
        console.log('Navigate to help & feedback');
      }
    }
  ];

  const handleProfileEdit = () => {
    // TODO: 跳转到个人资料编辑页面
    console.log('Navigate to profile edit');
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    // Navigate to different pages based on tab selection
    switch (tabId) {
      case 'home':
        router.push('/home');
        break;
      case 'wardrobe':
        router.push('/wardrobe');
        break;
      case 'discover':
        router.push('/discover');
        break;
      case 'profile':
        router.push('/profile');
        break;
      default:
        break;
    }
  };

  return (
    <div className="profile-page">
      {/* 用户信息区 */}
      <div className="profile-page__header">
        <div className="profile-page__user-info" onClick={handleProfileEdit}>
          <div className="profile-page__avatar">
            <span className="profile-page__avatar-placeholder">👤</span>
          </div>
          <div className="profile-page__user-details">
            <h2 className="profile-page__username">Vesti 用户</h2>
            <p className="profile-page__stats">衣橱共有 82 件单品</p>
          </div>
        </div>
      </div>

      {/* 核心功能入口 */}
      <div className="profile-page__section">
        <div className="profile-page__menu-list">
          {coreMenuItems.map((item) => (
            <div
              key={item.id}
              className="profile-page__menu-item"
              onClick={item.onClick}
            >
              <div className="profile-page__menu-icon" style={{ backgroundColor: item.color }}>
                <span>{item.icon}</span>
              </div>
              <span className="profile-page__menu-title">{item.title}</span>
              <span className="profile-page__menu-arrow">›</span>
            </div>
          ))}
        </div>
      </div>

      {/* 应用设置入口 */}
      <div className="profile-page__section">
        <div className="profile-page__menu-list">
          {settingsMenuItems.map((item) => (
            <div
              key={item.id}
              className="profile-page__menu-item"
              onClick={item.onClick}
            >
              <div className="profile-page__menu-icon" style={{ backgroundColor: item.color }}>
                <span>{item.icon}</span>
              </div>
              <span className="profile-page__menu-title">{item.title}</span>
              <span className="profile-page__menu-arrow">›</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default ProfilePage;