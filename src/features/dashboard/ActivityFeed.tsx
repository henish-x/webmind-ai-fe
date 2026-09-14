import { useNavigate } from 'react-router-dom'
import type { Conversation } from '@/data/types'
import { formatRelativeTime } from '@/lib/formatters'
import { cn } from '@/lib/utils'

function activityLabel(c: Conversation): { text: string; dot: string } {
  if (c.status === 'escalated') return { text: 'Escalated · Support', dot: 'bg-danger' }
  if ((c.lane === 'sales' || c.lane === 'both') && (c.status === 'new' || c.status === 'qualified'))
    return { text: 'New lead · Sales', dot: 'bg-sales-500' }
  if (c.status === 'converted') return { text: 'Converted · Sales', dot: 'bg-sales-500' }
  if (c.status === 'resolved') return { text: 'Resolved · Support', dot: 'bg-support-500' }
  return { text: c.lane === 'sales' ? 'Message · Sales' : 'Message · Support', dot: c.lane === 'sales' ? 'bg-sales-500' : 'bg-support-500' }
}

export function ActivityFeed({ conversations }: { conversations: Conversation[] }) {
  const navigate = useNavigate()

  if (conversations.length === 0) {
    return <p className="py-8 text-center text-body text-ink-secondary">No activity yet.</p>
  }

  return (
    <ul className="divide-y divide-hairline">
      {conversations.map((c) => {
        const { text, dot } = activityLabel(c)
        return (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => navigate(`/inbox?conversation=${c.id}`)}
              className="flex w-full items-start gap-3 px-1 py-3 text-left hover:bg-surface-sunken"
            >
              <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', dot)} aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-meta font-medium text-ink-primary">{text}</p>
                  <span className="shrink-0 text-caption text-ink-muted">{formatRelativeTime(c.lastMessageAt)}</span>
                </div>
                <p className="truncate text-caption text-ink-secondary">
                  {c.visitorName ?? 'Visitor'} — {c.lastMessagePreview}
                </p>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
