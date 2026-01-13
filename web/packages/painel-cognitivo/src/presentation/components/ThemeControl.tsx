import { useState, useEffect } from 'react';
import { ThemeMode } from '../../domain/entities/Preferences';
import { LocalStoragePreferencesRepository } from '../../infrastructure/repositories/LocalStoragePreferencesRepository';
import { UpdateUserPreferencesUseCase } from '../../application/useCases/UpdateUserPreferencesUseCase';
import './ControlCard.css';

const repository = new LocalStoragePreferencesRepository();
const updatePreferencesUseCase = new UpdateUserPreferencesUseCase(repository);

export function ThemeControl() {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await repository.getPreferences();
      setTheme(prefs.theme);
    };
    loadPreferences();
  }, []);

  const handleThemeChange = async (newTheme: ThemeMode) => {
    setTheme(newTheme);
    await updatePreferencesUseCase.execute({ theme: newTheme });
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="control-card">
      <h3 className="control-card__title">
        <span role="img" aria-hidden="true">🎨</span> Tema
      </h3>
      <p className="control-card__description">
        Escolha o tema que melhor atende às suas necessidades visuais
      </p>
      
      <div className="control-card__options">
        <button
          className={`control-card__option ${theme === 'light' ? 'control-card__option--active' : ''}`}
          onClick={() => handleThemeChange('light')}
          aria-pressed={theme === 'light'}
        >
          <span className="control-card__option-icon">☀️</span>
          <span className="control-card__option-label">Claro</span>
        </button>
        
        <button
          className={`control-card__option ${theme === 'dark' ? 'control-card__option--active' : ''}`}
          onClick={() => handleThemeChange('dark')}
          aria-pressed={theme === 'dark'}
        >
          <span className="control-card__option-icon">🌙</span>
          <span className="control-card__option-label">Escuro</span>
        </button>
        
        <button
          className={`control-card__option ${theme === 'high-contrast' ? 'control-card__option--active' : ''}`}
          onClick={() => handleThemeChange('high-contrast')}
          aria-pressed={theme === 'high-contrast'}
        >
          <span className="control-card__option-icon">⚡</span>
          <span className="control-card__option-label">Alto Contraste</span>
        </button>
      </div>
    </div>
  );
}
