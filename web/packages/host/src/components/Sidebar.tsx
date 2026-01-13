import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside className="sidebar" role="complementary" aria-label="Menu lateral">
      <nav className="sidebar__nav">
        <Link
          to="/"
          className={`sidebar__link ${isActive('/') && location.pathname === '/' ? 'sidebar__link--active' : ''}`}
          aria-current={location.pathname === '/' ? 'page' : undefined}
        >
          <span className="sidebar__icon" role="img" aria-hidden="true">🏠</span>
          <span className="sidebar__text">Início</span>
        </Link>

        <Link
          to="/painel"
          className={`sidebar__link ${isActive('/painel') ? 'sidebar__link--active' : ''}`}
          aria-current={isActive('/painel') ? 'page' : undefined}
        >
          <span className="sidebar__icon" role="img" aria-hidden="true">📊</span>
          <span className="sidebar__text">Dashboard</span>
        </Link>

        <Link
          to="/tarefas"
          className={`sidebar__link ${isActive('/tarefas') ? 'sidebar__link--active' : ''}`}
          aria-current={isActive('/tarefas') ? 'page' : undefined}
        >
          <span className="sidebar__icon" role="img" aria-hidden="true">✓</span>
          <span className="sidebar__text">Tarefas</span>
        </Link>

        <Link
          to="/perfil"
          className={`sidebar__link ${isActive('/perfil') ? 'sidebar__link--active' : ''}`}
          aria-current={isActive('/perfil') ? 'page' : undefined}
        >
          <span className="sidebar__icon" role="img" aria-hidden="true">⚙️</span>
          <span className="sidebar__text">Perfil</span>
        </Link>
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__help">
          <span className="sidebar__icon" role="img" aria-hidden="true">💡</span>
          <span className="sidebar__text">Dica: Use Tab para navegar</span>
        </div>
      </div>
    </aside>
  );
}
