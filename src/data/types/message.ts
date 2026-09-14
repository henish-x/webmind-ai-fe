import type { Lane } from './conversation'

export interface CitedSource {
  sourceId: string
  sourceName: string
  chunkId: string
}

export interface Message {
  id: string
  conversationId: string
  author: 'visitor' | 'bot' | 'agent'
  body: string
  createdAt: string
  intent: Lane | null
  intentConfidence: number | null
  citedSources: CitedSource[]
  feedback: 'up' | 'down' | null
}
