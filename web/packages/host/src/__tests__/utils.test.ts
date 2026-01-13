// Testes simples de utilidades e funções puras

describe('Utility Tests', () => {
  it('should pass basic assertion', () => {
    expect(true).toBe(true);
  });

  it('should handle string operations', () => {
    const text = 'MindEase';
    expect(text.toLowerCase()).toBe('mindease');
    expect(text.length).toBe(8);
  });

  it('should handle array operations', () => {
    const items = [1, 2, 3];
    expect(items.length).toBe(3);
    expect(items[0]).toBe(1);
  });

  it('should handle object operations', () => {
    const user = { name: 'Test', email: 'test@example.com' };
    expect(user.name).toBe('Test');
    expect(user.email).toContain('@');
  });
});
