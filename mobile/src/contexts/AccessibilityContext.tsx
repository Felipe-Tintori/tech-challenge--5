import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export type ComplexityLevel = 'minimal' | 'simple' | 'standard' | 'detailed';
export type DisplayMode = 'resume' | 'detailed';

interface AccessibilityContextType {
  focusMode: boolean;
  complexityLevel: ComplexityLevel;
  displayMode: DisplayMode;
  cognitiveAlerts: boolean;
  reducedMotion: boolean;
  setFocusMode: (v: boolean) => void;
  setComplexityLevel: (v: ComplexityLevel) => void;
  setDisplayMode: (v: DisplayMode) => void;
  setCognitiveAlerts: (v: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [focusMode, setFocusModeState] = useState(false);
  const [complexityLevel, setComplexityLevelState] = useState<ComplexityLevel>('standard');
  const [displayMode, setDisplayModeState] = useState<DisplayMode>('detailed');
  const [cognitiveAlerts, setCognitiveAlertsState] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.id)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.focusMode !== undefined) setFocusModeState(d.focusMode);
        if (d.complexityLevel) setComplexityLevelState(d.complexityLevel);
        if (d.displayMode) setDisplayModeState(d.displayMode);
        if (d.cognitiveAlerts !== undefined) setCognitiveAlertsState(d.cognitiveAlerts);
      }
    });
  }, [user]);

  const persist = async (data: object) => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.id), data, { merge: true });
  };

  const setFocusMode = (v: boolean) => { setFocusModeState(v); persist({ focusMode: v }); };
  const setComplexityLevel = (v: ComplexityLevel) => { setComplexityLevelState(v); persist({ complexityLevel: v }); };
  const setDisplayMode = (v: DisplayMode) => { setDisplayModeState(v); persist({ displayMode: v }); };
  const setCognitiveAlerts = (v: boolean) => { setCognitiveAlertsState(v); persist({ cognitiveAlerts: v }); };

  return (
    <AccessibilityContext.Provider value={{
      focusMode, complexityLevel, displayMode, cognitiveAlerts, reducedMotion: false,
      setFocusMode, setComplexityLevel, setDisplayMode, setCognitiveAlerts,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
