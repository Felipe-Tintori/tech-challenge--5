import './LoadingFallback.css';

export function LoadingFallback() {
  return (
    <div className="loading-fallback" role="status" aria-live="polite">
      <div className="loading-fallback__spinner"></div>
      <p className="loading-fallback__text">Carregando módulo...</p>
      <span className="sr-only">Por favor, aguarde enquanto o conteúdo é carregado</span>
    </div>
  );
}
