import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

// Mock react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock AuthContext
const mockLogin = jest.fn();
const mockRegister = jest.fn();

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Felipe', email: 'felipe@test.com' },
    isAuthenticated: true,
    isLoading: false,
    login: mockLogin,
    register: mockRegister,
    logout: jest.fn(),
  }),
}));

jest.mock('../contexts/AccessibilityContext', () => ({
  useAccessibility: () => ({
    focusMode: false,
    setFocusMode: jest.fn(),
  }),
}));

// ---- LoginPage ----
describe('LoginPage', () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockRegister.mockReset();
    mockNavigate.mockReset();
  });

  it('renderiza o formulário de login por padrão', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    expect(screen.getByText('Bem-vindo de volta!')).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  it('alterna para o formulário de cadastro', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    fireEvent.click(screen.getByText(/criar conta/i));
    expect(screen.getByText('Criar sua conta')).toBeInTheDocument();
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
  });

  it('chama login com email e senha ao submeter', async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('test@test.com', '123456'));
  });

  it('exibe erro quando login falha', async () => {
    mockLogin.mockRejectedValue({ code: 'auth/wrong-password' });
    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() =>
      expect(screen.getByText(/e-mail ou senha incorretos/i)).toBeInTheDocument()
    );
  });

  it('exibe erro de validação quando nome está vazio no cadastro', async () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    fireEvent.click(screen.getByText(/criar conta/i));

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } });
    // Dispara submit diretamente no form para bypass da validação HTML5 required
    const form = document.querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() =>
      expect(screen.getByText(/informe seu nome/i)).toBeInTheDocument()
    );
  });
});

// ---- HomePage ----
describe('HomePage', () => {
  it('renderiza o título de boas-vindas com o nome do usuário', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByText(/bem-vindo ao mindease, felipe/i)).toBeInTheDocument();
  });

  it('renderiza os cards de navegação', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByText('Painel Cognitivo')).toBeInTheDocument();
    expect(screen.getByText('Organizador de Tarefas')).toBeInTheDocument();
    expect(screen.getByText('Perfil e Configurações')).toBeInTheDocument();
  });

  it('renderiza os links de acesso rápido', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByText('Acessar Dashboard →')).toBeInTheDocument();
    expect(screen.getByText('Gerenciar Tarefas →')).toBeInTheDocument();
    expect(screen.getByText('Editar Perfil →')).toBeInTheDocument();
  });

  it('renderiza a seção de recursos de acessibilidade', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByText('Modo Foco')).toBeInTheDocument();
    expect(screen.getByText('Alto Contraste')).toBeInTheDocument();
  });
});
