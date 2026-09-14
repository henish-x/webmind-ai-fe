import type { Conversation, ConversationStatus, Lane, Lead, Message, Ticket } from '../types'
import { delay, genId, getDb, persist } from '../store/db'

export interface ConversationFilters {
  lane?: Lane | 'all'
  status?: ConversationStatus
  search?: string
  dateFrom?: string
  dateTo?: string
}

export async function getConversations(botId: string, filters: ConversationFilters = {}): Promise<Conversation[]> {
  let list = getDb().conversations.filter((c) => c.botId === botId)
  if (filters.lane && filters.lane !== 'all') list = list.filter((c) => c.lane === filters.lane || c.lane === 'both')
  if (filters.status) list = list.filter((c) => c.status === filters.status)
  if (filters.dateFrom) list = list.filter((c) => c.startedAt >= filters.dateFrom!)
  if (filters.dateTo) list = list.filter((c) => c.startedAt <= filters.dateTo!)
  if (filters.search) {
    const q = filters.search.toLowerCase()
    list = list.filter(
      (c) => c.visitorName?.toLowerCase().includes(q) || c.lastMessagePreview.toLowerCase().includes(q),
    )
  }
  return delay([...list].sort((a, b) => (a.lastMessageAt < b.lastMessageAt ? 1 : -1)))
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  return delay(getDb().conversations.find((c) => c.id === id) ?? null)
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  return delay(
    getDb()
      .messages.filter((m) => m.conversationId === conversationId)
      .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1)),
  )
}

export async function sendMessage(
  conversationId: string,
  body: string,
  author: Message['author'],
): Promise<Message> {
  const db = getDb()
  const message: Message = {
    id: genId('msg'),
    conversationId,
    author,
    body,
    createdAt: new Date().toISOString(),
    intent: null,
    intentConfidence: null,
    citedSources: [],
    feedback: null,
  }
  db.messages.push(message)
  const conversation = db.conversations.find((c) => c.id === conversationId)
  if (conversation) {
    conversation.lastMessageAt = message.createdAt
    conversation.lastMessagePreview = body
  }
  persist()
  return delay(message, 150)
}

export async function updateConversationStatus(id: string, status: ConversationStatus): Promise<Conversation> {
  const db = getDb()
  const conversation = db.conversations.find((c) => c.id === id)
  if (!conversation) throw new Error(`Conversation ${id} not found`)
  conversation.status = status
  persist()
  return delay(conversation)
}

export async function retagLane(id: string, lane: Lane): Promise<Conversation> {
  const db = getDb()
  const conversation = db.conversations.find((c) => c.id === id)
  if (!conversation) throw new Error(`Conversation ${id} not found`)
  conversation.lane = lane
  persist()
  return delay(conversation)
}

export async function takeOverConversation(id: string, agentName: string): Promise<Conversation> {
  const db = getDb()
  const conversation = db.conversations.find((c) => c.id === id)
  if (!conversation) throw new Error(`Conversation ${id} not found`)
  conversation.agentTakenOverBy = agentName
  persist()
  return delay(conversation)
}

export async function getLeadByConversationId(conversationId: string): Promise<Lead | null> {
  return delay(getDb().leads.find((l) => l.conversationId === conversationId) ?? null)
}

export async function getTicketByConversationId(conversationId: string): Promise<Ticket | null> {
  return delay(getDb().tickets.find((t) => t.conversationId === conversationId) ?? null)
}

export async function deleteAllConversationData(botId: string): Promise<void> {
  const db = getDb()
  const conversationIds = new Set(db.conversations.filter((c) => c.botId === botId).map((c) => c.id))
  db.conversations = db.conversations.filter((c) => c.botId !== botId)
  db.messages = db.messages.filter((m) => !conversationIds.has(m.conversationId))
  db.leads = db.leads.filter((l) => l.botId !== botId)
  db.tickets = db.tickets.filter((t) => t.botId !== botId)
  persist()
  return delay(undefined, 400)
}

export async function markRead(id: string): Promise<void> {
  const db = getDb()
  const conversation = db.conversations.find((c) => c.id === id)
  if (conversation) conversation.unread = false
  persist()
  return delay(undefined, 0)
}
