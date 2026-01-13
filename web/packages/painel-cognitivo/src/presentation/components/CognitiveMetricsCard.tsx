import './ControlCard.css';

export function CognitiveMetricsCard() {
  // Mock data - em produção viria de uma API ou repositório
  const metrics = {
    focusTimeToday: 120,
    tasksCompletedToday: 5,
    averageSessionLength: 25,
    productivityScore: 78,
    streakDays: 7,
  };

  return (
    <div className="metrics-card">
      <div className="metrics-card__grid">
        <div className="metric-item">
          <div className="metric-item__icon">⏱️</div>
          <div className="metric-item__content">
            <div className="metric-item__value">{metrics.focusTimeToday} min</div>
            <div className="metric-item__label">Tempo em Foco Hoje</div>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-item__icon">✓</div>
          <div className="metric-item__content">
            <div className="metric-item__value">{metrics.tasksCompletedToday}</div>
            <div className="metric-item__label">Tarefas Concluídas</div>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-item__icon">📊</div>
          <div className="metric-item__content">
            <div className="metric-item__value">{metrics.averageSessionLength} min</div>
            <div className="metric-item__label">Sessão Média</div>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-item__icon">🎯</div>
          <div className="metric-item__content">
            <div className="metric-item__value">{metrics.productivityScore}%</div>
            <div className="metric-item__label">Score de Produtividade</div>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-item__icon">🔥</div>
          <div className="metric-item__content">
            <div className="metric-item__value">{metrics.streakDays} dias</div>
            <div className="metric-item__label">Sequência Atual</div>
          </div>
        </div>
      </div>

      <div className="metrics-card__insight">
        <h4>💡 Insight do Dia</h4>
        <p>
          Você está mantendo uma ótima sequência! Continue assim para desenvolver 
          hábitos produtivos consistentes.
        </p>
      </div>
    </div>
  );
}
