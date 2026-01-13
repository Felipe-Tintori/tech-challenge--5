import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'var(--color-background)',
        }}>
          <div style={{
            maxWidth: '600px',
            padding: '2rem',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '1rem', color: 'var(--color-error-500)' }}>
              ⚠️ Algo deu errado
            </h1>
            <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
              Desculpe, ocorreu um erro inesperado. Por favor, tente novamente.
            </p>
            
            {this.state.error && (
              <details style={{ 
                marginBottom: '2rem', 
                textAlign: 'left',
                padding: '1rem',
                backgroundColor: 'var(--color-neutral-100)',
                borderRadius: 'var(--radius-base)',
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'var(--font-weight-semibold)' }}>
                  Detalhes do erro
                </summary>
                <pre style={{ 
                  marginTop: '1rem', 
                  fontSize: 'var(--font-size-sm)',
                  overflow: 'auto',
                  padding: '1rem',
                  backgroundColor: 'var(--color-neutral-50)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            
            <button
              onClick={this.handleReset}
              style={{
                padding: '0.75rem 2rem',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'white',
                backgroundColor: 'var(--color-primary-600)',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                cursor: 'pointer',
                transition: 'background-color var(--transition-fast)',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-700)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-600)'}
            >
              Voltar à página inicial
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
