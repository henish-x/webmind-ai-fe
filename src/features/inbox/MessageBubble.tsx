import { ThumbsDown, ThumbsUp } from 'lucide-react'
import type { Message } from '@/data/types'
import { formatDateTime } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export function MessageBubble({ message }: { message: Message }) {
  const isOutgoing = message.author === 'bot' || message.author === 'agent'

  return (
    <div className={cn('flex flex-col', isOutgoing ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-md rounded-lg px-3 py-2 text-body',
          message.author === 'agent'
            ? 'bg-ink-primary text-surface-page'
            : message.author === 'bot'
              ? 'border border-hairline bg-surface-card text-ink-primary'
              : 'bg-surface-sunken text-ink-primary',
        )}
      >
        {message.body}
      </div>
      <div className="mt-1 flex items-center gap-2 text-caption text-ink-muted">
        <span>{formatDateTime(message.createdAt)}</span>
        {message.author === 'agent' && <span>Agent</span>}
        {message.feedback === 'up' && <ThumbsUp className="h-3 w-3 text-success" />}
        {message.feedback === 'down' && <ThumbsDown className="h-3 w-3 text-danger" />}
      </div>
    </div>
  )
}
