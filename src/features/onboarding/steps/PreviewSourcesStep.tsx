import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { sourceService } from '@/data/services'
import type { Chunk, Source } from '@/data/types'
import { cn } from '@/lib/utils'

export interface PreviewSourcesStepProps {
  sources: Source[]
  onDone: () => void
}

function ChunkRow({ chunk }: { chunk: Chunk }) {
  const [content, setContent] = useState(chunk.content)
  const [excluded, setExcluded] = useState(chunk.excluded)

  return (
    <div className="flex items-start gap-3 border-t border-hairline py-3 first:border-t-0">
      <Checkbox
        checked={!excluded}
        onCheckedChange={(checked) => {
          const next = checked !== true
          setExcluded(next)
          sourceService.setChunkExcluded(chunk.id, next)
        }}
        className="mt-1"
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={() => sourceService.updateChunkContent(chunk.id, content)}
        className={cn('min-h-16 flex-1 text-meta', excluded && 'opacity-50')}
      />
    </div>
  )
}

function SourceRow({ source }: { source: Source }) {
  const [expanded, setExpanded] = useState(false)
  const [chunks, setChunks] = useState<Chunk[] | null>(null)

  async function toggle() {
    if (!expanded && chunks === null) {
      const data = await sourceService.getChunks(source.id)
      setChunks(data)
    }
    setExpanded((v) => !v)
  }

  return (
    <div className="border-b border-hairline last:border-b-0">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-surface-sunken"
      >
        {expanded ? <ChevronDown className="h-4 w-4 text-ink-muted" /> : <ChevronRight className="h-4 w-4 text-ink-muted" />}
        <span className="flex-1 truncate text-body text-ink-primary">{source.name}</span>
        <span className="text-caption text-ink-muted">{source.chunkCount} chunks</span>
      </button>
      {expanded && (
        <div className="bg-surface-sunken/40 px-4 pb-4 pl-10">
          {chunks === null ? (
            <p className="py-3 text-meta text-ink-secondary">Loading…</p>
          ) : (
            chunks.map((chunk) => <ChunkRow key={chunk.id} chunk={chunk} />)
          )}
        </div>
      )}
    </div>
  )
}

export function PreviewSourcesStep({ sources, onDone }: PreviewSourcesStepProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <p className="text-page-title font-medium text-ink-primary">Review what we found</p>
        <p className="mt-2 text-body text-ink-secondary">
          Exclude anything that shouldn't be part of your chatbot's knowledge, or fix a chunk directly.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-hairline bg-surface-card">
        {sources.map((source) => (
          <SourceRow key={source.id} source={source} />
        ))}
      </div>

      <Button size="lg" className="mt-8 w-full" onClick={onDone}>
        Looks good, continue
      </Button>
    </div>
  )
}
