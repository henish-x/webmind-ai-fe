import type { Integration } from '../types'
import { delay, getDb, persist } from '../store/db'

export async function getIntegrations(): Promise<Integration[]> {
  return delay(getDb().integrations)
}

export async function connectIntegration(id: string): Promise<Integration> {
  const db = getDb()
  const integration = db.integrations.find((i) => i.id === id)
  if (!integration) throw new Error(`Integration ${id} not found`)
  integration.connected = true
  integration.connectedAt = new Date().toISOString()
  persist()
  return delay(integration, 500)
}

export async function disconnectIntegration(id: string): Promise<Integration> {
  const db = getDb()
  const integration = db.integrations.find((i) => i.id === id)
  if (!integration) throw new Error(`Integration ${id} not found`)
  integration.connected = false
  integration.connectedAt = null
  persist()
  return delay(integration)
}
