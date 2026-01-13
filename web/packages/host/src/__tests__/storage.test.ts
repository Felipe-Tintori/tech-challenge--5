import { storage } from '../utils/storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should set and get item', () => {
    storage.set('test-key', 'test-value');
    expect(storage.get('test-key')).toBe('test-value');
  });

  it('should return null for non-existent key', () => {
    expect(storage.get('non-existent')).toBeNull();
  });

  it('should remove item', () => {
    storage.set('test-key', 'test-value');
    storage.remove('test-key');
    expect(storage.get('test-key')).toBeNull();
  });

  it('should clear all items', () => {
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');
    storage.clear();
    expect(storage.get('key1')).toBeNull();
    expect(storage.get('key2')).toBeNull();
  });
});
