import { useState, useEffect, useCallback } from 'react';
import { GameStats, GameMode, AIDifficulty, PlayerSymbol } from '../engine/gameTypes';
import { storageService, STORAGE_KEYS } from '../services/storageService';

const DEFAULT_DIFFICULTY_STATS = {
  games: 0,
  wins: 0,
  losses: 0,
  draws: 0,
};

const DEFAULT_STATS: GameStats = {
  totalGames: 0,
  pvpGames: 0,
  aiGames: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  winRate: 0,
  currentStreak: 0,
  bestStreak: 0,
  easyStats: { ...DEFAULT_DIFFICULTY_STATS },
  mediumStats: { ...DEFAULT_DIFFICULTY_STATS },
  hardStats: { ...DEFAULT_DIFFICULTY_STATS },
};

export function useGameStats() {
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadStats() {
      const stored = await storageService.getItem<GameStats>(
        STORAGE_KEYS.STATS,
        DEFAULT_STATS
      );
      setStats(stored);
      setLoaded(true);
    }
    loadStats();
  }, []);

  const recordGameResult = useCallback(
    async (
      winner: PlayerSymbol | 'draw',
      mode: GameMode,
      difficulty?: AIDifficulty,
      player1Symbol: PlayerSymbol = 'X'
    ) => {
      setStats(prev => {
        const next: GameStats = {
          ...prev,
          totalGames: prev.totalGames + 1,
          easyStats: { ...prev.easyStats },
          mediumStats: { ...prev.mediumStats },
          hardStats: { ...prev.hardStats },
        };

        if (mode === 'pvp') {
          next.pvpGames = prev.pvpGames + 1;
        } else {
          next.aiGames = prev.aiGames + 1;
        }

        const isWin = winner === player1Symbol;
        const isDraw = winner === 'draw';
        const isLoss = !isWin && !isDraw;

        if (isWin) {
          next.wins = prev.wins + 1;
          next.currentStreak = prev.currentStreak + 1;
          next.bestStreak = Math.max(next.currentStreak, prev.bestStreak);
        } else if (isDraw) {
          next.draws = prev.draws + 1;
        } else if (isLoss) {
          next.losses = prev.losses + 1;
          next.currentStreak = 0;
        }

        if (mode === 'ai' && difficulty) {
          const diffKey =
            difficulty === 'easy'
              ? 'easyStats'
              : difficulty === 'medium'
              ? 'mediumStats'
              : 'hardStats';

          next[diffKey].games += 1;
          if (isWin) next[diffKey].wins += 1;
          else if (isDraw) next[diffKey].draws += 1;
          else if (isLoss) next[diffKey].losses += 1;
        }

        const decisiveGames = next.wins + next.losses + next.draws;
        next.winRate =
          decisiveGames > 0 ? Math.round((next.wins / decisiveGames) * 100) : 0;

        storageService.setItem(STORAGE_KEYS.STATS, next);
        return next;
      });
    },
    []
  );

  const resetStats = useCallback(async () => {
    const cleared = {
      ...DEFAULT_STATS,
      easyStats: { ...DEFAULT_DIFFICULTY_STATS },
      mediumStats: { ...DEFAULT_DIFFICULTY_STATS },
      hardStats: { ...DEFAULT_DIFFICULTY_STATS },
    };
    setStats(cleared);
    await storageService.setItem(STORAGE_KEYS.STATS, cleared);
  }, []);

  return {
    stats,
    loaded,
    recordGameResult,
    resetStats,
  };
}

