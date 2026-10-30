/* eslint-disable no-undef */
const mockStorage = new Map();

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn((key, value) => {
    mockStorage.set(key, String(value));
    return Promise.resolve(null);
  }),
  getItem: jest.fn(key => {
    return Promise.resolve(mockStorage.has(key) ? mockStorage.get(key) : null);
  }),
  removeItem: jest.fn(key => {
    mockStorage.delete(key);
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    mockStorage.clear();
    return Promise.resolve(null);
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Array.from(mockStorage.keys()))),
}));
