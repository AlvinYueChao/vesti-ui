import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useOutfitDiary, OutfitRecord } from '../../../hooks/useOutfitDiary';

type ViewMode = 'list' | 'calendar';

const OutfitDiaryPage: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date()); // 使用当前日期
  
  const { records: outfitRecords, loading, error, refreshDiary } = useOutfitDiary('user-123');

  // 当组件挂载时，检查是否需要刷新数据
  useEffect(() => {
    // 如果从搭配结果页面跳转过来，刷新数据
    if (router.query.refresh === 'true') {
      // 使用 setTimeout 来避免渲染冲突
      const timer = setTimeout(() => {
        refreshDiary();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [router.query.refresh]);

  const handleBack = () => {
    router.back();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleRecordClick = (record: OutfitRecord) => {
    // 跳转到穿搭详情页面
    router.push(`/outfit/detail?id=${record.id}`);
  };

  const formatMonth = (date: Date) => {
    return `${date.getFullYear()}年 ${date.getMonth() + 1}月`;
  };

  const getRecordsForMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return outfitRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getFullYear() === year && recordDate.getMonth() + 1 === month;
    });
  };

  const currentMonthRecords = getRecordsForMonth(currentMonth);

  if (loading) {
    return (
      <div className="outfit-diary-page loading">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="outfit-diary-page error">
        <div className="error-message">加载失败: {error}</div>
      </div>
    );
  }

  return (
    <div className="outfit-diary-page">
      {/* 顶部导航栏 */}
      <header className="outfit-diary-page__header">
        <button className="back-button" onClick={handleBack}>
          <img src="/assets/icons/actions/chevron-left.svg" alt="返回" onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'inline';
          }} />
          <span style={{display: 'none'}}>←</span>
        </button>

        <div className="outfit-diary-page__month-nav">
          <button onClick={handlePrevMonth}>‹</button>
          <span className="outfit-diary-page__month-title">{formatMonth(currentMonth)}</span>
          <button onClick={handleNextMonth}>›</button>
        </div>

        <button
          className="outfit-diary-page__view-toggle"
          onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
        >
          {viewMode === 'list' ? '⊞' : '☰'}
        </button>
      </header>

      {/* 内容区域 */}
      <div className="outfit-diary-page__content">
        {viewMode === 'list' ? (
          <ListView records={currentMonthRecords} onRecordClick={handleRecordClick} />
        ) : (
          <CalendarView
            currentMonth={currentMonth}
            records={currentMonthRecords}
            onRecordClick={handleRecordClick}
          />
        )}
      </div>

    </div>
  );
};

// 列表视图组件
const ListView: React.FC<{
  records: OutfitRecord[];
  onRecordClick: (record: OutfitRecord) => void;
}> = ({ records, onRecordClick }) => {
  const sortedRecords = [...records].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="outfit-diary-page__list-view">
      {sortedRecords.length === 0 ? (
        <div className="outfit-diary-page__empty">
          <div className="outfit-diary-page__empty-icon">📅</div>
          <p>本月还没有穿搭记录</p>
        </div>
      ) : (
        sortedRecords.map((record, index) => (
          <div
            key={record.id}
            className="outfit-diary-page__list-item"
            onClick={() => onRecordClick(record)}
          >
            <div className={`outfit-diary-page__list-image outfit-diary-page__list-image--${index % 3}`}>
              <div className="outfit-diary-page__look-badge">Look</div>
            </div>
            <div className="outfit-diary-page__list-content">
              <div className="outfit-diary-page__list-date">
                {new Date(record.date).getMonth() + 1}月{new Date(record.date).getDate()}日，{record.dayOfWeek}
              </div>
              <div className="outfit-diary-page__list-weather">
                {record.weather.location} {record.weather.temperature} {record.weather.condition}
              </div>
              <div className="outfit-diary-page__list-colors">
                {record.colors.map((color, index) => (
                  <div
                    key={index}
                    className="outfit-diary-page__color-dot"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// 日历视图组件
const CalendarView: React.FC<{
  currentMonth: Date;
  records: OutfitRecord[];
  onRecordClick: (record: OutfitRecord) => void;
}> = ({ currentMonth, records, onRecordClick }) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // 获取当月第一天是星期几
  const firstDay = new Date(year, month, 1).getDay();
  // 获取当月天数
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 创建日历网格
  const calendarDays = [];

  // 添加空白天数
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // 添加当月天数
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = records.find(r => r.date === dateStr);
    calendarDays.push({ day, record });
  }

  return (
    <div className="outfit-diary-page__calendar-view">
      <div className="outfit-diary-page__calendar-header">
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day} className="outfit-diary-page__calendar-weekday">{day}</div>
        ))}
      </div>

      <div className="outfit-diary-page__calendar-grid">
        {calendarDays.map((item, index) => {
          const isToday = item && new Date().getDate() === item.day &&
            new Date().getMonth() === month &&
            new Date().getFullYear() === year;

          return (
            <div
              key={index}
              className={`outfit-diary-page__calendar-day ${item?.record ? 'has-record' : ''} ${isToday ? 'is-today' : ''}`}
              onClick={() => item?.record && onRecordClick(item.record)}
            >
              {item && (
                <>
                  <span className="outfit-diary-page__calendar-day-number">{item.day}</span>
                  {item.record && (
                    <div className="outfit-diary-page__calendar-look-badge">Look</div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};



export default OutfitDiaryPage;