import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/Button'
import { Progress } from '@/components/ui/progress'
import { sourceService } from '@/data/services'
import type { Source } from '@/data/types'

export interface CrawlingStepProps {
  botId: string
  url: string
  onDone: (sources: Source[]) => void
}

export function CrawlingStep({ botId, url, onDone }: CrawlingStepProps) {
  const [revealed, setRevealed] = useState<Source[]>([])
  const [allSources, setAllSources] = useState<Source[] | null>(null)
  const [failed, setFailed] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    sourceService
      .simulateCrawl(botId, url)
      .then((sources) => setAllSources(sources))
      .catch(() => setFailed(true))
  }, [botId, url])

  useEffect(() => {
    if (!allSources) return
    if (revealed.length >= allSources.length) return
    const timer = setTimeout(() => {
      setRevealed((prev) => [...prev, allSources[prev.length]])
    }, 280)
    return () => clearTimeout(timer)
  }, [allSources, revealed])

  const done = allSources !== null && revealed.length === allSources.length
  const tooFewPages = done && allSources!.length < 3
  const percent = allSources ? Math.round((revealed.length / allSources.length) * 100) : 5

  return (
    <div className="mx-auto max-w-lg text-center">
      <p className="text-page-title font-medium text-ink-primary">
        {done ? 'Website analyzed.' : 'Analyzing your website…'}
      </p>
      <p className="mt-2 text-body text-ink-secondary">
        {failed
          ? "We couldn't reach that URL. Check it's public and try again."
          : 'Discovering and indexing your public pages.'}
      </p>

      {!failed && (
        <>
          <Progress value={percent} className="mt-6" />
          <ul className="mt-6 space-y-1.5 text-left">
            {revealed.map((source) => (
              <li key={source.id} className="flex items-center gap-2 text-meta text-ink-secondary">
                <Check className="h-3.5 w-3.5 shrink-0 text-ink-primary" />
                Indexed: {source.name}
              </li>
            ))}
          </ul>
        </>
      )}

      {tooFewPages && (
        <div className="mt-6 rounded-lg border border-warning/40 bg-surface-card p-4 text-left">
          <p className="text-meta font-medium text-ink-primary">We only found a few pages.</p>
          <p className="mt-1 text-meta text-ink-secondary">
            You can add more content manually, or continue with what we found.
          </p>
        </div>
      )}

      {(done || failed) && (
        <Button size="lg" className="mt-8 w-full" onClick={() => onDone(allSources ?? [])} disabled={failed}>
          Continue
        </Button>
      )}
    </div>
  )
}
