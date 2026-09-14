import type { Bot, Conversation, ConversationStatus, Lane, Lead, Message, Ticket } from '../types'
import { genId } from '../store/db'

const DAY = 24 * 60 * 60 * 1000

const VISITOR_NAMES = [
  'Amara Chen', 'Leo Fischer', 'Nadia Osei', 'Marcus Wells', 'Ines Duarte',
  'Tobias Rahn', 'Farah Aziz', 'Callum Reid', 'Yuki Tanaka', 'Priya Bose',
  null, null, null, // some visitors stay anonymous until captured
]

const MERIDIAN_SUPPORT_QUESTIONS = [
  'When is the possession date for Phase 2?',
  'Is parking included in the maintenance fee?',
  'Can I get a copy of the floor plan for a 3BHK?',
  'What amenities are included in the clubhouse?',
  'Is the project RERA registered?',
]
const MERIDIAN_SALES_QUESTIONS = [
  "I'm interested in a 2BHK, what's the starting price?",
  'Can I schedule a site visit this weekend?',
  'Do you have any ready-to-move units left?',
  'What financing partners do you work with?',
]
const FLOWLY_SUPPORT_QUESTIONS = [
  'How do I connect Flowly to Slack?',
  'My export is stuck at 90%, what do I do?',
  'How do I invite a new teammate?',
  'Is there an API rate limit?',
]
const FLOWLY_SALES_QUESTIONS = [
  "What's included in the Team plan?",
  'Do you offer a discount for annual billing?',
  'Can we get a demo for a 40-person team?',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function weightedLane(): Lane {
  const r = Math.random()
  if (r < 0.55) return 'support'
  if (r < 0.85) return 'sales'
  if (r < 0.95) return 'both'
  return 'other'
}

function statusForLane(lane: Lane): ConversationStatus {
  const r = Math.random()
  if (lane === 'sales') {
    if (r < 0.4) return 'new'
    if (r < 0.75) return 'qualified'
    return 'converted'
  }
  // support, both, other
  if (r < 0.68) return 'resolved'
  if (r < 0.88) return 'open'
  return 'escalated'
}

function questionsFor(bot: Bot, lane: Lane): string[] {
  const isMeridian = bot.id === 'bot_meridian_main'
  if (lane === 'sales') return isMeridian ? MERIDIAN_SALES_QUESTIONS : FLOWLY_SALES_QUESTIONS
  if (lane === 'support') return isMeridian ? MERIDIAN_SUPPORT_QUESTIONS : FLOWLY_SUPPORT_QUESTIONS
  return isMeridian
    ? [...MERIDIAN_SUPPORT_QUESTIONS, ...MERIDIAN_SALES_QUESTIONS]
    : [...FLOWLY_SUPPORT_QUESTIONS, ...FLOWLY_SALES_QUESTIONS]
}

export function seedConversationsForBot(bot: Bot, pages: string[]) {
  const conversations: Conversation[] = []
  const messages: Message[] = []
  const leads: Lead[] = []
  const tickets: Ticket[] = []

  const count = 45
  for (let i = 0; i < count; i++) {
    const lane = weightedLane()
    const status = statusForLane(lane)
    const startedAt = Date.now() - Math.floor(Math.random() * 30) * DAY - Math.floor(Math.random() * DAY)
    const visitorName = pick(VISITOR_NAMES)
    const visitorId = genId('visitor')
    const conversationId = genId('conv')
    const questions = questionsFor(bot, lane)
    const opener = pick(questions)

    const msgCount = 3 + Math.floor(Math.random() * 5)
    let cursor = startedAt
    const convoMessages: Message[] = []
    convoMessages.push({
      id: genId('msg'),
      conversationId,
      author: 'visitor',
      body: opener,
      createdAt: new Date(cursor).toISOString(),
      intent: lane === 'other' ? null : lane,
      intentConfidence: lane === 'other' ? 40 + Math.random() * 15 : 68 + Math.random() * 30,
      citedSources: [],
      feedback: null,
    })

    for (let m = 1; m < msgCount; m++) {
      cursor += (2 + Math.random() * 20) * 60 * 1000
      const author = m % 2 === 1 ? 'bot' : 'visitor'
      const isLastBotTurn = author === 'bot' && m === msgCount - 2
      convoMessages.push({
        id: genId('msg'),
        conversationId,
        author: author === 'bot' && status === 'escalated' && m === msgCount - 1 ? 'agent' : author,
        body:
          author === 'bot'
            ? "Here's what I found — let me know if that answers your question."
            : pick(['Got it, thanks.', 'Can you say more?', 'That helps.', "That's exactly what I needed."]),
        createdAt: new Date(cursor).toISOString(),
        intent: author === 'visitor' ? lane : null,
        intentConfidence: author === 'visitor' ? 60 + Math.random() * 35 : null,
        citedSources:
          isLastBotTurn && lane !== 'sales'
            ? [{ sourceId: genId('src'), sourceName: pick(pages), chunkId: genId('chk') }]
            : [],
        feedback: null,
      })
    }
    messages.push(...convoMessages)

    const lastMessage = convoMessages[convoMessages.length - 1]
    conversations.push({
      id: conversationId,
      botId: bot.id,
      lane,
      status,
      visitorId,
      visitorName,
      visitorEmail: visitorName ? `${visitorName.toLowerCase().replace(' ', '.')}@example.com` : null,
      sourcePage: pick(pages),
      startedAt: new Date(startedAt).toISOString(),
      lastMessageAt: lastMessage.createdAt,
      lastMessagePreview: lastMessage.body,
      unread: Math.random() < 0.2,
      agentTakenOverBy: status === 'escalated' && Math.random() < 0.4 ? 'Rohan Mehta' : null,
    })

    if (lane === 'sales' || lane === 'both') {
      const abandoned = Math.random() < 0.25
      leads.push({
        id: genId('lead'),
        botId: bot.id,
        conversationId,
        name: visitorName,
        email: visitorName ? `${visitorName.toLowerCase().replace(' ', '.')}@example.com` : null,
        phone: abandoned ? null : '+1 555 0100',
        qualificationAnswers: abandoned ? {} : { q1: 'Within budget', q2: 'Next quarter' },
        stage: abandoned ? 'partial' : status === 'converted' ? 'converted' : status === 'qualified' ? 'qualified' : 'new',
        crmSyncStatus: bot.salesLane.connectedCrmIntegrationId ? (abandoned ? 'pending' : 'synced') : 'not_connected',
        sourcePage: pick(pages),
        capturedAt: lastMessage.createdAt,
      })
    }

    if (status === 'escalated') {
      tickets.push({
        id: genId('ticket'),
        botId: bot.id,
        conversationId,
        status: Math.random() < 0.5 ? 'open' : 'pending',
        priority: pick(['low', 'medium', 'high']),
        assignedAgentId: Math.random() < 0.6 ? 'Rohan Mehta' : null,
        createdAt: lastMessage.createdAt,
        resolvedAt: null,
      })
    }
  }

  return { conversations, messages, leads, tickets }
}
