import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LaneTrendLineChart } from '@/charts/LaneTrendLineChart'
import { StatCard } from '@/components/StatCard'
import { analyticsService } from '@/data/services'
import type { DateRangeDays, SupportAnalytics } from '@/data/services/analyticsService'
import { ExportCsvButton } from './ExportCsvButton'

export function SupportView({ botId, range }: { botId: string; range: DateRangeDays }) {
  const [data, setData] = useState<SupportAnalytics | null>(null)

  useEffect(() => {
    analyticsService.getSupportAnalytics(botId, range).then(setData)
  }, [botId, range])

  if (!data) return <p className="text-body text-ink-secondary">Loading…</p>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Escalation rate" value={`${data.escalationRate}%`} accent="support" />
        <StatCard label="Avg response time" value={`${data.avgResponseTimeSeconds}s`} accent="support" />
        <StatCard label="Thumbs up" value={data.csatUp} accent="success" />
        <StatCard label="Thumbs down" value={data.csatDown} accent="danger" />
      </div>

      <div className="rounded-lg border border-hairline bg-surface-card p-4">
        <p className="mb-2 text-meta font-medium text-support-700">Resolution rate over time</p>
        <LaneTrendLineChart
          data={data.resolutionRateTrend.map((t) => ({ date: t.date, value: t.value }))}
          lane="support"
          valueLabel="Resolution rate %"
        />
      </div>

      <div className="rounded-lg border border-hairline bg-surface-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-card-title font-medium text-ink-primary">Top unanswered questions</p>
          <ExportCsvButton
            filename="top-unanswered-questions.csv"
            headers={['Question', 'Times asked']}
            rows={data.topUnanswered.map((q) => [q.question, q.count])}
          />
        </div>
        <table className="w-full text-body">
          <tbody>
            {data.topUnanswered.map((q) => (
              <tr key={q.question} className="border-t border-hairline first:border-t-0">
                <td className="py-2.5 pr-4 text-ink-primary">{q.question}</td>
                <td className="w-32 py-2.5 text-right text-meta text-ink-secondary">{q.count}× asked</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-6 text-meta text-ink-secondary">
        <span className="flex items-center gap-1.5">
          <ThumbsUp className="h-3.5 w-3.5 text-success" /> {data.csatUp} positive
        </span>
        <span className="flex items-center gap-1.5">
          <ThumbsDown className="h-3.5 w-3.5 text-danger" /> {data.csatDown} negative
        </span>
      </div>
    </div>
  )
}
