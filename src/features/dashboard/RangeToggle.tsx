import { cn, focusRing } from '@/lib/utils'
import type { DateRangeDays } from '@/data/services/analyticsService'

const OPTIONS: DateRangeDays[] = [7, 30, 90]

export function RangeToggle({ value, onChange }: { value: DateRangeDays; onChange: (v: DateRangeDays) => void }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-md bg-surface-sunken p-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            'rounded px-2 py-1 text-caption font-medium transition-colors',
            value === opt ? 'bg-surface-card text-ink-primary shadow-overlay' : 'text-ink-secondary',
            focusRing,
          )}
        >
          {opt}d
        </button>
      ))}
    </div>
  )
}
