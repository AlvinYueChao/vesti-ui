import React from 'react';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const navigationItems: NavigationItem[] = [
    { id: 'home', label: '首页', icon: 'home', path: '/home' },
    { id: 'wardrobe', label: '衣橱', icon: 'wardrobe', path: '/wardrobe' },
    { id: 'discover', label: '发现', icon: 'discover', path: '/discover' },
    { id: 'profile', label: '我的', icon: 'profile', path: '/profile' },
  ];

  return (
    <nav className="bottom-navigation">
      {navigationItems.map((item) => (
        <button
          key={item.id}
          className={`bottom-navigation__item ${
            activeTab === item.id ? 'bottom-navigation__item--active' : ''
          }`}
          onClick={() => onTabChange(item.id)}
        >
          <img src={`/assets/icons/navigation/${item.icon}.svg`} alt={item.label} className="bottom-navigation__icon" />
          <span className="bottom-navigation__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};