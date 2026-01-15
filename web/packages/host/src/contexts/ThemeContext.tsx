import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreDb } from '../config/firebase';

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
  const [theme, setThemeState] = useState<'light' | 'dark' | 'high-contrast'>('light');
  const [fontSize, setFontSizeState] = useState<'medium' | 'large' | 'extra-large'>('medium');
  const [spacing, setSpacingState] = useState<'normal' | 'comfortable' | 'spacious'>('normal');
  const [animationsEnabled, setAnimationsEnabledState] = useState(true);
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
        const docRef = doc(db, 'theme_preferences', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setThemeState(data.theme || 'light');
          setFontSizeState(data.fontSize || 'medium');
          setSpacingState(data.spacing || 'normal');
          setAnimationsEnabledState(data.animationsEnabled !== false);
        }
      } catch (error) {
        console.error('Error loading theme preferences:', error);
      }

      setIsLoaded(true);
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      loadPreferences();
    });

    return () => unsubscribe();
  }, [auth, db]);

  // Save preferences to Firestore
  const savePreferences = async (data: any) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'theme_preferences', user.uid);
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving theme preferences:', error);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font-size', fontSize);
    document.documentElement.setAttribute('data-spacing', spacing);
    document.documentElement.setAttribute('data-reduced-motion', (!animationsEnabled).toString());

    // Save to Firestore
    savePreferences({ theme, fontSize, spacing, animationsEnabled });
  }, [theme, fontSize, spacing, animationsEnabled, isLoaded]);

  const setTheme = (newTheme: 'light' | 'dark' | 'high-contrast') => {
    setThemeState(newTheme);
  };

  const setFontSize = (size: 'medium' | 'large' | 'extra-large') => {
    setFontSizeState(size);
  };

  const setSpacing = (newSpacing: 'normal' | 'comfortable' | 'spacious') => {
    setSpacingState(newSpacing);
  };

  const toggleAnimations = () => {
    setAnimationsEnabledState(!animationsEnabled);
  };

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
