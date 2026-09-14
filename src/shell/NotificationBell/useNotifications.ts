import { useEffect, useState } from 'react'
import { conversationService } from '@/data/services'
import type { Conversation } from '@/data/types'

export interface NotificationItem {
  id: string
  label: string
  sublabel: string
  href: string
}

export function useNotifications(botId: string | null) {
  const [items, setItems] = useState<NotificationItem[]>([])

  useEffect(() => {
    if (!botId) return
    let cancelled = false
    async function load() {
      const [escalated, newLeadsConvos] = await Promise.all([
        conversationService.getConversations(botId!, { status: 'escalated' }),
        conversationService.getConversations(botId!, { status: 'new' }),
      ])
      if (cancelled) return
      const notifs: NotificationItem[] = [
        ...escalated.slice(0, 5).map((c: Conversation) => ({
          id: c.id,
          label: `Escalated · ${c.visitorName ?? 'Visitor'}`,
          sublabel: c.lastMessagePreview,
          href: `/inbox?conversation=${c.id}`,
        })),
        ...newLeadsConvos.slice(0, 5).map((c: Conversation) => ({
          id: c.id,
          label: `New lead · ${c.visitorName ?? 'Visitor'}`,
          sublabel: c.lastMessagePreview,
          href: `/inbox?conversation=${c.id}`,
        })),
      ]
      setItems(notifs)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [botId])

  return items
}
