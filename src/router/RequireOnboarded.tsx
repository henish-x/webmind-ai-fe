import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/state/useAuthStore'
import { useBotStore } from '@/state/useBotStore'

export function RequireOnboarded() {
  const session = useAuthStore((s) => s.session)
  const { bots, loading, loaded, loadBots } = useBotStore()

  useEffect(() => {
    if (session && !loaded && !loading) {
      loadBots(session.tenantId)
    }
  }, [session, loaded, loading, loadBots])

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-body text-ink-secondary">Loading…</div>
    )
  }

  const hasOnboardedBot = bots.some((b) => b.status !== 'draft')
  if (!hasOnboardedBot) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}
