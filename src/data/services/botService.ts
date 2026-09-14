import type { Bot } from '../types'
import { delay, genId, getDb, persist } from '../store/db'
import { buildBots } from '../seed/seedTenant'

export async function getBots(tenantId: string): Promise<Bot[]> {
  return delay(getDb().bots.filter((b) => b.tenantId === tenantId))
}

export async function getBotById(id: string): Promise<Bot | null> {
  return delay(getDb().bots.find((b) => b.id === id) ?? null)
}

export async function updateBot(id: string, patch: Partial<Bot>): Promise<Bot> {
  const db = getDb()
  const index = db.bots.findIndex((b) => b.id === id)
  if (index === -1) throw new Error(`Bot ${id} not found`)
  db.bots[index] = { ...db.bots[index], ...patch }
  persist()
  return delay(db.bots[index])
}

/** Onboarding step 1: creates a draft bot from a pasted URL. */
export async function createBotFromUrl(tenantId: string, url: string): Promise<Bot> {
  const db = getDb()
  const [template] = buildBots(tenantId)
  const domain = new URL(url).hostname
  const bot: Bot = {
    ...template,
    id: genId('bot'),
    name: domain,
    domains: [domain],
    status: 'crawling',
    onboardingCompletedAt: null,
    createdAt: new Date().toISOString(),
  }
  db.bots.push(bot)
  persist()
  return delay(bot, 400)
}

export async function deleteBot(id: string): Promise<void> {
  const db = getDb()
  db.bots = db.bots.filter((b) => b.id !== id)
  persist()
  return delay(undefined, 400)
}

export async function completeOnboarding(id: string): Promise<Bot> {
  return updateBot(id, { status: 'active', onboardingCompletedAt: new Date().toISOString() })
}
