import type { ConversationStatus, Lane } from '@/data/types'
import { cn, focusRing } from '@/lib/utils'

const LANE_TABS: { value: Lane | 'all'; label: string; dot?: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'support', label: 'Support', dot: 'bg-support-500' },
  { value: 'sales', label: 'Sales', dot: 'bg-sales-500' },
]

const SUPPORT_STATUSES: ConversationStatus[] = ['open', 'resolved', 'escalated']
const SALES_STATUSES: ConversationStatus[] = ['new', 'qualified', 'converted']

export type DateRangeFilter = 'all' | '7d' | '30d'

export interface InboxFilters {
  lane: Lane | 'all'
  status: ConversationStatus | 'all'
  dateRange: DateRangeFilter
}

const DATE_OPTIONS: { value: DateRangeFilter; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
]

export function FilterPane({
  filters,
  onChange,
  className,
}: {
  filters: InboxFilters
  onChange: (filters: InboxFilters) => void
  className?: string
}) {
  const statusOptions = filters.lane === 'sales' ? SALES_STATUSES : filters.lane === 'support' ? SUPPORT_STATUSES : [...SUPPORT_STATUSES, ...SALES_STATUSES]

  return (
    <div className={cn('flex h-full min-h-0 flex-col overflow-y-auto border-r border-hairline bg-surface-card', className)}>
      <div className="border-b border-hairline p-2">
        {LANE_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange({ ...filters, lane: tab.value, status: 'all' })}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-body',
              filters.lane === tab.value ? 'bg-surface-sunken text-ink-primary' : 'text-ink-secondary hover:bg-surface-sunken',
              focusRing,
            )}
          >
            {tab.dot && <span className={cn('h-1.5 w-1.5 rounded-full', tab.dot)} />}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-1 p-2">
        <p className="px-3 pb-1 text-caption font-medium text-ink-muted">Status</p>
        <button
          type="button"
          onClick={() => onChange({ ...filters, status: 'all' })}
          className={cn(
            'block w-full rounded-md px-3 py-1.5 text-left text-meta capitalize',
            filters.status === 'all' ? 'bg-surface-sunken text-ink-primary' : 'text-ink-secondary hover:bg-surface-sunken',
            focusRing,
          )}
        >
          All statuses
        </button>
        {statusOptions.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onChange({ ...filters, status })}
            className={cn(
              'block w-full rounded-md px-3 py-1.5 text-left text-meta capitalize',
              filters.status === status ? 'bg-surface-sunken text-ink-primary' : 'text-ink-secondary hover:bg-surface-sunken',
              focusRing,
            )}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-1 border-t border-hairline p-2">
        <p className="px-3 pb-1 pt-1 text-caption font-medium text-ink-muted">Date range</p>
        {DATE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange({ ...filters, dateRange: opt.value })}
            className={cn(
              'block w-full rounded-md px-3 py-1.5 text-left text-meta',
              filters.dateRange === opt.value ? 'bg-surface-sunken text-ink-primary' : 'text-ink-secondary hover:bg-surface-sunken',
              focusRing,
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
