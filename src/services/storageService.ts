import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory fallback if AsyncStorage native module is unavailable
const memoryStorage = new Map<string, string>();

export const STORAGE_KEYS = {
  STATS: '@tictactoe_stats_v1',
  HISTORY: '@tictactoe_history_v1',
  SETTINGS: '@tictactoe_settings_v1',
};

export const storageService = {
  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          return JSON.parse(item) as T;
        }
      }
    } catch {
      // Fallback to memory
    }

    const memItem = memoryStorage.get(key);
    if (memItem !== undefined) {
      try {
        return JSON.parse(memItem) as T;
      } catch {
        return defaultValue;
      }
    }

    return defaultValue;
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    const stringValue = JSON.stringify(value);
    memoryStorage.set(key, stringValue);

    try {
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem(key, stringValue);
      }
    } catch {
      // Memory fallback was already written
    }
  },

  async removeItem(key: string): Promise<void> {
    memoryStorage.delete(key);
    try {
      if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
        await AsyncStorage.removeItem(key);
      }
    } catch {
      // Ignore
    }
  },

  async clearAll(): Promise<void> {
    memoryStorage.clear();
    try {
      if (AsyncStorage && typeof AsyncStorage.clear === 'function') {
        await AsyncStorage.clear();
      }
    } catch {
      // Ignore
    }
  },
};
