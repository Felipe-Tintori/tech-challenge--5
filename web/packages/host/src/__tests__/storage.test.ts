import { storage } from '../utils/storage';

// Mock firebase modules (já configurado no jest.config.js via moduleNameMapper)
const { getDoc, setDoc, deleteDoc, doc } = require('firebase/firestore');

describe('Storage Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get item when document exists', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ value: 'test-value' }) });
    const result = await storage.get('test-key');
    expect(result).toBe('test-value');
  });

  it('should return null for non-existent key', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });
    const result = await storage.get('non-existent');
    expect(result).toBeNull();
  });

  it('should set item calling setDoc', async () => {
    setDoc.mockResolvedValueOnce(undefined);
    await storage.set('test-key', 'test-value');
    expect(setDoc).toHaveBeenCalled();
  });

  it('should remove item calling deleteDoc', async () => {
    deleteDoc.mockResolvedValueOnce(undefined);
    await storage.remove('test-key');
    expect(deleteDoc).toHaveBeenCalled();
  });

  it('should warn when clear is called', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await storage.clear();
    expect(warnSpy).toHaveBeenCalledWith('Clear all storage not implemented for Firestore');
    warnSpy.mockRestore();
  });
});

