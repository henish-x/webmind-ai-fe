import { create } from 'zustand'
import { billingService, botService } from '@/data/services'
import type { Bot } from '@/data/types'

const STORAGE_KEY = 'webmind_current_bot'

interface BotState {
  bots: Bot[]
  currentBotId: string | null
  tenantName: string | null
  loading: boolean
  loaded: boolean
  loadBots: (tenantId: string) => Promise<void>
  setCurrentBot: (id: string) => void
  refreshCurrentBot: () => Promise<void>
  currentBot: () => Bot | null
}

export const useBotStore = create<BotState>((set, get) => ({
  bots: [],
  currentBotId: localStorage.getItem(STORAGE_KEY),
  tenantName: null,
  loading: false,
  loaded: false,
  loadBots: async (tenantId) => {
    set({ loading: true })
    const [bots, tenant] = await Promise.all([botService.getBots(tenantId), billingService.getTenant(tenantId)])
    const stored = localStorage.getItem(STORAGE_KEY)
    const currentBotId = stored && bots.some((b) => b.id === stored) ? stored : (bots[0]?.id ?? null)
    set({ bots, currentBotId, tenantName: tenant?.name ?? null, loading: false, loaded: true })
  },
  setCurrentBot: (id) => {
    localStorage.setItem(STORAGE_KEY, id)
    set({ currentBotId: id })
  },
  refreshCurrentBot: async () => {
    const { currentBotId } = get()
    if (!currentBotId) return
    const bot = await botService.getBotById(currentBotId)
    if (bot) set((state) => ({ bots: state.bots.map((b) => (b.id === bot.id ? bot : b)) }))
  },
  currentBot: () => {
    const { bots, currentBotId } = get()
    return bots.find((b) => b.id === currentBotId) ?? null
  },
}))
