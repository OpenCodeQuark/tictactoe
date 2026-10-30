import { useState, useEffect, useCallback } from 'react';
import { GameSettings } from '../engine/gameTypes';
import { storageService, STORAGE_KEYS } from '../services/storageService';
import { hapticsService } from '../services/hapticsService';
import { soundService } from '../services/soundService';

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  animationsEnabled: true,
  theme: 'cyber-midnight',
};

export function useSettings() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const stored = await storageService.getItem<GameSettings>(
        STORAGE_KEYS.SETTINGS,
        DEFAULT_SETTINGS
      );
      setSettings(stored);
      hapticsService.setEnabled(stored.hapticsEnabled);
      soundService.setEnabled(stored.soundEnabled);
      setLoaded(true);
    }
    loadSettings();
  }, []);

  const updateSetting = useCallback(
    async <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
      setSettings(prev => {
        const next = { ...prev, [key]: value };
        if (key === 'hapticsEnabled') {
          hapticsService.setEnabled(value as boolean);
        } else if (key === 'soundEnabled') {
          soundService.setEnabled(value as boolean);
        }
        storageService.setItem(STORAGE_KEYS.SETTINGS, next);
        return next;
      });
    },
    []
  );

  return {
    settings,
    loaded,
    updateSetting,
  };
}

