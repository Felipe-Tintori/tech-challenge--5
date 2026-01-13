import { useState, useEffect } from 'react';
import { ComplexityLevel } from '../../domain/entities/Preferences';
import { LocalStoragePreferencesRepository } from '../../infrastructure/repositories/LocalStoragePreferencesRepository';
import { UpdateUserPreferencesUseCase } from '../../application/useCases/UpdateUserPreferencesUseCase';
import './ControlCard.css';

const repository = new LocalStoragePreferencesRepository();
const updatePreferencesUseCase = new UpdateUserPreferencesUseCase(repository);

export function ComplexityControl() {
  const [complexity, setComplexity] = useState<ComplexityLevel>('standard');

  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await repository.getPreferences();
      setComplexity(prefs.complexityLevel);
    };
    loadPreferences();
  }, []);

  const handleComplexityChange = async (newLevel: ComplexityLevel) => {
    setComplexity(newLevel);
    await updatePreferencesUseCase.execute({ complexityLevel: newLevel });
    document.documentElement.setAttribute('data-complexity', newLevel);
  };

  return (
    <div className="control-card">
      <h3 className="control-card__title">
        <span role="img" aria-hidden="true">🎚️</span> Nível de Complexidade
      </h3>
      <p className="control-card__description">
        Ajuste a quantidade de informação exibida simultaneamente
      </p>
      
      <div className="control-card__options control-card__options--vertical">
        <button
          className={`control-card__option control-card__option--full ${complexity === 'minimal' ? 'control-card__option--active' : ''}`}
          onClick={() => handleComplexityChange('minimal')}
          aria-pressed={complexity === 'minimal'}
        >
          <div>
            <span className="control-card__option-label">Mínimo</span>
            <span className="control-card__option-desc">Apenas o essencial</span>
          </div>
        </button>
        
        <button
          className={`control-card__option control-card__option--full ${complexity === 'simple' ? 'control-card__option--active' : ''}`}
          onClick={() => handleComplexityChange('simple')}
          aria-pressed={complexity === 'simple'}
        >
          <div>
            <span className="control-card__option-label">Simples</span>
            <span className="control-card__option-desc">Informações básicas</span>
          </div>
        </button>
        
        <button
          className={`control-card__option control-card__option--full ${complexity === 'standard' ? 'control-card__option--active' : ''}`}
          onClick={() => handleComplexityChange('standard')}
          aria-pressed={complexity === 'standard'}
        >
          <div>
            <span className="control-card__option-label">Padrão</span>
            <span className="control-card__option-desc">Balanceado</span>
          </div>
        </button>
        
        <button
          className={`control-card__option control-card__option--full ${complexity === 'detailed' ? 'control-card__option--active' : ''}`}
          onClick={() => handleComplexityChange('detailed')}
          aria-pressed={complexity === 'detailed'}
        >
          <div>
            <span className="control-card__option-label">Detalhado</span>
            <span className="control-card__option-desc">Todas as informações</span>
          </div>
        </button>
      </div>
    </div>
  );
}
