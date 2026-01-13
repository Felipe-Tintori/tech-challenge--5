import { useState, useEffect } from 'react';
import { SpacingMode } from '../../domain/entities/Preferences';
import { LocalStoragePreferencesRepository } from '../../infrastructure/repositories/LocalStoragePreferencesRepository';
import { UpdateUserPreferencesUseCase } from '../../application/useCases/UpdateUserPreferencesUseCase';
import './ControlCard.css';

const repository = new LocalStoragePreferencesRepository();
const updatePreferencesUseCase = new UpdateUserPreferencesUseCase(repository);

export function SpacingControl() {
  const [spacing, setSpacing] = useState<SpacingMode>('normal');

  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await repository.getPreferences();
      setSpacing(prefs.spacing);
    };
    loadPreferences();
  }, []);

  const handleSpacingChange = async (newSpacing: SpacingMode) => {
    setSpacing(newSpacing);
    await updatePreferencesUseCase.execute({ spacing: newSpacing });
    document.documentElement.setAttribute('data-spacing', newSpacing);
  };

  return (
    <div className="control-card">
      <h3 className="control-card__title">
        <span role="img" aria-hidden="true">📏</span> Espaçamento
      </h3>
      <p className="control-card__description">
        Controle o espaço entre elementos para reduzir sobrecarga visual
      </p>
      
      <div className="control-card__options">
        <button
          className={`control-card__option ${spacing === 'compact' ? 'control-card__option--active' : ''}`}
          onClick={() => handleSpacingChange('compact')}
          aria-pressed={spacing === 'compact'}
        >
          <span className="control-card__option-label">Compacto</span>
        </button>
        
        <button
          className={`control-card__option ${spacing === 'normal' ? 'control-card__option--active' : ''}`}
          onClick={() => handleSpacingChange('normal')}
          aria-pressed={spacing === 'normal'}
        >
          <span className="control-card__option-label">Normal</span>
        </button>
        
        <button
          className={`control-card__option ${spacing === 'comfortable' ? 'control-card__option--active' : ''}`}
          onClick={() => handleSpacingChange('comfortable')}
          aria-pressed={spacing === 'comfortable'}
        >
          <span className="control-card__option-label">Confortável</span>
        </button>
        
        <button
          className={`control-card__option ${spacing === 'spacious' ? 'control-card__option--active' : ''}`}
          onClick={() => handleSpacingChange('spacious')}
          aria-pressed={spacing === 'spacious'}
        >
          <span className="control-card__option-label">Espaçoso</span>
        </button>
      </div>
    </div>
  );
}
