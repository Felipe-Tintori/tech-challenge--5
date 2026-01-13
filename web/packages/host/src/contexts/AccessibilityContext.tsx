import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  focusMode: boolean;
  complexityLevel: 'minimal' | 'simple' | 'standard' | 'detailed';
  displayMode: 'resume' | 'detailed';
  cognitiveAlerts: boolean;
  focusIndicators: 'standard' | 'enhanced';
  screenReader: boolean;
  setFocusMode: (enabled: boolean) => void;
  setComplexityLevel: (level: 'minimal' | 'simple' | 'standard' | 'detailed') => void;
  setDisplayMode: (mode: 'resume' | 'detailed') => void;
  setCognitiveAlerts: (enabled: boolean) => void;
  setFocusIndicators: (type: 'standard' | 'enhanced') => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [focusMode, setFocusMode] = useState(false);
  const [complexityLevel, setComplexityLevel] = useState<'minimal' | 'simple' | 'standard' | 'detailed'>('standard');
  const [displayMode, setDisplayMode] = useState<'resume' | 'detailed'>('detailed');
  const [cognitiveAlerts, setCognitiveAlerts] = useState(true);
  const [focusIndicators, setFocusIndicators] = useState<'standard' | 'enhanced'>('standard');
  const [screenReader, setScreenReader] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedFocusMode = localStorage.getItem('focusMode');
    const savedComplexity = localStorage.getItem('complexityLevel') as 'minimal' | 'simple' | 'standard' | 'detailed' | null;
    const savedDisplayMode = localStorage.getItem('displayMode') as 'resume' | 'detailed' | null;
    const savedCognitiveAlerts = localStorage.getItem('cognitiveAlerts');
    const savedFocusIndicators = localStorage.getItem('focusIndicators') as 'standard' | 'enhanced' | null;

    if (savedFocusMode !== null) setFocusMode(savedFocusMode === 'true');
    if (savedComplexity) setComplexityLevel(savedComplexity);
    if (savedDisplayMode) setDisplayMode(savedDisplayMode);
    if (savedCognitiveAlerts !== null) setCognitiveAlerts(savedCognitiveAlerts === 'true');
    if (savedFocusIndicators) setFocusIndicators(savedFocusIndicators);

    // Detect screen reader
    const detectScreenReader = () => {
      const isScreenReaderActive = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setScreenReader(isScreenReaderActive);
    };
    detectScreenReader();
  }, []);

  useEffect(() => {
    // Apply accessibility settings to document
    document.documentElement.setAttribute('data-focus-mode', focusMode.toString());
    document.documentElement.setAttribute('data-complexity', complexityLevel);
    document.documentElement.setAttribute('data-display-mode', displayMode);
    document.documentElement.setAttribute('data-focus-indicators', focusIndicators);

    // Save to localStorage
    localStorage.setItem('focusMode', focusMode.toString());
    localStorage.setItem('complexityLevel', complexityLevel);
    localStorage.setItem('displayMode', displayMode);
    localStorage.setItem('cognitiveAlerts', cognitiveAlerts.toString());
    localStorage.setItem('focusIndicators', focusIndicators);
  }, [focusMode, complexityLevel, displayMode, cognitiveAlerts, focusIndicators]);

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        focusMode,
        complexityLevel,
        displayMode,
        cognitiveAlerts,
        focusIndicators,
        screenReader,
        setFocusMode,
        setComplexityLevel,
        setDisplayMode,
        setCognitiveAlerts,
        setFocusIndicators,
        announceToScreenReader,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
