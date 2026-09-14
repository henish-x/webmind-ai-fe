import { cn } from '@/lib/utils'

export type LaneValue = 'support' | 'sales' | 'both' | 'other'

const LANE_STYLES: Record<LaneValue, { bg: string; text: string; label: string }> = {
  support: { bg: 'bg-support-50', text: 'text-support-700', label: 'Support' },
  sales: { bg: 'bg-sales-50', text: 'text-sales-700', label: 'Sales' },
  both: { bg: 'bg-surface-sunken', text: 'text-ink-secondary', label: 'Support + Sales' },
  other: { bg: 'bg-surface-sunken', text: 'text-ink-muted', label: 'Other' },
}

export interface LaneBadgeProps {
  lane: LaneValue
  className?: string
}

/**
 * The dual-workflow concept made visible: color always pairs with a text label
 * (never color-only) so lane identity reads correctly for colorblind users too.
 */
export function LaneBadge({ lane, className }: LaneBadgeProps) {
  if (lane === 'both') {
    return (
      <span className={cn('inline-flex items-center gap-1', className)}>
        <LaneBadge lane="support" />
        <LaneBadge lane="sales" />
      </span>
    )
  }
  const style = LANE_STYLES[lane]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-caption font-medium',
        style.bg,
        style.text,
        className,
      )}
    >
      {style.label}
    </span>
  )
}
