import { formatDate } from '@/lib/formatters'
import { delay, getDb } from '../store/db'

const DAY = 24 * 60 * 60 * 1000

export type DateRangeDays = 7 | 30 | 90

function since(days: DateRangeDays): number {
  return Date.now() - days * DAY
}

function dayBuckets(days: DateRangeDays): string[] {
  const buckets: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    buckets.push(formatDate(new Date(Date.now() - i * DAY).toISOString(), 'MMM d'))
  }
  return buckets
}

export interface OverviewStats {
  conversationsThisWeek: number
  conversationsDeltaPct: number
  resolutionRate: number
  leadsCaptured: number
  escalationsNeedingAttention: number
  trend: { date: string; support: number; sales: number }[]
}

export async function getOverviewStats(botId: string, days: DateRangeDays = 7): Promise<OverviewStats> {
  const db = getDb()
  const cutoff = since(days)
  const conversations = db.conversations.filter((c) => c.botId === botId && new Date(c.startedAt).getTime() >= cutoff)
  const previousCutoff = since((days * 2) as DateRangeDays)
  const previousPeriod = db.conversations.filter(
    (c) => c.botId === botId && new Date(c.startedAt).getTime() >= previousCutoff && new Date(c.startedAt).getTime() < cutoff,
  )

  const resolved = conversations.filter((c) => c.status === 'resolved').length
  const supportish = conversations.filter((c) => c.lane === 'support' || c.lane === 'both' || c.lane === 'other')
  const resolutionRate = supportish.length ? Math.round((resolved / supportish.length) * 100) : 0
  const leads = db.leads.filter((l) => l.botId === botId && new Date(l.capturedAt).getTime() >= cutoff)
  const escalations = conversations.filter((c) => c.status === 'escalated').length

  const delta = previousPeriod.length
    ? Math.round(((conversations.length - previousPeriod.length) / previousPeriod.length) * 100)
    : 0

  const buckets = dayBuckets(days)
  const trend = buckets.map((label, i) => {
    const dayStart = Date.now() - (days - 1 - i) * DAY
    const dayConvos = conversations.filter((c) => {
      const t = new Date(c.startedAt).getTime()
      return t >= dayStart - 12 * 60 * 60 * 1000 && t < dayStart + 12 * 60 * 60 * 1000
    })
    return {
      date: label,
      support: dayConvos.filter((c) => (c.lane === 'support' || c.lane === 'both') && c.status === 'resolved').length,
      sales: leads.filter((l) => {
        const t = new Date(l.capturedAt).getTime()
        return t >= dayStart - 12 * 60 * 60 * 1000 && t < dayStart + 12 * 60 * 60 * 1000
      }).length,
    }
  })

  return delay({
    conversationsThisWeek: conversations.length,
    conversationsDeltaPct: delta,
    resolutionRate,
    leadsCaptured: leads.length,
    escalationsNeedingAttention: escalations,
    trend,
  })
}

export interface SupportAnalytics {
  resolutionRateTrend: { date: string; value: number }[]
  escalationRate: number
  csatUp: number
  csatDown: number
  topUnanswered: { question: string; count: number }[]
  avgResponseTimeSeconds: number
}

export async function getSupportAnalytics(botId: string, days: DateRangeDays = 30): Promise<SupportAnalytics> {
  const db = getDb()
  const cutoff = since(days)
  const conversations = db.conversations.filter(
    (c) => c.botId === botId && (c.lane === 'support' || c.lane === 'both') && new Date(c.startedAt).getTime() >= cutoff,
  )
  const buckets = dayBuckets(days)
  const resolutionRateTrend = buckets.map((label, i) => {
    const dayStart = Date.now() - (days - 1 - i) * DAY
    const dayConvos = conversations.filter((c) => {
      const t = new Date(c.startedAt).getTime()
      return t >= dayStart - 12 * 60 * 60 * 1000 && t < dayStart + 12 * 60 * 60 * 1000
    })
    const resolved = dayConvos.filter((c) => c.status === 'resolved').length
    return { date: label, value: dayConvos.length ? Math.round((resolved / dayConvos.length) * 100) : 0 }
  })

  const escalated = conversations.filter((c) => c.status === 'escalated').length
  const escalationRate = conversations.length ? Math.round((escalated / conversations.length) * 100) : 0

  const unansweredPool = [
    'Do you offer virtual tours for out-of-town buyers?',
    'What is the exact carpet area vs. built-up area?',
    "Can I customize the interior finish before possession?",
    'Is there a waitlist for sold-out units?',
    'How do I export my API usage as CSV?',
  ]
  const topUnanswered = unansweredPool
    .map((question) => ({ question, count: 3 + Math.floor(Math.random() * 24) }))
    .sort((a, b) => b.count - a.count)

  return delay({
    resolutionRateTrend,
    escalationRate,
    csatUp: Math.round(conversations.length * 0.61),
    csatDown: Math.round(conversations.length * 0.09),
    topUnanswered,
    avgResponseTimeSeconds: 4 + Math.round(Math.random() * 6),
  })
}

export interface SalesAnalytics {
  leadsTrend: { date: string; value: number }[]
  completionFunnel: { stage: string; count: number }[]
  sourceBreakdown: { page: string; count: number }[]
  avgTimeToLeadMinutes: number
  completionRate: number
}

export async function getSalesAnalytics(botId: string, days: DateRangeDays = 30): Promise<SalesAnalytics> {
  const db = getDb()
  const cutoff = since(days)
  const leads = db.leads.filter((l) => l.botId === botId && new Date(l.capturedAt).getTime() >= cutoff)
  const buckets = dayBuckets(days)
  const leadsTrend = buckets.map((label, i) => {
    const dayStart = Date.now() - (days - 1 - i) * DAY
    const count = leads.filter((l) => {
      const t = new Date(l.capturedAt).getTime()
      return t >= dayStart - 12 * 60 * 60 * 1000 && t < dayStart + 12 * 60 * 60 * 1000
    }).length
    return { date: label, value: count }
  })

  const started = leads.length
  const named = leads.filter((l) => l.name).length
  const emailed = leads.filter((l) => l.email).length
  const qualified = leads.filter((l) => l.stage === 'qualified' || l.stage === 'converted').length
  const converted = leads.filter((l) => l.stage === 'converted').length

  const sourceCounts = new Map<string, number>()
  for (const lead of leads) sourceCounts.set(lead.sourcePage, (sourceCounts.get(lead.sourcePage) ?? 0) + 1)
  const sourceBreakdown = [...sourceCounts.entries()]
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)

  return delay({
    leadsTrend,
    completionFunnel: [
      { stage: 'Started', count: started },
      { stage: 'Name', count: named },
      { stage: 'Email', count: emailed },
      { stage: 'Qualified', count: qualified },
      { stage: 'Converted', count: converted },
    ],
    sourceBreakdown,
    avgTimeToLeadMinutes: 2 + Math.round(Math.random() * 6),
    completionRate: started ? Math.round((converted / started) * 100) : 0,
  })
}

export interface CombinedFunnel {
  visitors: number
  conversations: number
  resolved: number
  escalated: number
  leads: number
  qualified: number
  converted: number
}

export async function getCombinedFunnel(botId: string, days: DateRangeDays = 30): Promise<CombinedFunnel> {
  const db = getDb()
  const cutoff = since(days)
  const conversations = db.conversations.filter((c) => c.botId === botId && new Date(c.startedAt).getTime() >= cutoff)
  const leads = db.leads.filter((l) => l.botId === botId && new Date(l.capturedAt).getTime() >= cutoff)

  return delay({
    visitors: Math.round(conversations.length * 1.6),
    conversations: conversations.length,
    resolved: conversations.filter((c) => c.status === 'resolved').length,
    escalated: conversations.filter((c) => c.status === 'escalated').length,
    leads: leads.length,
    qualified: leads.filter((l) => l.stage === 'qualified' || l.stage === 'converted').length,
    converted: leads.filter((l) => l.stage === 'converted').length,
  })
}
