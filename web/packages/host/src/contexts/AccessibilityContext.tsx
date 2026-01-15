import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreDb } from '../config/firebase';

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
  const [focusMode, setFocusModeState] = useState(false);
  const [complexityLevel, setComplexityLevelState] = useState<'minimal' | 'simple' | 'standard' | 'detailed'>('standard');
  const [displayMode, setDisplayModeState] = useState<'resume' | 'detailed'>('detailed');
  const [cognitiveAlerts, setCognitiveAlertsState] = useState(true);
  const [focusIndicators, setFocusIndicatorsState] = useState<'standard' | 'enhanced'>('standard');
  const [screenReader, setScreenReader] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const auth = getFirebaseAuth();
  const db = getFirestoreDb();

  // Load preferences from Firestore
  useEffect(() => {
    const loadPreferences = async () => {
      const user = auth.currentUser;
      if (!user) {
        setIsLoaded(true);
        return;
      }

      try {
        const docRef = doc(db, 'accessibility_preferences', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFocusModeState(data.focusMode || false);
          setComplexityLevelState(data.complexityLevel || 'standard');
          setDisplayModeState(data.displayMode || 'detailed');
          setCognitiveAlertsState(data.cognitiveAlerts !== false);
          setFocusIndicatorsState(data.focusIndicators || 'standard');
        }
      } catch (error) {
        console.error('Error loading accessibility preferences:', error);
      }

      setIsLoaded(true);
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      loadPreferences();
    });

    // Detect screen reader
    const detectScreenReader = () => {
      const isScreenReaderActive = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setScreenReader(isScreenReaderActive);
    };
    detectScreenReader();

    return () => unsubscribe();
  }, [auth, db]);

  // Save preferences to Firestore
  const savePreferences = async (data: any) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'accessibility_preferences', user.uid);
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving accessibility preferences:', error);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    // Apply accessibility settings to document
    document.documentElement.setAttribute('data-focus-mode', focusMode.toString());
    document.documentElement.setAttribute('data-complexity', complexityLevel);
    document.documentElement.setAttribute('data-display-mode', displayMode);
    document.documentElement.setAttribute('data-focus-indicators', focusIndicators);

    // Save to Firestore
    savePreferences({ focusMode, complexityLevel, displayMode, cognitiveAlerts, focusIndicators });
  }, [focusMode, complexityLevel, displayMode, cognitiveAlerts, focusIndicators, isLoaded]);

  const setFocusMode = (enabled: boolean) => {
    setFocusModeState(enabled);
  };

  const setComplexityLevel = (level: 'minimal' | 'simple' | 'standard' | 'detailed') => {
    setComplexityLevelState(level);
  };

  const setDisplayMode = (mode: 'resume' | 'detailed') => {
    setDisplayModeState(mode);
  };

  const setCognitiveAlerts = (enabled: boolean) => {
    setCognitiveAlertsState(enabled);
  };

  const setFocusIndicators = (type: 'standard' | 'enhanced') => {
    setFocusIndicatorsState(type);
  };

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
