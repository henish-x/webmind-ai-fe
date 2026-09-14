import { ChevronDown, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { LaneBadge, type LaneValue } from '@/components/LaneBadge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { conversationService } from '@/data/services'
import type { Conversation, Lane, Message } from '@/data/types'
import { useAuthStore } from '@/state/useAuthStore'
import { cn, focusRing } from '@/lib/utils'
import { ContextSidebar } from './ContextSidebar'
import { MessageBubble } from './MessageBubble'

const LANE_OPTIONS: Lane[] = ['support', 'sales', 'both', 'other']

export function ConversationDetail({
  conversation,
  onUpdated,
}: {
  conversation: Conversation
  onUpdated: (c: Conversation) => void
}) {
  const session = useAuthStore((s) => s.session)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    conversationService.getMessages(conversation.id).then(setMessages)
    conversationService.markRead(conversation.id)
  }, [conversation.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const isAgentActive = Boolean(conversation.agentTakenOverBy)

  async function handleSend() {
    if (!draft.trim()) return
    setSending(true)
    if (!isAgentActive && session) {
      const updated = await conversationService.takeOverConversation(conversation.id, session.name)
      onUpdated(updated)
    }
    const message = await conversationService.sendMessage(conversation.id, draft, 'agent')
    setMessages((prev) => [...prev, message])
    setDraft('')
    setSending(false)
  }

  async function handleRetag(lane: Lane) {
    const updated = await conversationService.retagLane(conversation.id, lane)
    onUpdated(updated)
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <div className="flex items-center gap-2">
            <LaneBadge lane={conversation.lane as LaneValue} />
            <DropdownMenu>
              <DropdownMenuTrigger className={cn('flex items-center gap-1 rounded-md p-1 text-caption text-ink-muted hover:text-ink-primary', focusRing)}>
                Re-tag <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {LANE_OPTIONS.map((lane) => (
                  <DropdownMenuItem key={lane} onSelect={() => handleRetag(lane)}>
                    {lane === 'both' ? 'Support + Sales' : lane[0].toUpperCase() + lane.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-meta text-ink-secondary">{conversation.visitorName ?? `Visitor #${conversation.visitorId.slice(-5)}`}</p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          <div ref={bottomRef} />
        </div>

        {isAgentActive && (
          <div className="border-t border-hairline bg-surface-sunken px-4 py-1.5 text-caption text-ink-secondary">
            AI paused — {conversation.agentTakenOverBy} is replying
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-hairline p-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={isAgentActive ? 'Reply as yourself…' : 'Reply to take over from the AI…'}
            className={cn('h-9 flex-1 rounded-md border border-hairline bg-surface-card px-3 text-body text-ink-primary placeholder:text-ink-muted', focusRing)}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !draft.trim()}
            aria-label="Send message"
            className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink-primary text-surface-page disabled:opacity-50', focusRing)}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ContextSidebar conversation={conversation} messages={messages} />
    </div>
  )
}
