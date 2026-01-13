import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { LoadingFallback } from '../components/LoadingFallback';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

// Lazy load microfrontends
const PainelCognitivo = lazy(() => import('painelCognitivo/App'));
const OrganizadorTarefas = lazy(() => import('organizadorTarefas/App'));
const PerfilUsuario = lazy(() => import('perfilUsuario/App'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                
                <Route
                  path="/painel/*"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <PainelCognitivo />
                    </Suspense>
                  }
                />
                
                <Route
                  path="/tarefas/*"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <OrganizadorTarefas />
                    </Suspense>
                  }
                />
                
                <Route
                  path="/perfil/*"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <PerfilUsuario />
                    </Suspense>
                  }
                />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
