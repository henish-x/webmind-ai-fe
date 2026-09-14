export type SourceType = 'url' | 'pdf' | 'docx' | 'faq_csv' | 'product_csv'
export type SourceStatus = 'queued' | 'crawling' | 'indexed' | 'stale' | 'failed'

export interface Source {
  id: string
  botId: string
  type: SourceType
  name: string
  url: string | null
  status: SourceStatus
  excluded: boolean
  chunkCount: number
  lastCrawledAt: string | null
  createdAt: string
}

export interface Chunk {
  id: string
  sourceId: string
  content: string
  tokenCount: number
  excluded: boolean
}
