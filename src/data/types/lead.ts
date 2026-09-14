export type LeadStage = 'new' | 'qualified' | 'demo' | 'converted' | 'partial'
export type CrmSyncStatus = 'synced' | 'pending' | 'failed' | 'not_connected'

export interface Lead {
  id: string
  botId: string
  conversationId: string
  name: string | null
  email: string | null
  phone: string | null
  qualificationAnswers: Record<string, string>
  stage: LeadStage
  crmSyncStatus: CrmSyncStatus
  sourcePage: string
  capturedAt: string
}

export interface Ticket {
  id: string
  botId: string
  conversationId: string
  status: 'open' | 'pending' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  assignedAgentId: string | null
  createdAt: string
  resolvedAt: string | null
}
