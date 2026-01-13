import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import './Header.css';

export function Header() {
  const { user, logout } = useAuth();
  const { focusMode, setFocusMode } = useAccessibility();

  return (
    <header className="header" role="banner">
      <div className="header__container">
        <Link to="/" className="header__logo" aria-label="MindEase - Página inicial">
          <span className="header__logo-icon" role="img" aria-hidden="true">🧠</span>
          <span className="header__logo-text">MindEase</span>
        </Link>

        <nav className="header__nav" role="navigation" aria-label="Navegação principal">
          <Link to="/painel" className="header__nav-link">
            Dashboard
          </Link>
          <Link to="/tarefas" className="header__nav-link">
            Tarefas
          </Link>
          <Link to="/perfil" className="header__nav-link">
            Perfil
          </Link>
        </nav>

        <div className="header__actions">
          <button
            className={`header__focus-btn ${focusMode ? 'header__focus-btn--active' : ''}`}
            onClick={() => setFocusMode(!focusMode)}
            aria-label={focusMode ? 'Desativar modo foco' : 'Ativar modo foco'}
            title={focusMode ? 'Desativar modo foco' : 'Ativar modo foco'}
          >
            <span role="img" aria-hidden="true">🎯</span>
            {!focusMode && <span className="header__focus-text">Foco</span>}
          </button>

          <div className="header__user">
            <span className="header__user-name">{user?.name}</span>
            <button
              className="header__logout-btn"
              onClick={logout}
              aria-label="Sair da conta"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
