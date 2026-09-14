import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/state/useAuthStore'

export function RequireAuth() {
  const session = useAuthStore((s) => s.session)
  const location = useLocation()

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
