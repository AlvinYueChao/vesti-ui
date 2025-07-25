import React from 'react';

interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
}

export const ContentSection: React.FC<ContentSectionProps> = ({ title, children }) => {
  return (
    <section className="content-section">
      <h2 className="content-section__title">{title}</h2>
      <div className="content-section__content">
        {children}
      </div>
    </section>
  );
};