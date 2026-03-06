import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from '../routes/AppRouter';

// Mock microfrontends (module federation)
jest.mock('painelCognitivo/App', () => () => <div>Painel Mock</div>, { virtual: true });
jest.mock('organizadorTarefas/App', () => () => <div>Tarefas Mock</div>, { virtual: true });
jest.mock('perfilUsuario/App', () => () => <div>Perfil Mock</div>, { virtual: true });

// Mock contexts
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../contexts/AccessibilityContext', () => ({
  useAccessibility: () => ({
    focusMode: false,
    setFocusMode: jest.fn(),
  }),
}));

const { useAuth } = require('../contexts/AuthContext');

describe('AppRouter', () => {
  it('redireciona para /login quando não autenticado', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, isLoading: false, user: null, logout: jest.fn() });

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText(/bem-vindo de volta/i)).toBeInTheDocument();
  });

  it('renderiza a HomePage quando autenticado na rota /', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', name: 'Felipe', email: 'felipe@test.com' },
      logout: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText(/bem-vindo ao mindease/i)).toBeInTheDocument();
  });

  it('renderiza o LoadingFallback quando está carregando', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, isLoading: true, user: null, logout: jest.fn() });

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renderiza a LoginPage na rota /login', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, isLoading: false, user: null, logout: jest.fn() });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText('MindEase')).toBeInTheDocument();
  });
});
