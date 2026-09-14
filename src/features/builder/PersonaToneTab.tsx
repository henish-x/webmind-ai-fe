import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { toast } from '@/components/Toast'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { Tone } from '@/data/types'
import { cn, focusRing } from '@/lib/utils'
import { useCurrentBot } from './useCurrentBot'

const TONE_SAMPLES: Record<Tone, { label: string; sample: string }> = {
  professional: { label: 'Professional', sample: "Thank you for reaching out. I'd be happy to help with your inquiry." },
  friendly: { label: 'Friendly', sample: "Hey there! Happy to help — what's up?" },
  concise: { label: 'Concise', sample: 'Sure — what do you need?' },
}

export function PersonaToneTab() {
  const { bot, loading, save } = useCurrentBot()
  const [greeting, setGreeting] = useState('')
  const [tone, setTone] = useState<Tone>('friendly')
  const [autoDetect, setAutoDetect] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!bot) return
    setGreeting(bot.persona.greeting)
    setTone(bot.persona.tone)
    setAutoDetect(bot.persona.languageAutoDetect)
  }, [bot])

  async function handleSave() {
    setSaving(true)
    await save({ persona: { greeting, tone, languageAutoDetect: autoDetect } })
    setSaving(false)
    toast({ title: 'Changes saved', variant: 'success' })
  }

  if (loading || !bot) return <p className="text-body text-ink-secondary">Loading…</p>

  return (
    <div className="max-w-lg space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="greeting">Greeting message</Label>
        <Textarea id="greeting" value={greeting} onChange={(e) => setGreeting(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Tone</Label>
        <div className="space-y-2">
          {(Object.keys(TONE_SAMPLES) as Tone[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTone(key)}
              className={cn(
                'block w-full rounded-lg border p-3 text-left',
                tone === key ? 'border-ink-primary' : 'border-hairline hover:bg-surface-sunken',
                focusRing,
              )}
            >
              <p className="text-meta font-medium text-ink-primary">{TONE_SAMPLES[key].label}</p>
              <div className="mt-2 inline-block rounded-lg border border-hairline bg-surface-card px-3 py-2 text-meta text-ink-secondary">
                {TONE_SAMPLES[key].sample}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-hairline p-3">
        <div>
          <p className="text-meta font-medium text-ink-primary">Auto-detect visitor language</p>
          <p className="text-caption text-ink-secondary">Reply in the visitor's language automatically.</p>
        </div>
        <Switch checked={autoDetect} onCheckedChange={setAutoDetect} aria-label="Language auto-detect" />
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  )
}
