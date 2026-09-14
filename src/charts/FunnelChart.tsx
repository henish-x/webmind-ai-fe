import { useChartColors } from './chartTheme'

export interface FunnelStage {
  stage: string
  count: number
}

export interface FunnelChartProps {
  stages: FunnelStage[]
  accent?: 'support' | 'sales'
}

/**
 * A horizontal-bar funnel — deliberately not Recharts' trapezoid Funnel shape,
 * which reads as decorative rather than data-accurate. Bar width is
 * proportional to the first stage so drop-off is legible at a glance.
 */
export function FunnelChart({ stages, accent = 'sales' }: FunnelChartProps) {
  const colors = useChartColors()
  const color = accent === 'sales' ? colors.sales : colors.support
  const max = stages[0]?.count || 1

  return (
    <div className="space-y-3">
      {stages.map((s) => {
        const pct = max ? Math.round((s.count / max) * 100) : 0
        return (
          <div key={s.stage}>
            <div className="mb-1 flex items-baseline justify-between text-meta">
              <span className="text-ink-secondary">{s.stage}</span>
              <span className="font-medium text-ink-primary">
                {s.count} <span className="font-normal text-ink-muted">({pct}%)</span>
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-sunken">
              <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
