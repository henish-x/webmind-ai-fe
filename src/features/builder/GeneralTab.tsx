import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { toast } from '@/components/Toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useCurrentBot } from './useCurrentBot'

export function GeneralTab() {
  const { bot, loading, save } = useCurrentBot()
  const [name, setName] = useState('')
  const [domains, setDomains] = useState('')
  const [live, setLive] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!bot) return
    setName(bot.name)
    setDomains(bot.domains.join(', '))
    setLive(bot.status === 'active')
  }, [bot])

  async function handleSave() {
    setSaving(true)
    await save({
      name,
      domains: domains.split(',').map((d) => d.trim()).filter(Boolean),
      status: live ? 'active' : 'paused',
    })
    setSaving(false)
    toast({ title: 'Changes saved', variant: 'success' })
  }

  if (loading || !bot) return <p className="text-body text-ink-secondary">Loading…</p>

  return (
    <div className="max-w-lg space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="bot-name">Bot name</Label>
        <Input id="bot-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bot-domains">Connected domains</Label>
        <Input id="bot-domains" value={domains} onChange={(e) => setDomains(e.target.value)} placeholder="yoursite.com, www.yoursite.com" />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-hairline p-3">
        <div>
          <p className="text-meta font-medium text-ink-primary">{live ? 'Live' : 'Paused'}</p>
          <p className="text-caption text-ink-secondary">{live ? 'Visitors can chat with this bot right now.' : 'The widget is hidden from visitors.'}</p>
        </div>
        <Switch checked={live} onCheckedChange={setLive} aria-label="Bot live status" />
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  )
}
