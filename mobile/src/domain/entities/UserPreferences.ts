export type ThemeMode = 'light' | 'dark' | 'high-contrast';
export type FontSizeMode = 'small' | 'medium' | 'large' | 'extra-large';
export type SpacingMode = 'compact' | 'normal' | 'comfortable' | 'spacious';
export type ComplexityLevel = 'minimal' | 'simple' | 'standard' | 'detailed';

export interface UserPreferences {
  userId: string;
  theme: ThemeMode;
  fontSize: FontSizeMode;
  spacing: SpacingMode;
  animationsEnabled: boolean;
  focusMode: boolean;
  complexityLevel: ComplexityLevel;
  cognitiveAlerts: boolean;
  updatedAt: string;
}

export const DEFAULT_PREFERENCES: Omit<UserPreferences, 'userId'> = {
  theme: 'light',
  fontSize: 'medium',
  spacing: 'normal',
  animationsEnabled: true,
  focusMode: false,
  complexityLevel: 'standard',
  cognitiveAlerts: true,
  updatedAt: new Date().toISOString(),
};
