import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'high-contrast';
  fontSize: 'medium' | 'large' | 'extra-large';
  spacing: 'normal' | 'comfortable' | 'spacious';
  animationsEnabled: boolean;
  setTheme: (theme: 'light' | 'dark' | 'high-contrast') => void;
  setFontSize: (size: 'medium' | 'large' | 'extra-large') => void;
  setSpacing: (spacing: 'normal' | 'comfortable' | 'spacious') => void;
  toggleAnimations: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>('light');
  const [fontSize, setFontSize] = useState<'medium' | 'large' | 'extra-large'>('medium');
  const [spacing, setSpacing] = useState<'normal' | 'comfortable' | 'spacious'>('normal');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  useEffect(() => {
    // Load preferences from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'high-contrast' | null;
    const savedFontSize = localStorage.getItem('fontSize') as 'medium' | 'large' | 'extra-large' | null;
    const savedSpacing = localStorage.getItem('spacing') as 'normal' | 'comfortable' | 'spacious' | null;
    const savedAnimations = localStorage.getItem('animationsEnabled');

    if (savedTheme) setTheme(savedTheme);
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedSpacing) setSpacing(savedSpacing);
    if (savedAnimations !== null) setAnimationsEnabled(savedAnimations === 'true');

    // Check for system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!savedTheme && prefersDark) setTheme('dark');
    if (prefersReducedMotion) setAnimationsEnabled(false);
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font-size', fontSize);
    document.documentElement.setAttribute('data-spacing', spacing);
    document.documentElement.setAttribute('data-reduced-motion', (!animationsEnabled).toString());

    // Save to localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('spacing', spacing);
    localStorage.setItem('animationsEnabled', animationsEnabled.toString());
  }, [theme, fontSize, spacing, animationsEnabled]);

  const toggleAnimations = () => setAnimationsEnabled(!animationsEnabled);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        fontSize,
        spacing,
        animationsEnabled,
        setTheme,
        setFontSize,
        setSpacing,
        toggleAnimations,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
