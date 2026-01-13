import { useState } from 'react';
import { ThemeControl } from '../components/ThemeControl';
import { FontSizeControl } from '../components/FontSizeControl';
import { SpacingControl } from '../components/SpacingControl';
import { FocusModeControl } from '../components/FocusModeControl';
import { ComplexityControl } from '../components/ComplexityControl';
import { CognitiveMetricsCard } from '../components/CognitiveMetricsCard';
import './DashboardPage.css';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'visual' | 'cognitive' | 'metrics'>('visual');

  return (
    <div className="dashboard-page">
      <header className="dashboard-page__header">
        <h1 className="dashboard-page__title">
          <span role="img" aria-hidden="true">📊</span> Painel Cognitivo Personalizado
        </h1>
        <p className="dashboard-page__subtitle">
          Ajuste sua experiência para máximo conforto e produtividade
        </p>
      </header>

      <div className="dashboard-page__tabs">
        <button
          className={`dashboard-page__tab ${activeTab === 'visual' ? 'dashboard-page__tab--active' : ''}`}
          onClick={() => setActiveTab('visual')}
          aria-selected={activeTab === 'visual'}
          role="tab"
        >
          🎨 Preferências Visuais
        </button>
        <button
          className={`dashboard-page__tab ${activeTab === 'cognitive' ? 'dashboard-page__tab--active' : ''}`}
          onClick={() => setActiveTab('cognitive')}
          aria-selected={activeTab === 'cognitive'}
          role="tab"
        >
          🧠 Suporte Cognitivo
        </button>
        <button
          className={`dashboard-page__tab ${activeTab === 'metrics' ? 'dashboard-page__tab--active' : ''}`}
          onClick={() => setActiveTab('metrics')}
          aria-selected={activeTab === 'metrics'}
          role="tab"
        >
          📈 Métricas & Insights
        </button>
      </div>

      <div className="dashboard-page__content" role="tabpanel">
        {activeTab === 'visual' && (
          <div className="dashboard-page__section">
            <h2 className="dashboard-page__section-title">Controles de Aparência</h2>
            <div className="dashboard-page__controls-grid">
              <ThemeControl />
              <FontSizeControl />
              <SpacingControl />
            </div>
          </div>
        )}

        {activeTab === 'cognitive' && (
          <div className="dashboard-page__section">
            <h2 className="dashboard-page__section-title">Configurações Cognitivas</h2>
            <div className="dashboard-page__controls-grid">
              <FocusModeControl />
              <ComplexityControl />
            </div>
            
            <div className="dashboard-page__info-card">
              <h3>💡 Sobre o Suporte Cognitivo</h3>
              <p>
                Essas configurações foram desenvolvidas especialmente para pessoas com TDAH, TEA, 
                Dislexia e outras necessidades cognitivas. Experimente diferentes combinações 
                até encontrar o que funciona melhor para você.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="dashboard-page__section">
            <h2 className="dashboard-page__section-title">Suas Métricas</h2>
            <CognitiveMetricsCard />
          </div>
        )}
      </div>
    </div>
  );
}
