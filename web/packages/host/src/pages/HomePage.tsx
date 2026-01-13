import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="home-page__hero">
        <h1 className="home-page__title">
          Bem-vindo ao MindEase, {user?.name}! 👋
        </h1>
        <p className="home-page__subtitle">
          Sua plataforma de acessibilidade cognitiva para facilitar o aprendizado e a produtividade
        </p>
      </section>

      <section className="home-page__cards">
        <Link to="/painel" className="home-card">
          <div className="home-card__icon">📊</div>
          <h2 className="home-card__title">Painel Cognitivo</h2>
          <p className="home-card__description">
            Personalize sua experiência com controles de acessibilidade, modo foco e preferências visuais
          </p>
          <span className="home-card__cta">Acessar Dashboard →</span>
        </Link>

        <Link to="/tarefas" className="home-card">
          <div className="home-card__icon">✓</div>
          <h2 className="home-card__title">Organizador de Tarefas</h2>
          <p className="home-card__description">
            Gerencie suas atividades com Kanban visual, timer Pomodoro e checklists inteligentes
          </p>
          <span className="home-card__cta">Gerenciar Tarefas →</span>
        </Link>

        <Link to="/perfil" className="home-card">
          <div className="home-card__icon">⚙️</div>
          <h2 className="home-card__title">Perfil e Configurações</h2>
          <p className="home-card__description">
            Configure suas preferências, rotinas e necessidades específicas de acessibilidade
          </p>
          <span className="home-card__cta">Editar Perfil →</span>
        </Link>
      </section>

      <section className="home-page__features">
        <h2 className="home-page__features-title">Recursos de Acessibilidade Cognitiva</h2>
        <div className="home-page__features-grid">
          <div className="feature-item">
            <span className="feature-item__icon">🎯</span>
            <h3 className="feature-item__title">Modo Foco</h3>
            <p className="feature-item__text">Reduza distrações e concentre-se no essencial</p>
          </div>

          <div className="feature-item">
            <span className="feature-item__icon">🎨</span>
            <h3 className="feature-item__title">Alto Contraste</h3>
            <p className="feature-item__text">Ajuste cores e contrastes para melhor legibilidade</p>
          </div>

          <div className="feature-item">
            <span className="feature-item__icon">📏</span>
            <h3 className="feature-item__title">Espaçamento Ajustável</h3>
            <p className="feature-item__text">Customize o espaçamento entre elementos</p>
          </div>

          <div className="feature-item">
            <span className="feature-item__icon">🔤</span>
            <h3 className="feature-item__title">Tamanho de Fonte</h3>
            <p className="feature-item__text">Aumente ou diminua o texto conforme necessário</p>
          </div>

          <div className="feature-item">
            <span className="feature-item__icon">⏱️</span>
            <h3 className="feature-item__title">Timer Pomodoro</h3>
            <p className="feature-item__text">Gerencie seu tempo com técnicas comprovadas</p>
          </div>

          <div className="feature-item">
            <span className="feature-item__icon">🔔</span>
            <h3 className="feature-item__title">Alertas Cognitivos</h3>
            <p className="feature-item__text">Receba lembretes suaves e pausas programadas</p>
          </div>
        </div>
      </section>
    </div>
  );
}
