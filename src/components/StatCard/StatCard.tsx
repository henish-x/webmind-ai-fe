import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AccentColor = 'support' | 'sales' | 'danger' | 'warning' | 'success' | 'none'

const ACCENT_BAR: Record<AccentColor, string> = {
  support: 'bg-support-500',
  sales: 'bg-sales-500',
  danger: 'bg-danger',
  warning: 'bg-warning',
  success: 'bg-success',
  none: 'bg-transparent',
}

const ACCENT_TEXT: Record<AccentColor, string> = {
  support: 'text-support-700',
  sales: 'text-sales-700',
  danger: 'text-danger',
  warning: 'text-warning',
  success: 'text-success',
  none: 'text-ink-primary',
}

export interface StatCardProps {
  label: string
  value: string | number
  delta?: number
  accent?: AccentColor
  href?: string
  onClick?: () => void
  className?: string
}

export function StatCard({ label, value, delta, accent = 'none', href, onClick, className }: StatCardProps) {
  const interactive = Boolean(href || onClick)
  const Comp = href ? 'a' : 'div'

  return (
    <Comp
      href={href}
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-3 overflow-hidden rounded-lg border border-hairline bg-surface-card p-4',
        interactive && 'cursor-pointer transition-colors hover:bg-surface-sunken',
        className,
      )}
    >
      {accent !== 'none' && <span className={cn('absolute inset-y-0 left-0 w-0.5', ACCENT_BAR[accent])} aria-hidden />}
      <div className="min-w-0 pl-2">
        <p className="text-meta text-ink-secondary">{label}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className={cn('text-page-title font-medium', ACCENT_TEXT[accent])}>{value}</p>
          {typeof delta === 'number' && (
            <span
              className={cn(
                'flex items-center gap-0.5 text-caption font-medium',
                delta >= 0 ? 'text-success' : 'text-danger',
              )}
            >
              {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(delta)}%
            </span>
          )}
        </div>
      </div>
    </Comp>
  )
}
