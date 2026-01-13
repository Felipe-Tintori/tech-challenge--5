import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAccessibility } from '../contexts/AccessibilityContext';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { focusMode } = useAccessibility();

  return (
    <div className={`layout ${focusMode ? 'layout--focus-mode' : ''}`}>
      <Header />
      <div className="layout__container">
        {!focusMode && <Sidebar />}
        <main id="main-content" className="layout__main" role="main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
