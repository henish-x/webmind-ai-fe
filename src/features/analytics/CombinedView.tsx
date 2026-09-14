import { useEffect, useState } from 'react'
import { analyticsService } from '@/data/services'
import type { CombinedFunnel, DateRangeDays } from '@/data/services/analyticsService'
import { ExportCsvButton } from './ExportCsvButton'

function FunnelStep({ label, value, of, color }: { label: string; value: number; of: number; color: string }) {
  const pct = of ? Math.round((value / of) * 100) : 0
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-meta">
        <span className="text-ink-secondary">{label}</span>
        <span className="font-medium text-ink-primary">
          {value} <span className="font-normal text-ink-muted">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-surface-sunken">
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export function CombinedView({ botId, range }: { botId: string; range: DateRangeDays }) {
  const [data, setData] = useState<CombinedFunnel | null>(null)

  useEffect(() => {
    analyticsService.getCombinedFunnel(botId, range).then(setData)
  }, [botId, range])

  if (!data) return <p className="text-body text-ink-secondary">Loading…</p>

  const supportColor = getComputedStyle(document.documentElement).getPropertyValue('--support-500').trim()
  const salesColor = getComputedStyle(document.documentElement).getPropertyValue('--sales-500').trim()
  const dangerColor = getComputedStyle(document.documentElement).getPropertyValue('--danger-500').trim()

  return (
    <div className="rounded-lg border border-hairline bg-surface-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-card-title font-medium text-ink-primary">Visitors to outcomes</p>
        <ExportCsvButton
          filename="combined-funnel.csv"
          headers={['Stage', 'Count']}
          rows={[
            ['Visitors', data.visitors],
            ['Conversations', data.conversations],
            ['Resolved', data.resolved],
            ['Escalated', data.escalated],
            ['Leads', data.leads],
            ['Qualified', data.qualified],
            ['Converted', data.converted],
          ]}
        />
      </div>

      <div className="space-y-2">
        <FunnelStep label="Visitors" value={data.visitors} of={data.visitors} color="var(--ink-primary)" />
        <FunnelStep label="Conversations" value={data.conversations} of={data.visitors} color="var(--ink-primary)" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 border-t border-hairline pt-6 md:grid-cols-2">
        <div>
          <p className="mb-3 text-meta font-medium text-support-700">Support outcomes</p>
          <div className="space-y-3">
            <FunnelStep label="Resolved" value={data.resolved} of={data.conversations} color={supportColor} />
            <FunnelStep label="Escalated" value={data.escalated} of={data.conversations} color={dangerColor} />
          </div>
        </div>
        <div>
          <p className="mb-3 text-meta font-medium text-sales-700">Sales outcomes</p>
          <div className="space-y-3">
            <FunnelStep label="Leads" value={data.leads} of={data.conversations} color={salesColor} />
            <FunnelStep label="Qualified" value={data.qualified} of={data.conversations} color={salesColor} />
            <FunnelStep label="Converted" value={data.converted} of={data.conversations} color={salesColor} />
          </div>
        </div>
      </div>
    </div>
  )
}
