import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import HrAccounts from './pages/HrAccounts'
import Attendance from './pages/Attendance'
import Leaves from './pages/Leaves'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function AuthRedirect({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

// Employees cannot view the Employees directory or HR-only pages at all —
// route-level enforcement so it's not just a hidden nav link.
function RoleGate({ allow, children }) {
  const { user } = useAuth()
  if (!allow.includes(user?.role)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthRedirect>
            <Login />
          </AuthRedirect>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRedirect>
            <Register />
          </AuthRedirect>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/employees"
          element={
            <RoleGate allow={['ADMIN', 'HR']}>
              <Employees />
            </RoleGate>
          }
        />
        <Route
          path="/hr-accounts"
          element={
            <RoleGate allow={['ADMIN']}>
              <HrAccounts />
            </RoleGate>
          }
        />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '10px',
              background: '#14161F',
              color: '#fff',
              fontSize: '14px',
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
