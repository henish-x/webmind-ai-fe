import { ArrowLeft, SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '@/components/EmptyState'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { conversationService } from '@/data/services'
import type { Conversation } from '@/data/types'
import { cn, focusRing } from '@/lib/utils'
import { useBotStore } from '@/state/useBotStore'
import { ConversationDetail } from './ConversationDetail'
import { ConversationList } from './ConversationList'
import { type InboxFilters, FilterPane } from './FilterPane'

const DAY = 24 * 60 * 60 * 1000

export function InboxPage() {
  const currentBotId = useBotStore((s) => s.currentBotId)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<InboxFilters>({ lane: 'all', status: 'all', dateRange: 'all' })
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Conversation | null>(null)
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list')

  useEffect(() => {
    if (!currentBotId) return
    setLoading(true)
    const dateFrom = filters.dateRange === '7d' ? new Date(Date.now() - 7 * DAY).toISOString() : filters.dateRange === '30d' ? new Date(Date.now() - 30 * DAY).toISOString() : undefined
    conversationService
      .getConversations(currentBotId, {
        lane: filters.lane,
        status: filters.status === 'all' ? undefined : filters.status,
        dateFrom,
      })
      .then((data) => {
        setConversations(data)
        setLoading(false)
        const paramId = searchParams.get('conversation')
        const match = paramId ? data.find((c) => c.id === paramId) : null
        setSelected(match ?? data[0] ?? null)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBotId, filters])

  function handleSelect(id: string) {
    const conversation = conversations.find((c) => c.id === id) ?? null
    setSelected(conversation)
    setSearchParams(id ? { conversation: id } : {}, { replace: true })
    setMobileView('detail')
  }

  function handleUpdated(updated: Conversation) {
    setSelected(updated)
    setConversations((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] min-h-0">
      <FilterPane filters={filters} onChange={setFilters} className="hidden w-56 shrink-0 lg:flex" />

      <div className={cn('flex min-h-0 w-full shrink-0 flex-col border-r border-hairline md:w-80', mobileView === 'detail' && 'hidden md:flex')}>
        <div className="flex items-center justify-between border-b border-hairline p-3 lg:hidden">
          <p className="text-meta font-medium text-ink-primary">Conversations</p>
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" aria-label="Filters" className={cn('rounded-md p-1.5 text-ink-secondary hover:bg-surface-sunken', focusRing)}>
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-0">
              <FilterPane filters={filters} onChange={setFilters} className="border-0" />
            </PopoverContent>
          </Popover>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ConversationList conversations={conversations} loading={loading} selectedId={selected?.id ?? null} onSelect={handleSelect} />
        </div>
      </div>

      <div className={cn('flex min-h-0 min-w-0 flex-1', mobileView === 'list' && 'hidden md:flex')}>
        {selected ? (
          <div className="flex h-full min-h-0 w-full min-w-0 flex-col">
            <button
              type="button"
              onClick={() => setMobileView('list')}
              className={cn('flex items-center gap-1.5 border-b border-hairline px-4 py-2 text-meta text-ink-secondary md:hidden', focusRing)}
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to list
            </button>
            <ConversationDetail conversation={selected} onUpdated={handleUpdated} />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <EmptyState title="No conversation selected" description="Choose a conversation from the list to see the full transcript." />
          </div>
        )}
      </div>
    </div>
  )
}
