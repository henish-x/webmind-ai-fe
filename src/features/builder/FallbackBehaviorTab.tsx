import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { toast } from '@/components/Toast'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCurrentBot } from './useCurrentBot'

export function FallbackBehaviorTab() {
  const { bot, loading, save } = useCurrentBot()
  const [message, setMessage] = useState('')
  const [phrases, setPhrases] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!bot) return
    setMessage(bot.fallback.lowConfidenceMessage)
    setPhrases(bot.fallback.humanTriggerPhrases.join(', '))
  }, [bot])

  async function handleSave() {
    setSaving(true)
    await save({
      fallback: {
        lowConfidenceMessage: message,
        humanTriggerPhrases: phrases.split(',').map((p) => p.trim()).filter(Boolean),
      },
    })
    setSaving(false)
    toast({ title: 'Changes saved', variant: 'success' })
  }

  if (loading || !bot) return <p className="text-body text-ink-secondary">Loading…</p>

  return (
    <div className="max-w-lg space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="fallback-message">What the bot says when it can&apos;t classify a message confidently</Label>
        <Textarea id="fallback-message" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="trigger-phrases">&quot;Talk to a human&quot; trigger phrases</Label>
        <Textarea id="trigger-phrases" value={phrases} onChange={(e) => setPhrases(e.target.value)} placeholder="talk to a human, speak to someone, real person" />
        <p className="text-caption text-ink-secondary">A visitor can always request a human, regardless of confidence score.</p>
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  )
}
