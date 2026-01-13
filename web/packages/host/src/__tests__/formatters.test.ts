import { formatters } from '../utils/formatters';

describe('Formatters Utils', () => {
  describe('formatDate', () => {
    it('should format date in pt-BR', () => {
      const date = new Date(2026, 0, 13); // Month is 0-indexed
      const formatted = formatters.formatDate(date);
      expect(formatted).toContain('13');
      expect(formatted).toContain('01');
      expect(formatted).toContain('2026');
    });
  });

  describe('formatTime', () => {
    it('should format time in pt-BR', () => {
      const date = new Date('2026-01-13T14:30:00');
      const formatted = formatters.formatTime(date);
      expect(formatted).toContain('14');
      expect(formatted).toContain('30');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text';
      expect(formatters.truncate(text, 10)).toBe('This is a ...');
    });

    it('should not truncate short text', () => {
      const text = 'Short';
      expect(formatters.truncate(text, 10)).toBe('Short');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(formatters.capitalize('hello')).toBe('Hello');
      expect(formatters.capitalize('WORLD')).toBe('World');
    });

    it('should handle empty string', () => {
      expect(formatters.capitalize('')).toBe('');
    });
  });
});
