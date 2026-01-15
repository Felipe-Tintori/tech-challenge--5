import { useState, useEffect } from 'react';
import { FontSize } from '../../domain/entities/Preferences';
import { FirestorePreferencesRepository } from '../../infrastructure/repositories/FirestorePreferencesRepository';
import { UpdateUserPreferencesUseCase } from '../../application/useCases/UpdateUserPreferencesUseCase';
import './ControlCard.css';

const repository = new FirestorePreferencesRepository();
const updatePreferencesUseCase = new UpdateUserPreferencesUseCase(repository);

export function FontSizeControl() {
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await repository.getPreferences();
      setFontSize(prefs.fontSize);
    };
    loadPreferences();
  }, []);

  const handleFontSizeChange = async (newSize: FontSize) => {
    setFontSize(newSize);
    await updatePreferencesUseCase.execute({ fontSize: newSize });
    document.documentElement.setAttribute('data-font-size', newSize);
  };

  return (
    <div className="control-card">
      <h3 className="control-card__title">
        <span role="img" aria-hidden="true">🔤</span> Tamanho da Fonte
      </h3>
      <p className="control-card__description">
        Ajuste o tamanho do texto para facilitar a leitura
      </p>
      
      <div className="control-card__slider">
        <input
          type="range"
          min="0"
          max="3"
          value={['small', 'medium', 'large', 'extra-large'].indexOf(fontSize)}
          onChange={(e) => {
            const sizes: FontSize[] = ['small', 'medium', 'large', 'extra-large'];
            handleFontSizeChange(sizes[parseInt(e.target.value)]);
          }}
          className="control-card__slider-input"
          aria-label="Tamanho da fonte"
        />
        <div className="control-card__slider-labels">
          <span>Pequeno</span>
          <span>Médio</span>
          <span>Grande</span>
          <span>Extra Grande</span>
        </div>
      </div>
      
      <div className="control-card__preview">
        <span style={{ fontSize: fontSize === 'small' ? '14px' : fontSize === 'medium' ? '16px' : fontSize === 'large' ? '18px' : '20px' }}>
          Texto de exemplo
        </span>
      </div>
    </div>
  );
}
