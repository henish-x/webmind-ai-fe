import type { SourceStatus } from '@/data/types'
import { cn } from '@/lib/utils'

const STATUS_STYLE: Record<SourceStatus, { bg: string; text: string; label: string }> = {
  indexed: { bg: 'bg-success/10', text: 'text-success', label: 'Indexed' },
  crawling: { bg: 'bg-surface-sunken', text: 'text-ink-secondary', label: 'Crawling' },
  queued: { bg: 'bg-surface-sunken', text: 'text-ink-secondary', label: 'Queued' },
  stale: { bg: 'bg-warning/10', text: 'text-warning', label: 'Stale' },
  failed: { bg: 'bg-danger/10', text: 'text-danger', label: 'Failed' },
}

export function SourceStatusBadge({ status }: { status: SourceStatus }) {
  const style = STATUS_STYLE[status]
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-caption font-medium', style.bg, style.text)}>
      {style.label}
    </span>
  )
}
