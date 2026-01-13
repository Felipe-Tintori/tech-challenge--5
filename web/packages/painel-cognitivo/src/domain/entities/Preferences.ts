// Domain Entities
export interface UserPreferences {
  theme: ThemeMode;
  fontSize: FontSize;
  spacing: SpacingMode;
  animationsEnabled: boolean;
  focusMode: boolean;
  complexityLevel: ComplexityLevel;
  highContrast: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'high-contrast';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type SpacingMode = 'compact' | 'normal' | 'comfortable' | 'spacious';
export type ComplexityLevel = 'minimal' | 'simple' | 'standard' | 'detailed';

export interface CognitiveMetrics {
  focusTimeToday: number; // minutes
  tasksCompletedToday: number;
  averageSessionLength: number; // minutes
  productivityScore: number; // 0-100
  streakDays: number;
}
