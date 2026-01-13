export const APP_NAME = 'MindEase';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/painel',
  TASKS: '/tarefas',
  PROFILE: '/perfil'
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  HIGH_CONTRAST: 'high-contrast'
} as const;

export const STORAGE_KEYS = {
  THEME: 'mindease-theme',
  FONT_SIZE: 'mindease-font-size',
  AUTH_TOKEN: 'mindease-auth-token',
  USER: 'mindease-user'
} as const;

export const COMPLEXITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;
