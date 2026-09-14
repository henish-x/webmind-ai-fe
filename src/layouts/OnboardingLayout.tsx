import { Outlet } from 'react-router-dom'

export function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-surface-page">
      <header className="border-b border-hairline px-6 py-4">
        <p className="text-card-title font-medium text-ink-primary">WebMind</p>
      </header>
      <main className="px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}
