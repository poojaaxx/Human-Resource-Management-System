import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './ui/Loader'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader label="Checking your session…" />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}
