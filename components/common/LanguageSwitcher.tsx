// 语言切换组件
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { SupportedLocale } from '../../services/translationService';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { locale, changeLocale, getSupportedLocales } = useTranslation();

  const localeNames: Record<SupportedLocale, string> = {
    'zh-CN': '中文',
    'en-US': 'English'
  };

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    changeLocale(newLocale);
  };

  return (
    <div className={`language-switcher ${className}`}>
      <select 
        value={locale} 
        onChange={(e) => handleLocaleChange(e.target.value as SupportedLocale)}
        className="language-switcher__select"
      >
        {getSupportedLocales().map(supportedLocale => (
          <option key={supportedLocale} value={supportedLocale}>
            {localeNames[supportedLocale]}
          </option>
        ))}
      </select>
      
      <style jsx>{`
        .language-switcher {
          display: inline-block;
        }
        
        .language-switcher__select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          font-size: 14px;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s;
        }
        
        .language-switcher__select:hover {
          border-color: #007bff;
        }
        
        .language-switcher__select:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
      `}</style>
    </div>
  );
};