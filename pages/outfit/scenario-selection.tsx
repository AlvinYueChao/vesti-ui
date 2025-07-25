import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ScenarioOption } from '../../types';

const ScenarioSelectionPage: React.FC = () => {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const scenarios: ScenarioOption[] = [
    {
      id: 'work-commute',
      name: '上班通勤',
      description: '专业舒适的日常工作装',
      icon: '💼',
      tags: ['正式', '舒适', '专业']
    },
    {
      id: 'weekend-date',
      name: '周末约会',
      description: '浪漫优雅的约会造型',
      icon: '💕',
      tags: ['浪漫', '优雅', '时尚']
    },
    {
      id: 'beach-vacation',
      name: '海边度假',
      description: '轻松惬意的度假风情',
      icon: '🏖️',
      tags: ['休闲', '清爽', '度假']
    },
    {
      id: 'business-meeting',
      name: '商务会议',
      description: '正式专业的商务形象',
      icon: '🤝',
      tags: ['正式', '专业', '权威']
    },
    {
      id: 'casual-shopping',
      name: '休闲购物',
      description: '舒适自在的购物装扮',
      icon: '🛍️',
      tags: ['休闲', '舒适', '实用']
    },
    {
      id: 'party-night',
      name: '聚会夜晚',
      description: '时尚亮眼的派对造型',
      icon: '🎉',
      tags: ['时尚', '亮眼', '派对']
    }
  ];

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    const scenario = scenarios.find(s => s.id === scenarioId);
    
    // Navigate to outfit result page with scenario data
    router.push({
      pathname: '/outfit/result',
      query: {
        type: 'scenario',
        scenarioId: scenarioId,
        scenarioName: scenario?.name
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="scenario-selection-page">
      <header className="scenario-selection__header">
        <button className="back-button" onClick={handleBack}>
          <img src="/assets/icons/actions/chevron-left.svg" alt="返回" onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'inline';
          }} />
          <span style={{display: 'none'}}>←</span>
        </button>
        <h1 className="page-title">选择场景</h1>
      </header>

      <main className="scenario-selection__main">
        <p className="scenario-selection__subtitle">
          为你的特定场合推荐最合适的搭配
        </p>
        
        <div className="scenario-grid">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`scenario-card ${selectedScenario === scenario.id ? 'selected' : ''}`}
              onClick={() => handleScenarioSelect(scenario.id)}
            >
              <div className="scenario-card__icon">
                {scenario.icon}
              </div>
              <h3 className="scenario-card__name">{scenario.name}</h3>
              <p className="scenario-card__description">{scenario.description}</p>
              <div className="scenario-card__tags">
                {scenario.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ScenarioSelectionPage;