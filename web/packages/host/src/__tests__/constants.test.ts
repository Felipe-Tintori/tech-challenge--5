import { APP_NAME, ROUTES, THEMES, STORAGE_KEYS, COMPLEXITY_LEVELS } from '../utils/constants';

describe('Constants', () => {
  it('should have correct app name', () => {
    expect(APP_NAME).toBe('MindEase');
  });

  describe('ROUTES', () => {
    it('should have all main routes', () => {
      expect(ROUTES.HOME).toBe('/');
      expect(ROUTES.LOGIN).toBe('/login');
      expect(ROUTES.DASHBOARD).toBe('/painel');
      expect(ROUTES.TASKS).toBe('/tarefas');
      expect(ROUTES.PROFILE).toBe('/perfil');
    });
  });

  describe('THEMES', () => {
    it('should have all theme options', () => {
      expect(THEMES.LIGHT).toBe('light');
      expect(THEMES.DARK).toBe('dark');
      expect(THEMES.HIGH_CONTRAST).toBe('high-contrast');
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have all storage keys', () => {
      expect(STORAGE_KEYS.THEME).toBe('mindease-theme');
      expect(STORAGE_KEYS.FONT_SIZE).toBe('mindease-font-size');
      expect(STORAGE_KEYS.AUTH_TOKEN).toBe('mindease-auth-token');
      expect(STORAGE_KEYS.USER).toBe('mindease-user');
    });
  });

  describe('COMPLEXITY_LEVELS', () => {
    it('should have all complexity levels', () => {
      expect(COMPLEXITY_LEVELS.LOW).toBe('low');
      expect(COMPLEXITY_LEVELS.MEDIUM).toBe('medium');
      expect(COMPLEXITY_LEVELS.HIGH).toBe('high');
    });
  });
});
