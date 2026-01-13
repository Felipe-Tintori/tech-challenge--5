import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AccessibilityProvider, useAccessibility } from '../contexts/AccessibilityContext';

describe('ThemeContext', () => {
  it('should provide default theme values', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe('light');
    expect(result.current.fontSize).toBe('medium');
    expect(result.current.spacing).toBe('normal');
    expect(result.current.animationsEnabled).toBe(true);
  });

  it('should allow changing theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
  });

  it('should allow changing font size', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setFontSize('large');
    });

    expect(result.current.fontSize).toBe('large');
  });
});

describe('AccessibilityContext', () => {
  it('should provide default accessibility values', () => {
    const { result } = renderHook(() => useAccessibility(), {
      wrapper: AccessibilityProvider,
    });

    expect(result.current.focusMode).toBe(false);
    expect(result.current.complexityLevel).toBe('standard');
    expect(result.current.displayMode).toBe('detailed');
  });

  it('should allow changing focus mode', () => {
    const { result } = renderHook(() => useAccessibility(), {
      wrapper: AccessibilityProvider,
    });

    act(() => {
      result.current.setFocusMode(true);
    });

    expect(result.current.focusMode).toBe(true);
  });

  it('should allow changing complexity level', () => {
    const { result } = renderHook(() => useAccessibility(), {
      wrapper: AccessibilityProvider,
    });

    act(() => {
      result.current.setComplexityLevel('minimal');
    });

    expect(result.current.complexityLevel).toBe('minimal');
  });
});
