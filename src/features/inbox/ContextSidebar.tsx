import { CalendarClock, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { conversationService } from '@/data/services'
import type { Conversation, Lead, Message } from '@/data/types'
import { formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { useBotStore } from '@/state/useBotStore'

const CRM_STATUS_STYLE: Record<string, string> = {
  synced: 'text-success',
  pending: 'text-warning',
  failed: 'text-danger',
  not_connected: 'text-ink-muted',
}

function SupportContext({ messages }: { messages: Message[] }) {
  const cited = messages.flatMap((m) => m.citedSources)
  if (cited.length === 0) {
    return <p className="text-meta text-ink-secondary">No sources cited in this conversation yet.</p>
  }
  return (
    <div className="space-y-2">
      {cited.map((c, i) => (
        <div key={`${c.chunkId}-${i}`} className="flex items-start gap-2 rounded-md border border-hairline p-2.5">
          <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted" strokeWidth={1.5} />
          <span className="truncate text-meta text-ink-primary">{c.sourceName}</span>
        </div>
      ))}
    </div>
  )
}

function SalesContext({ conversation }: { conversation: Conversation }) {
  const [lead, setLead] = useState<Lead | null>(null)
  const bot = useBotStore((s) => s.bots.find((b) => b.id === conversation.botId))

  useEffect(() => {
    conversationService.getLeadByConversationId(conversation.id).then(setLead)
  }, [conversation.id])

  if (!lead) return <p className="text-meta text-ink-secondary">No lead captured yet.</p>

  const questionLabels = new Map(bot?.salesLane.qualificationQuestions.map((q) => [q.id, q.label]) ?? [])
  const fields: [string, string | null][] = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ...Object.entries(lead.qualificationAnswers).map(([id, answer]) => [questionLabels.get(id) ?? id, answer] as [string, string]),
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {fields.map(([label, value]) => (
          <div key={label}>
            <p className="text-caption text-ink-muted">{label}</p>
            <p className="text-meta text-ink-primary">{value || '—'}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-caption text-ink-muted">CRM sync</p>
        <p className={cn('text-meta font-medium capitalize', CRM_STATUS_STYLE[lead.crmSyncStatus])}>
          {lead.crmSyncStatus.replace('_', ' ')}
        </p>
      </div>
      <p className="text-caption text-ink-muted">Captured {formatDate(lead.capturedAt)}</p>
      <Button size="sm" variant="secondary" className="w-full">
        <CalendarClock className="h-3.5 w-3.5" /> Book a call
      </Button>
    </div>
  )
}

export function ContextSidebar({ conversation, messages }: { conversation: Conversation; messages: Message[] }) {
  const showSales = conversation.lane === 'sales' || conversation.lane === 'both'
  const showSupport = conversation.lane === 'support' || conversation.lane === 'both' || conversation.lane === 'other'

  return (
    <div className="hidden h-full w-72 shrink-0 space-y-6 overflow-y-auto border-l border-hairline bg-surface-card p-4 xl:block">
      {showSupport && (
        <div>
          <p className="mb-2 text-meta font-medium text-support-700">Cited sources</p>
          <SupportContext messages={messages} />
        </div>
      )}
      {showSales && (
        <div>
          <p className="mb-2 text-meta font-medium text-sales-700">Lead details</p>
          <SalesContext conversation={conversation} />
        </div>
      )}
    </div>
  )
}
