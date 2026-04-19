import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Track } from './pages/Track';
import { Profile } from './pages/Profile';
import { Upload } from './pages/Upload';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { token, loadUser } = useAuthStore();

  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token, loadUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/track/:id" element={<Track />} />
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route path="/user/:id" element={<Navigate to="/profile/:id" replace />} />

                  <Route
                    path="/upload"
                    element={
                      <ProtectedRoute>
                        <Upload />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/library"
                    element={
                      <ProtectedRoute>
                        <div style={{ padding: '48px', textAlign: 'center', color: '#999' }}>
                          <h2>Library - Coming Soon</h2>
                        </div>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <div style={{ padding: '48px', textAlign: 'center', color: '#999' }}>
                          <h2>Settings - Coming Soon</h2>
                        </div>
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
