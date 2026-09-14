import { useEffect, useState } from 'react'
import { FunnelChart } from '@/charts/FunnelChart'
import { LaneTrendLineChart } from '@/charts/LaneTrendLineChart'
import { StatCard } from '@/components/StatCard'
import { analyticsService } from '@/data/services'
import type { DateRangeDays, SalesAnalytics } from '@/data/services/analyticsService'
import { ExportCsvButton } from './ExportCsvButton'

export function SalesView({ botId, range }: { botId: string; range: DateRangeDays }) {
  const [data, setData] = useState<SalesAnalytics | null>(null)

  useEffect(() => {
    analyticsService.getSalesAnalytics(botId, range).then(setData)
  }, [botId, range])

  if (!data) return <p className="text-body text-ink-secondary">Loading…</p>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Lead-capture completion rate" value={`${data.completionRate}%`} accent="sales" />
        <StatCard label="Avg time to lead" value={`${data.avgTimeToLeadMinutes}m`} accent="sales" />
        <StatCard label="Leads captured" value={data.leadsTrend.reduce((sum, t) => sum + t.value, 0)} accent="sales" />
      </div>

      <div className="rounded-lg border border-hairline bg-surface-card p-4">
        <p className="mb-2 text-meta font-medium text-sales-700">Leads captured over time</p>
        <LaneTrendLineChart data={data.leadsTrend} lane="sales" valueLabel="Leads" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-hairline bg-surface-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-card-title font-medium text-ink-primary">Lead-capture completion</p>
            <ExportCsvButton
              filename="lead-capture-funnel.csv"
              headers={['Stage', 'Count']}
              rows={data.completionFunnel.map((s) => [s.stage, s.count])}
            />
          </div>
          <FunnelChart stages={data.completionFunnel} accent="sales" />
        </div>

        <div className="rounded-lg border border-hairline bg-surface-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-card-title font-medium text-ink-primary">Source breakdown</p>
            <ExportCsvButton
              filename="lead-source-breakdown.csv"
              headers={['Page', 'Leads']}
              rows={data.sourceBreakdown.map((s) => [s.page, s.count])}
            />
          </div>
          <table className="w-full text-body">
            <tbody>
              {data.sourceBreakdown.map((s) => (
                <tr key={s.page} className="border-t border-hairline first:border-t-0">
                  <td className="py-2 pr-4 font-mono text-meta text-ink-primary">{s.page}</td>
                  <td className="w-20 py-2 text-right text-meta text-ink-secondary">{s.count}</td>
                </tr>
              ))}
              {data.sourceBreakdown.length === 0 && (
                <tr>
                  <td className="py-4 text-meta text-ink-secondary">No leads captured in this range yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
