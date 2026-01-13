export const validation = {
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isStrongPassword: (password: string): boolean => {
    return password.length >= 8;
  },

  isEmpty: (value: string): boolean => {
    return !value || value.trim().length === 0;
  },

  isValidName: (name: string): boolean => {
    return name.trim().length >= 2;
  }
};
