import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn, focusRing } from '@/lib/utils'
import { isPathActive } from '@/lib/navigation'

export interface SubNavItem {
  label: string
  to: string
}

export function SubNavLayout({ title, items, children }: { title: string; items: SubNavItem[]; children: ReactNode }) {
  const { pathname } = useLocation()

  return (
    <div>
      <p className="mb-6 text-page-title font-medium text-ink-primary">{title}</p>
      <div className="flex flex-col gap-8 md:flex-row">
        <nav className="flex shrink-0 gap-1 overflow-x-auto md:w-48 md:flex-col md:overflow-visible">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={cn(
                'whitespace-nowrap rounded-md px-3 py-2 text-meta text-ink-secondary',
                isPathActive(pathname, item.to, true) ? 'bg-surface-sunken text-ink-primary font-medium' : 'hover:bg-surface-sunken',
                focusRing,
              )}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
