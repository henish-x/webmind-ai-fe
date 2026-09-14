import { useState } from 'react'
import { Button } from '@/components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { botService } from '@/data/services'
import { useAuthStore } from '@/state/useAuthStore'

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export interface PasteUrlStepProps {
  onDone: (botId: string, url: string) => void
}

export function PasteUrlStep({ onDone }: PasteUrlStepProps) {
  const session = useAuthStore((s) => s.session)
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) {
      setError('Enter your website URL to get started.')
      return
    }
    const normalized = normalizeUrl(url)
    let parsed: URL
    try {
      parsed = new URL(normalized)
    } catch {
      setError("We couldn't read that URL. Check it's public and try again.")
      return
    }
    setError(null)
    setLoading(true)
    try {
      const bot = await botService.createBotFromUrl(session!.tenantId, parsed.toString())
      onDone(bot.id, parsed.toString())
    } catch {
      setError("We couldn't reach that URL. Check it's public and try again.")
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg text-center">
      <p className="text-page-title font-medium text-ink-primary">Paste your website URL</p>
      <p className="mt-2 text-body text-ink-secondary">We'll only read public pages.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-3 text-left">
        <Label htmlFor="site-url" className="sr-only">
          Website URL
        </Label>
        <Input
          id="site-url"
          placeholder="www.yourbusiness.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-12 text-body"
          autoFocus
        />
        {error && (
          <p role="alert" aria-live="polite" className="text-meta text-danger">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Analyzing your website…' : 'Analyze my website'}
        </Button>
      </form>
    </div>
  )
}
