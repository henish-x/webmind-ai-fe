import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center text-card-title font-medium text-ink-primary">WebMind</p>
        <Outlet />
      </div>
    </div>
  )
}
