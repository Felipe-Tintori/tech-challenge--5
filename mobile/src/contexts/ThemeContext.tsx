import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type SpacingMode = 'compact' | 'normal' | 'comfortable' | 'spacious';

interface ThemeContextType {
  theme: ThemeMode;
  fontSize: FontSize;
  spacing: SpacingMode;
  animationsEnabled: boolean;
  setTheme: (t: ThemeMode) => void;
  setFontSize: (f: FontSize) => void;
  setSpacing: (s: SpacingMode) => void;
  setAnimationsEnabled: (v: boolean) => void;
  colors: Record<string, string>;
  fontSizeValue: number;
  spacingValue: number;
}

const COLORS: Record<ThemeMode, Record<string, string>> = {
  light: {
    background: '#F8F9FF',
    surface: '#FFFFFF',
    primary: '#6C63FF',
    primaryDark: '#5A52D5',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    card: '#FFFFFF',
    tabBar: '#FFFFFF',
    tabBarActive: '#6C63FF',
    tabBarInactive: '#9CA3AF',
  },
  dark: {
    background: '#0F0F1A',
    surface: '#1A1A2E',
    primary: '#8B85FF',
    primaryDark: '#6C63FF',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#2D2D44',
    error: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
    card: '#1E1E30',
    tabBar: '#1A1A2E',
    tabBarActive: '#8B85FF',
    tabBarInactive: '#4B5563',
  },
  'high-contrast': {
    background: '#000000',
    surface: '#111111',
    primary: '#FFFF00',
    primaryDark: '#CCCC00',
    text: '#FFFFFF',
    textSecondary: '#DDDDDD',
    border: '#FFFFFF',
    error: '#FF4444',
    success: '#00FF88',
    warning: '#FFAA00',
    card: '#111111',
    tabBar: '#000000',
    tabBarActive: '#FFFF00',
    tabBarInactive: '#888888',
  },
};

const FONT_SIZES: Record<FontSize, number> = {
  small: 13,
  medium: 16,
  large: 20,
  'extra-large': 24,
};

const SPACING_VALUES: Record<SpacingMode, number> = {
  compact: 8,
  normal: 12,
  comfortable: 16,
  spacious: 24,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [spacing, setSpacingState] = useState<SpacingMode>('normal');
  const [animationsEnabled, setAnimationsEnabledState] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.id)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.theme) setThemeState(d.theme);
        if (d.fontSize) setFontSizeState(d.fontSize);
        if (d.spacing) setSpacingState(d.spacing);
        if (d.animationsEnabled !== undefined) setAnimationsEnabledState(d.animationsEnabled);
      }
    });
  }, [user]);

  const persist = async (data: Partial<{ theme: ThemeMode; fontSize: FontSize; spacing: SpacingMode; animationsEnabled: boolean }>) => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.id), data, { merge: true });
  };

  const setTheme = (t: ThemeMode) => { setThemeState(t); persist({ theme: t }); };
  const setFontSize = (f: FontSize) => { setFontSizeState(f); persist({ fontSize: f }); };
  const setSpacing = (s: SpacingMode) => { setSpacingState(s); persist({ spacing: s }); };
  const setAnimationsEnabled = (v: boolean) => { setAnimationsEnabledState(v); persist({ animationsEnabled: v }); };

  return (
    <ThemeContext.Provider value={{
      theme, fontSize, spacing, animationsEnabled,
      setTheme, setFontSize, setSpacing, setAnimationsEnabled,
      colors: COLORS[theme],
      fontSizeValue: FONT_SIZES[fontSize],
      spacingValue: SPACING_VALUES[spacing],
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
