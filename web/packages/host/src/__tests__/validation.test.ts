import { validation } from '../utils/validation';

describe('Validation Utils', () => {
  describe('isEmail', () => {
    it('should validate correct email', () => {
      expect(validation.isEmail('test@example.com')).toBe(true);
      expect(validation.isEmail('user@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validation.isEmail('invalid')).toBe(false);
      expect(validation.isEmail('test@')).toBe(false);
      expect(validation.isEmail('@example.com')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('should validate strong password', () => {
      expect(validation.isStrongPassword('12345678')).toBe(true);
      expect(validation.isStrongPassword('strongpass')).toBe(true);
    });

    it('should reject weak password', () => {
      expect(validation.isStrongPassword('1234567')).toBe(false);
      expect(validation.isStrongPassword('short')).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should detect empty strings', () => {
      expect(validation.isEmpty('')).toBe(true);
      expect(validation.isEmpty('   ')).toBe(true);
    });

    it('should detect non-empty strings', () => {
      expect(validation.isEmpty('text')).toBe(false);
      expect(validation.isEmpty(' a ')).toBe(false);
    });
  });

  describe('isValidName', () => {
    it('should validate valid names', () => {
      expect(validation.isValidName('John')).toBe(true);
      expect(validation.isValidName('AB')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(validation.isValidName('A')).toBe(false);
      expect(validation.isValidName(' ')).toBe(false);
    });
  });
});
