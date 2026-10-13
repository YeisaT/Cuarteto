import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

export function RequireModule({ module }) {
  const { can } = useAuth()
  if (!can(module)) {
    return (
      <div className="alert warn">
        No tienes permiso para acceder a este módulo con tu rol actual.
      </div>
    )
  }
  return <Outlet />
}
