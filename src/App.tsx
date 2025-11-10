import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PresenceProvider } from "./contexts/PresenceContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Cursos from "./pages/Cursos";
import Turmas from "./pages/Turmas";
import Instrutores from "./pages/Instrutores";
import Certificados from "./pages/Certificados";
import Notas from "./pages/Notas";
import Horarios from "./pages/Horarios";
import Estatisticas from "./pages/Estatisticas";
import Relatorios from "./pages/Relatorios";
import Usuarios from "./pages/Usuarios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PresenceProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cursos"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Cursos />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/turmas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Turmas />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/instrutores"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Instrutores />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificados"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Certificados />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Notas />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/horarios"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Horarios />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estatisticas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Estatisticas />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/relatorios"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Relatorios />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Usuarios />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </PresenceProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
