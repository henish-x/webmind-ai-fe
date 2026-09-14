import type { Chunk, Source } from '../types'
import { buildChunks, buildSources } from '../seed/seedTenant'
import { delay, genId, getDb, persist } from '../store/db'

export async function getSources(botId: string): Promise<Source[]> {
  return delay(getDb().sources.filter((s) => s.botId === botId))
}

export async function getChunks(sourceId: string): Promise<Chunk[]> {
  return delay(getDb().chunks.filter((c) => c.sourceId === sourceId))
}

export async function setChunkExcluded(chunkId: string, excluded: boolean): Promise<Chunk> {
  const db = getDb()
  const chunk = db.chunks.find((c) => c.id === chunkId)
  if (!chunk) throw new Error(`Chunk ${chunkId} not found`)
  chunk.excluded = excluded
  persist()
  return delay(chunk)
}

export async function updateChunkContent(chunkId: string, content: string): Promise<Chunk> {
  const db = getDb()
  const chunk = db.chunks.find((c) => c.id === chunkId)
  if (!chunk) throw new Error(`Chunk ${chunkId} not found`)
  chunk.content = content
  persist()
  return delay(chunk)
}

export async function setSourceExcluded(sourceId: string, excluded: boolean): Promise<Source> {
  const db = getDb()
  const source = db.sources.find((s) => s.id === sourceId)
  if (!source) throw new Error(`Source ${sourceId} not found`)
  source.excluded = excluded
  persist()
  return delay(source)
}

export async function deleteSource(sourceId: string): Promise<void> {
  const db = getDb()
  db.sources = db.sources.filter((s) => s.id !== sourceId)
  db.chunks = db.chunks.filter((c) => c.sourceId !== sourceId)
  persist()
  return delay(undefined)
}

export async function recrawlSource(sourceId: string): Promise<Source> {
  const db = getDb()
  const source = db.sources.find((s) => s.id === sourceId)
  if (!source) throw new Error(`Source ${sourceId} not found`)
  source.status = 'indexed'
  source.lastCrawledAt = new Date().toISOString()
  persist()
  return delay(source, 600)
}

/** Onboarding step 2: simulates crawling a freshly pasted URL, returning discovered sources. */
export async function simulateCrawl(botId: string, url: string): Promise<Source[]> {
  const pages = ['/', '/pricing', '/about', '/faq', '/contact', '/blog']
  const domain = new URL(url).hostname
  const sources = buildSources(botId, domain, pages)
  const chunks = buildChunks(sources)
  const db = getDb()
  db.sources.push(...sources)
  db.chunks.push(...chunks)
  persist()
  return delay(sources, 1200)
}

export async function addManualSource(botId: string, name: string, url: string | null): Promise<Source> {
  const db = getDb()
  const source: Source = {
    id: genId('src'),
    botId,
    type: url ? 'url' : 'faq_csv',
    name,
    url,
    status: 'indexed',
    excluded: false,
    chunkCount: 1,
    lastCrawledAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
  db.sources.push(source)
  persist()
  return delay(source)
}
