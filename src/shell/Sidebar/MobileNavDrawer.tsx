import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn, focusRing } from '@/lib/utils'
import { isPathActive } from '@/lib/navigation'
import { useBotStore } from '@/state/useBotStore'
import { NAV_ITEMS } from '../navItems'

export interface MobileNavDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNavDrawer({ open, onOpenChange }: MobileNavDrawerProps) {
  const tenantName = useBotStore((s) => s.tenantName)
  const { pathname } = useLocation()

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-primary/40 data-[state=open]:animate-fade" />
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-surface-card',
            'data-[state=open]:animate-fade',
          )}
        >
          <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
          <div className="flex h-14 items-center justify-between border-b border-hairline px-4">
            <p className="text-card-title font-medium text-ink-primary">WebMind</p>
            <DialogPrimitive.Close
              className={cn('rounded-md p-1.5 text-ink-muted hover:text-ink-primary', focusRing)}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>

          {tenantName && (
            <div className="flex items-center gap-2 border-b border-hairline px-3 py-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-support-50 text-caption font-medium text-support-700">
                {tenantName.slice(0, 1)}
              </span>
              <span className="min-w-0 flex-1 truncate text-meta font-medium text-ink-primary">
                {tenantName}
              </span>
            </div>
          )}

          <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body text-ink-secondary',
                  isPathActive(pathname, item.href) && 'bg-surface-sunken text-ink-primary',
                  focusRing,
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
