// 穿搭验证提示组件
import React from 'react';
import { OutfitValidationResult } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface OutfitValidationAlertProps {
  validationResult: OutfitValidationResult;
  className?: string;
}

export const OutfitValidationAlert: React.FC<OutfitValidationAlertProps> = ({ 
  validationResult, 
  className = '' 
}) => {
  const { t } = useTranslation();

  if (validationResult.isValid) {
    return (
      <div className={`outfit-validation-alert outfit-validation-alert--success ${className}`}>
        <span className="outfit-validation-alert__icon">✅</span>
        <span className="outfit-validation-alert__message">
          {t('validation.outfit_complete', '穿搭完整')}
        </span>
        
        <style jsx>{`
          .outfit-validation-alert {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            border-radius: 6px;
            margin: 10px 0;
          }
          
          .outfit-validation-alert--success {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
          }
          
          .outfit-validation-alert__icon {
            margin-right: 8px;
            font-size: 16px;
          }
          
          .outfit-validation-alert__message {
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`outfit-validation-alert outfit-validation-alert--error ${className}`}>
      <span className="outfit-validation-alert__icon">⚠️</span>
      <div className="outfit-validation-alert__content">
        <div className="outfit-validation-alert__title">
          {t('validation.outfit_incomplete', '穿搭不完整')}
        </div>
        <ul className="outfit-validation-alert__errors">
          {validationResult.errors.map((error, index) => (
            <li key={index} className="outfit-validation-alert__error">
              {error.message}
            </li>
          ))}
        </ul>
        {validationResult.warnings && validationResult.warnings.length > 0 && (
          <ul className="outfit-validation-alert__warnings">
            {validationResult.warnings.map((warning, index) => (
              <li key={index} className="outfit-validation-alert__warning">
                {warning.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <style jsx>{`
        .outfit-validation-alert {
          display: flex;
          align-items: flex-start;
          padding: 12px 16px;
          border-radius: 6px;
          margin: 10px 0;
        }
        
        .outfit-validation-alert--error {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }
        
        .outfit-validation-alert__icon {
          margin-right: 8px;
          font-size: 16px;
          margin-top: 2px;
        }
        
        .outfit-validation-alert__content {
          flex: 1;
        }
        
        .outfit-validation-alert__title {
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .outfit-validation-alert__errors,
        .outfit-validation-alert__warnings {
          margin: 0;
          padding-left: 20px;
        }
        
        .outfit-validation-alert__errors {
          margin-bottom: 8px;
        }
        
        .outfit-validation-alert__error,
        .outfit-validation-alert__warning {
          margin-bottom: 4px;
        }
        
        .outfit-validation-alert__warning {
          color: #856404;
        }
      `}</style>
    </div>
  );
};