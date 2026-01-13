// Domain Types
export interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: ThemePreference;
  accessibility: AccessibilityPreferences;
  cognitive: CognitivePreferences;
  notifications: NotificationPreferences;
}

export interface ThemePreference {
  mode: 'light' | 'dark' | 'high-contrast';
  fontSize: FontSize;
  spacing: Spacing;
  animations: boolean;
  customColors?: CustomColors;
}

export interface CustomColors {
  primary?: string;
  background?: string;
  text?: string;
  accent?: string;
}

export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type Spacing = 'compact' | 'normal' | 'comfortable' | 'spacious';

export interface AccessibilityPreferences {
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  focusIndicators: boolean;
  textToSpeech: boolean;
}

export interface CognitivePreferences {
  complexityLevel: ComplexityLevel;
  focusMode: boolean;
  displayMode: DisplayMode;
  cognitiveAlerts: boolean;
  transitionSpeed: TransitionSpeed;
  visualAids: boolean;
  simplifiedText: boolean;
}

export type ComplexityLevel = 'minimal' | 'simple' | 'standard' | 'detailed';
export type DisplayMode = 'resume' | 'detailed';
export type TransitionSpeed = 'slow' | 'normal' | 'fast' | 'instant';

export interface NotificationPreferences {
  enabled: boolean;
  sound: boolean;
  taskReminders: boolean;
  breakReminders: boolean;
  focusAlerts: boolean;
  timeTracking: boolean;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  category?: string;
  dueDate?: Date;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  subtasks?: Subtask[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

// Pomodoro Types
export interface PomodoroSession {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  type: SessionType;
  completed: boolean;
  interrupted: boolean;
}

export type SessionType = 'focus' | 'short-break' | 'long-break';

export interface PomodoroSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
}

// Analytics Types
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  module: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface CognitiveMetrics {
  focusTime: number; // total minutes in focus
  tasksCompleted: number;
  averageSessionDuration: number;
  interruptionCount: number;
  preferredWorkTime: string; // time of day
  productivityScore: number; // 0-100
}
