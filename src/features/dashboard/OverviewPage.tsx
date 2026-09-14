import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LaneTrendLineChart } from '@/charts/LaneTrendLineChart'
import { EmptyState } from '@/components/EmptyState'
import { StatCard } from '@/components/StatCard'
import { analyticsService, conversationService } from '@/data/services'
import type { DateRangeDays, OverviewStats } from '@/data/services/analyticsService'
import type { Conversation } from '@/data/types'
import { PageContainer } from '@/shell/PageContainer'
import { useBotStore } from '@/state/useBotStore'
import { ActivityFeed } from './ActivityFeed'
import { RangeToggle } from './RangeToggle'

export function OverviewPage() {
  const currentBotId = useBotStore((s) => s.currentBotId)
  const [range, setRange] = useState<DateRangeDays>(7)
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [activity, setActivity] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentBotId) return
    setLoading(true)
    Promise.all([
      analyticsService.getOverviewStats(currentBotId, range),
      conversationService.getConversations(currentBotId, {}),
    ]).then(([s, convos]) => {
      setStats(s)
      setActivity(convos.slice(0, 8))
      setLoading(false)
    })
  }, [currentBotId, range])

  if (!loading && stats && stats.conversationsThisWeek === 0 && activity.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          title="No conversations yet"
          description="Once your widget is live, activity will show up here."
          action={
            <Link to="/customize" className="text-meta font-medium text-ink-primary underline underline-offset-2">
              Go to Customize
            </Link>
          }
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-page-title font-medium text-ink-primary">Overview</p>
        <RangeToggle value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Conversations this week" value={stats?.conversationsThisWeek ?? '—'} delta={stats?.conversationsDeltaPct} />
        <StatCard label="Resolution rate" value={stats ? `${stats.resolutionRate}%` : '—'} accent="support" />
        <StatCard label="Leads captured" value={stats?.leadsCaptured ?? '—'} accent="sales" />
        <StatCard
          label="Escalations needing attention"
          value={stats?.escalationsNeedingAttention ?? '—'}
          accent={stats && stats.escalationsNeedingAttention > 0 ? 'danger' : 'none'}
          href="/inbox?status=escalated"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-hairline bg-surface-card p-4">
          <p className="text-meta font-medium text-support-700">Support · resolved by AI</p>
          {stats && <LaneTrendLineChart data={stats.trend.map((t) => ({ date: t.date, value: t.support }))} lane="support" valueLabel="Resolved" />}
        </div>
        <div className="rounded-lg border border-hairline bg-surface-card p-4">
          <p className="text-meta font-medium text-sales-700">Sales · leads captured</p>
          {stats && <LaneTrendLineChart data={stats.trend.map((t) => ({ date: t.date, value: t.sales }))} lane="sales" valueLabel="Leads" />}
        </div>
      </div>

      <div className="rounded-lg border border-hairline bg-surface-card p-4">
        <p className="mb-1 text-card-title font-medium text-ink-primary">Recent activity</p>
        <ActivityFeed conversations={activity} />
      </div>
    </PageContainer>
  )
}
