import { cn } from '@/lib/utils'

export function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min(100, Math.round((used / limit) * 100))
  const color = pct >= 100 ? 'bg-danger' : pct >= 80 ? 'bg-warning' : 'bg-ink-primary'

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-meta">
        <span className="text-ink-secondary">Conversations this cycle</span>
        <span className="font-medium text-ink-primary">
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-surface-sunken">
        <div className={cn('h-2 rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
