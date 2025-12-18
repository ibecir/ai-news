import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/context/authStore';

// Components
import { LoginForm } from '@/components/auth/LoginForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { LinksList } from '@/components/links/LinksList';
import { AddLink } from '@/components/links/AddLink';
import { LinkDetail } from '@/components/links/LinkDetail';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AppRoutes() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />}
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/links"
        element={
          <ProtectedRoute>
            <LinksList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/links/new"
        element={
          <ProtectedRoute>
            <AddLink />
          </ProtectedRoute>
        }
      />
      <Route
        path="/links/:id"
        element={
          <ProtectedRoute>
            <LinkDetail />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to dashboard or login */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/news">
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;