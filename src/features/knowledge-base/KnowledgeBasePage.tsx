import { RotateCw, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/Toast'
import { sourceService } from '@/data/services'
import type { Source } from '@/data/types'
import { formatDateTime } from '@/lib/formatters'
import { PageContainer } from '@/shell/PageContainer'
import { useBotStore } from '@/state/useBotStore'
import { AddSourceMenu } from './AddSourceMenu'
import { SourceTableRow } from './SourceTableRow'

export function KnowledgeBasePage() {
  const currentBotId = useBotStore((s) => s.currentBotId)
  const [sources, setSources] = useState<Source[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [recrawlingAll, setRecrawlingAll] = useState(false)

  async function reload() {
    if (!currentBotId) return
    setLoading(true)
    const data = await sourceService.getSources(currentBotId)
    setSources(data)
    setLoading(false)
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBotId])

  async function handleRecrawlAll() {
    setRecrawlingAll(true)
    await Promise.all(sources.map((s) => sourceService.recrawlSource(s.id)))
    await reload()
    setRecrawlingAll(false)
    toast({ title: 'Re-crawl complete', description: `${sources.length} sources refreshed.`, variant: 'success' })
  }

  const filtered = sources.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
  const lastSync = sources.reduce<string | null>((latest, s) => {
    if (!s.lastCrawledAt) return latest
    return !latest || s.lastCrawledAt > latest ? s.lastCrawledAt : latest
  }, null)

  return (
    <PageContainer className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-page-title font-medium text-ink-primary">Knowledge Base</p>
        {currentBotId && <AddSourceMenu botId={currentBotId} onAdded={reload} />}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
          <Input placeholder="Search sources…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-3">
          {lastSync && <p className="text-caption text-ink-muted">Last full sync: {formatDateTime(lastSync)}</p>}
          <Button variant="secondary" size="sm" onClick={handleRecrawlAll} disabled={recrawlingAll || sources.length === 0}>
            <RotateCw className="h-3.5 w-3.5" /> {recrawlingAll ? 'Re-crawling…' : 'Re-crawl all'}
          </Button>
        </div>
      </div>

      {!loading && sources.length === 0 ? (
        <div className="rounded-lg border border-hairline bg-surface-card">
          <EmptyState
            title="No content yet"
            description="Add your first source to start building your chatbot's knowledge."
            action={currentBotId && <AddSourceMenu botId={currentBotId} onAdded={reload} />}
          />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-hairline bg-surface-card">
          <table className="w-full border-collapse text-body">
            <thead>
              <tr className="border-b border-hairline text-left text-meta font-medium text-ink-secondary">
                <th className="w-8" />
                <th className="py-2.5 pr-4">Source</th>
                <th className="py-2.5 pr-4">Status</th>
                <th className="py-2.5 pr-4">Last updated</th>
                <th className="py-2.5 pr-4">Chunks</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-hairline last:border-0">
                    <td colSpan={6} className="px-4 py-3">
                      <div className="h-4 w-2/3 animate-pulse rounded bg-surface-sunken" />
                    </td>
                  </tr>
                ))}
              {!loading &&
                filtered.map((source) => (
                  <SourceTableRow
                    key={source.id}
                    source={source}
                    onRecrawl={async (id) => {
                      await sourceService.recrawlSource(id)
                      reload()
                    }}
                    onToggleExclude={async (id, excluded) => {
                      await sourceService.setSourceExcluded(id, excluded)
                      reload()
                    }}
                    onDelete={async (id) => {
                      await sourceService.deleteSource(id)
                      reload()
                    }}
                  />
                ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  )
}
