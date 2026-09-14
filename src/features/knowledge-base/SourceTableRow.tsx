import { ChevronDown, ChevronRight, FileText, Globe, MoreHorizontal, Sheet } from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { sourceService } from '@/data/services'
import type { Chunk, Source } from '@/data/types'
import { formatDate } from '@/lib/formatters'
import { cn, focusRing } from '@/lib/utils'
import { SourceStatusBadge } from './SourceStatusBadge'

const TYPE_ICON = { url: Globe, pdf: FileText, docx: FileText, faq_csv: Sheet, product_csv: Sheet }

function ChunkEditRow({ chunk, onRemoved }: { chunk: Chunk; onRemoved: (id: string) => void }) {
  const [content, setContent] = useState(chunk.content)

  return (
    <div className="flex items-start gap-3 border-t border-hairline py-3 first:border-t-0">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={() => sourceService.updateChunkContent(chunk.id, content)}
        className="min-h-16 flex-1 text-meta"
      />
      <button
        type="button"
        onClick={() => onRemoved(chunk.id)}
        className={cn('shrink-0 rounded-md px-2 py-1 text-caption text-ink-muted hover:text-danger', focusRing)}
      >
        Remove
      </button>
    </div>
  )
}

export function SourceTableRow({
  source,
  onRecrawl,
  onToggleExclude,
  onDelete,
}: {
  source: Source
  onRecrawl: (id: string) => void
  onToggleExclude: (id: string, excluded: boolean) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [chunks, setChunks] = useState<Chunk[] | null>(null)
  const Icon = TYPE_ICON[source.type]

  async function toggle() {
    if (!expanded && chunks === null) {
      setChunks(await sourceService.getChunks(source.id))
    }
    setExpanded((v) => !v)
  }

  return (
    <>
      <tr
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggle()
          }
        }}
        className={cn(
          'cursor-pointer border-b border-hairline hover:bg-surface-sunken',
          source.excluded && 'opacity-50',
          focusRing,
        )}
      >
        <td className="py-3 pl-2 pr-2">
          <span aria-hidden className="block p-0.5">
            {expanded ? <ChevronDown className="h-4 w-4 text-ink-muted" /> : <ChevronRight className="h-4 w-4 text-ink-muted" />}
          </span>
        </td>
        <td className="py-3 pr-4">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.5} />
            <span className="truncate text-body text-ink-primary">{source.name}</span>
          </div>
        </td>
        <td className="py-3 pr-4">
          <SourceStatusBadge status={source.status} />
        </td>
        <td className="py-3 pr-4 text-meta text-ink-secondary">
          {source.lastCrawledAt ? formatDate(source.lastCrawledAt) : '—'}
        </td>
        <td className="py-3 pr-4 text-meta text-ink-secondary">{source.chunkCount}</td>
        <td className="py-3 pr-2 text-right" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger className={cn('rounded-md p-1.5 text-ink-muted hover:bg-surface-sunken hover:text-ink-primary', focusRing)} aria-label="Source actions">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onRecrawl(source.id)}>Re-crawl</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onToggleExclude(source.id, !source.excluded)}>
                {source.excluded ? 'Include' : 'Exclude'}
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={() => onDelete(source.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-hairline bg-surface-sunken/40">
          <td colSpan={6} className="px-4 pb-4 pl-10">
            {chunks === null ? (
              <p className="py-3 text-meta text-ink-secondary">Loading…</p>
            ) : (
              chunks.map((chunk) => (
                <ChunkEditRow
                  key={chunk.id}
                  chunk={chunk}
                  onRemoved={(id) => setChunks((prev) => prev?.filter((c) => c.id !== id) ?? null)}
                />
              ))
            )}
          </td>
        </tr>
      )}
    </>
  )
}
