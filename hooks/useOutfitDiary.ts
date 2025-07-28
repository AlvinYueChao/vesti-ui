// Custom hook for outfit diary management

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { ClothingItem } from '../types';

export interface OutfitRecord {
  id: string;
  date: string;
  dayOfWeek: string;
  weather: {
    location: string;
    temperature: string;
    condition: string;
  };
  colors: string[];
  image: string;
  description?: string;
  items: ClothingItem[]; // 详细的单品信息
  scenario?: string;
  aiComment?: string;
  aiDesignerNote?: string; // 详情页面使用的AI设计师说明
}

export const useOutfitDiary = (userId: string) => {
  const [records, setRecords] = useState<OutfitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOutfitDiary = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getOutfitDiary(userId);
      if (response.success && response.data) {
        setRecords(response.data as OutfitRecord[]);
      } else {
        setError(response.error || 'Failed to load outfit diary');
      }
    } catch (err) {
      setError('Failed to load outfit diary');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadOutfitDiary();
  }, [loadOutfitDiary]);

  const saveOutfitRecord = async (record: Omit<OutfitRecord, 'id'>) => {
    try {
      const response = await apiService.saveOutfitRecord(userId, record);
      if (response.success && response.data) {
        const newRecord = response.data as OutfitRecord;
        setRecords(prev => [newRecord, ...prev]);
        return newRecord;
      } else {
        throw new Error(response.error || 'Failed to save outfit record');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save outfit record');
      throw err;
    }
  };

  const updateOutfitRecord = async (recordId: string, updates: Partial<OutfitRecord>) => {
    try {
      const response = await apiService.updateOutfitRecord(userId, recordId, updates);
      if (response.success) {
        setRecords(prev => 
          prev.map(record => 
            record.id === recordId 
              ? { ...record, ...updates }
              : record
          )
        );
      } else {
        throw new Error(response.error || 'Failed to update outfit record');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update outfit record');
      throw err;
    }
  };

  const deleteOutfitRecord = async (recordId: string) => {
    try {
      const response = await apiService.deleteOutfitRecord(userId, recordId);
      if (response.success) {
        setRecords(prev => prev.filter(record => record.id !== recordId));
      } else {
        throw new Error(response.error || 'Failed to delete outfit record');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete outfit record');
      throw err;
    }
  };

  const getRecordsForMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getFullYear() === year && recordDate.getMonth() + 1 === month;
    });
  };

  const getRecordForDate = (date: string) => {
    return records.find(record => record.date === date);
  };

  const getTodayRecord = () => {
    const today = new Date().toISOString().split('T')[0];
    return getRecordForDate(today);
  };

  return {
    records,
    loading,
    error,
    saveOutfitRecord,
    updateOutfitRecord,
    deleteOutfitRecord,
    getRecordsForMonth,
    getRecordForDate,
    getTodayRecord,
    refreshDiary: loadOutfitDiary,
  };
};