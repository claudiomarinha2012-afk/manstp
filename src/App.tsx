import React, { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PresenceProvider } from "./contexts/PresenceContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import LoadingSpinner from "./components/LoadingSpinner"; // Componente de carregamento
import ErrorBoundary from "./components/ErrorBoundary"; // Componente para tratamento de erros

// Carregamento preguiçoso (lazy loading) das páginas
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Cursos = lazy(() => import("./pages/Cursos"));
const Turmas = lazy(() => import("./pages/Turmas"));
const Instrutores = lazy(() => import("./pages/Instrutores"));
const Certificados = lazy(() => import("./pages/Certificados"));
const Notas = lazy(() => import("./pages/Notas"));
const Horarios = lazy(() => import("./pages/Horarios"));
const Estatisticas = lazy(() => import("./pages/Estatisticas"));
const Relatorios = lazy(() => import("./pages/Relatorios"));
const Usuarios = lazy(() => import("./pages/Usuarios"));
const Presencas = lazy(() => import("./pages/Presencas"));
const NotasPessoais = lazy(() => import("./pages/NotasPessoais"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Componente para gerenciar navegação automática para última rota
const RouteManager = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Salvar a rota atual no localStorage (exceto /auth)
    if (location.pathname !== "/auth") {
      localStorage.setItem("lastVisitedRoute", location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Redirecionar para a última rota visitada apenas na primeira carga
    const lastRoute = localStorage.getItem("lastVisitedRoute");
    if (location.pathname === "/" && lastRoute && lastRoute !== "/") {
      navigate(lastRoute, { replace: true });
    }
  }, []);

  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PresenceProvider>
            <RouteManager>
              <Routes>
                <Route 
                  path="/auth" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary>
                        <Auth />
                      </ErrorBoundary>
                    </Suspense>
                  } 
                />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Suspense fallback={<LoadingSpinner />}>
                          <ErrorBoundary>
                            <Dashboard />
                          </ErrorBoundary>
                        </Suspense>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
            <Route
              path="/cursos"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary>
                        <Cursos />
                      </ErrorBoundary>
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/turmas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary>
                        <Turmas />
                      </ErrorBoundary>
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/instrutores"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary>
                        <Instrutores />
                      </ErrorBoundary>
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificados"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary>
                        <Certificados />
                      </ErrorBoundary>
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary>
                        <Notas />
                      </ErrorBoundary>
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/horarios"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary>
                        <Horarios />
                      </ErrorBoundary>
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estatisticas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary>
                        <Estatisticas />
                      </ErrorBoundary>
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/relatorios"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary>
                        <Relatorios />
                      </ErrorBoundary>
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary>
                        <Usuarios />
                      </ErrorBoundary>
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/presencas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary>
                        <Presencas />
                      </ErrorBoundary>
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notas-pessoais"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary>
                        <NotasPessoais />
                      </ErrorBoundary>
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route 
                  path="*" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary>
                        <NotFound />
                      </ErrorBoundary>
                    </Suspense>
                  } 
                />
              </Routes>
            </RouteManager>
          </PresenceProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
