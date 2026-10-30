import { useState, useEffect, useCallback } from 'react';
import { GameHistoryItem } from '../engine/gameTypes';
import { storageService, STORAGE_KEYS } from '../services/storageService';

const MAX_HISTORY_ITEMS = 50;

export function useGameHistory() {
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      const stored = await storageService.getItem<GameHistoryItem[]>(
        STORAGE_KEYS.HISTORY,
        []
      );
      setHistory(stored);
      setLoaded(true);
    }
    loadHistory();
  }, []);

  const addHistoryItem = useCallback(
    async (item: Omit<GameHistoryItem, 'id' | 'timestamp' | 'dateFormatted'>) => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const newItem: GameHistoryItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        timestamp: Date.now(),
        dateFormatted: formattedDate,
      };

      setHistory(prev => {
        const next = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
        storageService.setItem(STORAGE_KEYS.HISTORY, next);
        return next;
      });
    },
    []
  );

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await storageService.setItem(STORAGE_KEYS.HISTORY, []);
  }, []);

  const getFilteredHistory = useCallback(
    (filter: 'all' | 'pvp' | 'ai') => {
      if (filter === 'all') return history;
      return history.filter(item => item.mode === filter);
    },
    [history]
  );

  return {
    history,
    loaded,
    addHistoryItem,
    clearHistory,
    getFilteredHistory,
  };
}
