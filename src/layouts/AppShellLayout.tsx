import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/shell/Sidebar'
import { Topbar } from '@/shell/Topbar'

export function AppShellLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-page">
      <Sidebar className="hidden md:flex" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
