import { useEffect, useState } from 'react'
import { botService } from '@/data/services'
import type { Bot } from '@/data/types'
import { useBotStore } from '@/state/useBotStore'

/** Loads the full current bot record and offers an optimistic-update + persist helper. */
export function useCurrentBot() {
  const currentBotId = useBotStore((s) => s.currentBotId)
  const refreshCurrentBot = useBotStore((s) => s.refreshCurrentBot)
  const [bot, setBot] = useState<Bot | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentBotId) return
    setLoading(true)
    botService.getBotById(currentBotId).then((b) => {
      setBot(b)
      setLoading(false)
    })
  }, [currentBotId])

  async function save(patch: Partial<Bot>) {
    if (!bot) return
    const updated = await botService.updateBot(bot.id, patch)
    setBot(updated)
    refreshCurrentBot()
    return updated
  }

  return { bot, setBot, loading, save }
}
