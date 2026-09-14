import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn, focusRing } from '@/lib/utils'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { isPathActive } from '@/lib/navigation'
import { useBotStore } from '@/state/useBotStore'
import { useSidebarStore } from '@/state/useSidebarStore'
import { NAV_ITEMS } from '../navItems'

export function Sidebar({ className }: { className?: string }) {
  const { collapsed, toggle } = useSidebarStore()
  const tenantName = useBotStore((s) => s.tenantName)
  const { pathname } = useLocation()

  // Tablet (768–1023px) always starts as an icon-rail, independent of the
  // desktop collapse toggle, and expands on hover or click per the spec.
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const [tabletExpanded, setTabletExpanded] = useState(false)
  const effectiveCollapsed = isTablet ? !tabletExpanded : collapsed

  return (
    <aside
      onMouseEnter={() => isTablet && setTabletExpanded(true)}
      onMouseLeave={() => isTablet && setTabletExpanded(false)}
      className={cn(
        'flex h-full flex-col border-r border-hairline bg-surface-card transition-[width] duration-200',
        effectiveCollapsed ? 'w-16' : 'w-60',
        className,
      )}
    >
      <div className="flex h-14 items-center border-b border-hairline px-3">
        {!effectiveCollapsed && (
          <p className="truncate text-card-title font-medium text-ink-primary">WebMind</p>
        )}
      </div>

      {tenantName && (
        <div
          className={cn(
            'flex items-center gap-2 border-b border-hairline p-2',
            effectiveCollapsed && 'justify-center',
          )}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-support-50 text-caption font-medium text-support-700">
            {tenantName.slice(0, 1)}
          </span>
          {!effectiveCollapsed && (
            <span className="min-w-0 flex-1 truncate text-meta font-medium text-ink-primary">
              {tenantName}
            </span>
          )}
        </div>
      )}

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => {
          const isActive = isPathActive(pathname, item.href)
          const link = (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body text-ink-secondary transition-colors',
                'hover:bg-surface-sunken hover:text-ink-primary',
                isActive && 'bg-surface-sunken text-ink-primary',
                effectiveCollapsed && 'justify-center px-0',
                focusRing,
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
              {!effectiveCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          )
          if (!effectiveCollapsed) return link
          return (
            <Tooltip key={item.href} delayDuration={200}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </nav>

      <div className="border-t border-hairline p-2">
        <button
          type="button"
          onClick={() => (isTablet ? setTabletExpanded((v) => !v) : toggle())}
          aria-label={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-md p-2 text-ink-muted hover:bg-surface-sunken hover:text-ink-primary',
            focusRing,
          )}
        >
          {effectiveCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  )
}
