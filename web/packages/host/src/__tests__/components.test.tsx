import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoadingFallback } from '../components/LoadingFallback';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Layout } from '../components/Layout';

// Mock contexts
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Felipe', email: 'felipe@test.com' },
    isAuthenticated: true,
    isLoading: false,
    logout: jest.fn(),
  }),
}));

jest.mock('../contexts/AccessibilityContext', () => ({
  useAccessibility: () => ({
    focusMode: false,
    setFocusMode: jest.fn(),
    complexityLevel: 'standard',
    cognitiveAlerts: true,
  }),
}));

// ---- LoadingFallback ----
describe('LoadingFallback', () => {
  it('renderiza o spinner e o texto de carregamento', () => {
    render(<LoadingFallback />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Carregando módulo...')).toBeInTheDocument();
  });

  it('tem texto acessível para screen readers', () => {
    render(<LoadingFallback />);
    expect(screen.getByText('Por favor, aguarde enquanto o conteúdo é carregado')).toBeInTheDocument();
  });
});

// ---- ErrorBoundary ----
const ThrowError = () => {
  throw new Error('Erro de teste');
};

describe('ErrorBoundary', () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterAll(() => consoleSpy.mockRestore());

  it('renderiza os filhos quando não há erro', () => {
    render(
      <ErrorBoundary>
        <span>Conteúdo normal</span>
      </ErrorBoundary>
    );
    expect(screen.getByText('Conteúdo normal')).toBeInTheDocument();
  });

  it('renderiza a UI de erro quando um filho lança exceção', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/algo deu errado/i)).toBeInTheDocument();
  });

  it('exibe a mensagem do erro', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Erro de teste/i)).toBeInTheDocument();
  });
});

// ---- Header ----
describe('Header', () => {
  it('renderiza o logo MindEase', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.getByText('MindEase')).toBeInTheDocument();
  });

  it('renderiza os links de navegação', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tarefas')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
  });

  it('renderiza o nome do usuário', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.getByText('Felipe')).toBeInTheDocument();
  });

  it('renderiza o botão de sair', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /sair da conta/i })).toBeInTheDocument();
  });
});

// ---- Sidebar ----
describe('Sidebar', () => {
  it('renderiza os links de navegação lateral', () => {
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tarefas')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
  });

  it('renderiza a dica de navegação por teclado', () => {
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    expect(screen.getByText(/Use Tab para navegar/i)).toBeInTheDocument();
  });
});

// ---- Layout ----
describe('Layout', () => {
  it('renderiza o header e o conteúdo filho', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Conteúdo da página</div>
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByText('MindEase')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo da página')).toBeInTheDocument();
  });

  it('renderiza a sidebar quando focusMode é false', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>conteudo</div>
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });
});
