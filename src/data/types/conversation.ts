export type Lane = 'support' | 'sales' | 'both' | 'other'

/** Support conversations use open/resolved/escalated; sales conversations use new/qualified/converted. */
export type ConversationStatus = 'open' | 'resolved' | 'escalated' | 'new' | 'qualified' | 'converted'

export interface Conversation {
  id: string
  botId: string
  lane: Lane
  status: ConversationStatus
  visitorId: string
  visitorName: string | null
  visitorEmail: string | null
  sourcePage: string
  startedAt: string
  lastMessageAt: string
  lastMessagePreview: string
  unread: boolean
  agentTakenOverBy: string | null
}
