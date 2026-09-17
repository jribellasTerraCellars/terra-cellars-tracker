import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Stats } from './pages/Stats'
import { Settings } from './pages/Settings'
import { Assets } from './pages/Assets'
import { Operations } from './pages/Operations'
import { Documentation } from './pages/Documentation'

function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] text-sm text-[var(--color-text-muted)]">
        Carregant...
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/actius"
        element={
          <RequireAuth>
            <Assets />
          </RequireAuth>
        }
      />
      <Route
        path="/operacions"
        element={
          <RequireAuth>
            <Operations />
          </RequireAuth>
        }
      />
      <Route
        path="/documentacio"
        element={
          <RequireAuth>
            <Documentation />
          </RequireAuth>
        }
      />
      <Route
        path="/estadistiques"
        element={
          <RequireAuth>
            <Stats />
          </RequireAuth>
        }
      />
      <Route
        path="/configuracio"
        element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
