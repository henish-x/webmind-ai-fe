import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '@/features/marketing/components/Footer'
import { Nav } from '@/features/marketing/components/Nav'

export function MarketingLayout() {
  const { pathname, hash } = useLocation()

  // This page has its own fixed light/dark section design (per the brief) —
  // it doesn't participate in the dashboard's user-toggleable theme. Force
  // light while mounted so a visitor who previously used the dashboard in
  // dark mode doesn't see marketing's "light" sections render dark; restore
  // whatever they had on unmount so returning to the app respects it again.
  useEffect(() => {
    const previous = document.documentElement.getAttribute('data-theme')
    document.documentElement.setAttribute('data-theme', 'light')
    return () => {
      if (previous) document.documentElement.setAttribute('data-theme', previous)
      else document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        // Let the route render first so layout/height is settled before measuring scroll position.
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return (
    <div className="min-h-screen bg-surface-page">
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
