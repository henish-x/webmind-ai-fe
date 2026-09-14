export type TeamRole = 'admin' | 'agent' | 'viewer'

export interface TeamMember {
  id: string
  tenantId: string
  name: string
  email: string
  role: TeamRole
  status: 'active' | 'invited'
  lastActiveAt: string | null
  invitedAt: string
}

export interface ApiKey {
  id: string
  tenantId: string
  name: string
  keyPrefix: string
  createdAt: string
  lastUsedAt: string | null
  revoked: boolean
  usageCount: number
}

export interface InjectionIncident {
  id: string
  botId: string
  snippet: string
  action: 'blocked' | 'flagged'
  occurredAt: string
}
