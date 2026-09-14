import type { ApiKey, InjectionIncident, TeamMember, TeamRole } from '../types'
import { delay, genId, getDb, persist } from '../store/db'

export async function getTeamMembers(tenantId: string): Promise<TeamMember[]> {
  return delay(getDb().teamMembers.filter((m) => m.tenantId === tenantId))
}

export async function inviteTeamMember(tenantId: string, email: string, role: TeamRole): Promise<TeamMember> {
  const db = getDb()
  const member: TeamMember = {
    id: genId('tm'),
    tenantId,
    name: email.split('@')[0].replace('.', ' '),
    email,
    role,
    status: 'invited',
    lastActiveAt: null,
    invitedAt: new Date().toISOString(),
  }
  db.teamMembers.push(member)
  persist()
  return delay(member)
}

export async function updateTeamMemberRole(id: string, role: TeamRole): Promise<TeamMember> {
  const db = getDb()
  const member = db.teamMembers.find((m) => m.id === id)
  if (!member) throw new Error(`Team member ${id} not found`)
  member.role = role
  persist()
  return delay(member)
}

export async function removeTeamMember(id: string): Promise<void> {
  const db = getDb()
  db.teamMembers = db.teamMembers.filter((m) => m.id !== id)
  persist()
  return delay(undefined)
}

export async function getApiKeys(tenantId: string): Promise<ApiKey[]> {
  return delay(getDb().apiKeys.filter((k) => k.tenantId === tenantId))
}

export async function generateApiKey(tenantId: string, name: string): Promise<ApiKey> {
  const db = getDb()
  const key: ApiKey = {
    id: genId('key'),
    tenantId,
    name,
    keyPrefix: `wm_live_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    revoked: false,
    usageCount: 0,
  }
  db.apiKeys.push(key)
  persist()
  return delay(key)
}

export async function revokeApiKey(id: string): Promise<ApiKey> {
  const db = getDb()
  const key = db.apiKeys.find((k) => k.id === id)
  if (!key) throw new Error(`API key ${id} not found`)
  key.revoked = true
  persist()
  return delay(key)
}

export async function getInjectionIncidents(botId: string): Promise<InjectionIncident[]> {
  return delay(
    getDb()
      .injectionIncidents.filter((i) => i.botId === botId)
      .sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1)),
  )
}
