import { useState, useEffect } from 'react';
import { LocalStoragePreferencesRepository } from '../../infrastructure/repositories/LocalStoragePreferencesRepository';
import { UpdateUserPreferencesUseCase } from '../../application/useCases/UpdateUserPreferencesUseCase';
import './ControlCard.css';

const repository = new LocalStoragePreferencesRepository();
const updatePreferencesUseCase = new UpdateUserPreferencesUseCase(repository);

export function FocusModeControl() {
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await repository.getPreferences();
      setFocusMode(prefs.focusMode);
    };
    loadPreferences();
  }, []);

  const handleFocusModeToggle = async () => {
    const newValue = !focusMode;
    setFocusMode(newValue);
    await updatePreferencesUseCase.execute({ focusMode: newValue });
    document.documentElement.setAttribute('data-focus-mode', newValue.toString());
  };

  return (
    <div className="control-card">
      <h3 className="control-card__title">
        <span role="img" aria-hidden="true">🎯</span> Modo Foco
      </h3>
      <p className="control-card__description">
        Reduz distrações e elementos não essenciais da interface
      </p>
      
      <div className="control-card__toggle">
        <button
          className={`toggle-button ${focusMode ? 'toggle-button--active' : ''}`}
          onClick={handleFocusModeToggle}
          aria-pressed={focusMode}
          role="switch"
        >
          <span className="toggle-button__track">
            <span className="toggle-button__thumb"></span>
          </span>
          <span className="toggle-button__label">
            {focusMode ? 'Ativado' : 'Desativado'}
          </span>
        </button>
      </div>

      {focusMode && (
        <div className="control-card__info">
          <p>✓ Modo foco ativo - distrações minimizadas</p>
        </div>
      )}
    </div>
  );
}
