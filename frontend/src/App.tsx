import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MemberDashboardPage } from './pages/MemberDashboardPage';

type BackendStatus = { 'Connection Status'?: string };

function AppShell() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/member');

  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('http://localhost:8000/', { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as BackendStatus;
      })
      .then(setBackendStatus)
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setBackendError(err instanceof Error ? err.message : 'Failed to reach backend');
      });
    return () => controller.abort();
  }, []);

  return (
    <div className={isDashboard ? 'dash-page' : 'page'}>
      {!isDashboard && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage backendStatus={backendStatus} backendError={backendError} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member"
          element={
            <ProtectedRoute>
              <MemberDashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isDashboard && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}