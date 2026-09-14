import { LaneBadge } from '@/components/LaneBadge'
import type { Conversation } from '@/data/types'
import { formatRelativeTime } from '@/lib/formatters'
import { cn, focusRing } from '@/lib/utils'

export function ConversationList({
  conversations,
  loading,
  selectedId,
  onSelect,
}: {
  conversations: Conversation[]
  loading: boolean
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  if (loading) {
    return (
      <div className="space-y-2 p-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-surface-sunken" />
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return <p className="p-6 text-center text-meta text-ink-secondary">No conversations match these filters.</p>
  }

  return (
    <ul className="divide-y divide-hairline">
      {conversations.map((c) => (
        <li key={c.id}>
          <button
            type="button"
            onClick={() => onSelect(c.id)}
            aria-current={selectedId === c.id}
            className={cn(
              'block w-full border-l-2 px-4 py-3 text-left',
              c.status === 'escalated' ? 'border-l-danger' : 'border-l-transparent',
              selectedId === c.id ? 'bg-surface-sunken' : 'hover:bg-surface-sunken',
              focusRing,
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 truncate text-meta font-medium text-ink-primary">
                {c.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-primary" aria-label="Unread" />}
                {c.visitorName ?? `Visitor #${c.visitorId.slice(-5)}`}
              </span>
              <span className="shrink-0 text-caption text-ink-muted">{formatRelativeTime(c.lastMessageAt)}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <LaneBadge lane={c.lane} />
            </div>
            <p className="mt-1 truncate text-caption text-ink-secondary">{c.lastMessagePreview}</p>
          </button>
        </li>
      ))}
    </ul>
  )
}
