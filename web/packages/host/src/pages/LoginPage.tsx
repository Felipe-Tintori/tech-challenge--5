import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name.trim()) {
          setError('Por favor, informe seu nome');
          setIsLoading(false);
          return;
        }
        await register(name, email, password);
      }
      navigate('/');
    } catch (err) {
      setError('Erro ao processar sua solicitação. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__header">
          <div className="login-page__logo">
            <span className="login-page__logo-icon" role="img" aria-hidden="true">🧠</span>
            <span className="login-page__logo-text">MindEase</span>
          </div>
          <h1 className="login-page__title">
            {isLogin ? 'Bem-vindo de volta!' : 'Criar sua conta'}
          </h1>
          <p className="login-page__subtitle">
            {isLogin 
              ? 'Acesse sua plataforma de acessibilidade cognitiva' 
              : 'Junte-se ao MindEase e personalize sua experiência'}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-form__error" role="alert">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="login-form__field">
              <label htmlFor="name" className="login-form__label">
                Nome completo
              </label>
              <input
                type="text"
                id="name"
                className="login-form__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                placeholder="Digite seu nome"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="login-form__field">
            <label htmlFor="email" className="login-form__label">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className="login-form__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>

          <div className="login-form__field">
            <label htmlFor="password" className="login-form__label">
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="login-form__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="login-form__submit"
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar conta')}
          </button>

          <div className="login-form__toggle">
            <span>
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            </span>
            <button
              type="button"
              className="login-form__toggle-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              disabled={isLoading}
            >
              {isLogin ? 'Criar conta' : 'Fazer login'}
            </button>
          </div>
        </form>

        <div className="login-page__demo">
          <p className="login-page__demo-text">
            💡 <strong>Dica:</strong> Esta é uma versão demo. Use qualquer e-mail e senha para acessar.
          </p>
        </div>
      </div>
    </div>
  );
}
