import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { toast } from '@/components/Toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { teamService } from '@/data/services'
import type { InjectionIncident } from '@/data/types'
import { formatDateTime } from '@/lib/formatters'
import { useCurrentBot } from '@/features/builder/useCurrentBot'
import { useBotStore } from '@/state/useBotStore'

export function GuardrailsTab() {
  const { bot, loading, save } = useCurrentBot()
  const currentBotId = useBotStore((s) => s.currentBotId)
  const [allowList, setAllowList] = useState('')
  const [denyList, setDenyList] = useState('')
  const [confidence, setConfidence] = useState(70)
  const [perVisitor, setPerVisitor] = useState(20)
  const [perTenant, setPerTenant] = useState(2000)
  const [incidents, setIncidents] = useState<InjectionIncident[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!bot) return
    setAllowList(bot.guardrails.topicAllowList.join(', '))
    setDenyList(bot.guardrails.topicDenyList.join(', '))
    setConfidence(bot.supportLane.confidenceThreshold)
    setPerVisitor(bot.guardrails.rateLimitPerVisitorPerMin)
    setPerTenant(bot.guardrails.rateLimitPerTenantPerMin)
  }, [bot])

  useEffect(() => {
    if (!currentBotId) return
    teamService.getInjectionIncidents(currentBotId).then(setIncidents)
  }, [currentBotId])

  async function handleSave() {
    if (!bot) return
    setSaving(true)
    await save({
      guardrails: {
        topicAllowList: allowList.split(',').map((t) => t.trim()).filter(Boolean),
        topicDenyList: denyList.split(',').map((t) => t.trim()).filter(Boolean),
        rateLimitPerVisitorPerMin: perVisitor,
        rateLimitPerTenantPerMin: perTenant,
      },
      supportLane: { ...bot.supportLane, confidenceThreshold: confidence },
    })
    setSaving(false)
    toast({ title: 'Guardrails updated', variant: 'success' })
  }

  if (loading || !bot) return <p className="text-body text-ink-secondary">Loading…</p>

  return (
    <div className="max-w-2xl space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="allow-list">Topic allow list</Label>
          <Input id="allow-list" value={allowList} onChange={(e) => setAllowList(e.target.value)} placeholder="pricing, features, support" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="deny-list">Topic deny list</Label>
          <Input id="deny-list" value={denyList} onChange={(e) => setDenyList(e.target.value)} placeholder="legal advice, medical advice" />
        </div>
      </div>

      <div>
        <Label>Default confidence threshold ({confidence}%)</Label>
        <Slider value={[confidence]} onValueChange={([v]) => setConfidence(v)} min={0} max={100} step={5} className="mt-3 max-w-sm" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="rl-visitor">Rate limit — per visitor / min</Label>
          <Input id="rl-visitor" type="number" min={1} value={perVisitor} onChange={(e) => setPerVisitor(Number(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rl-tenant">Rate limit — per tenant / min</Label>
          <Input id="rl-tenant" type="number" min={1} value={perTenant} onChange={(e) => setPerTenant(Number(e.target.value))} />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save changes'}
      </Button>

      <div className="rounded-lg border border-hairline bg-surface-card p-4">
        <p className="mb-1 text-card-title font-medium text-ink-primary">Prompt-injection incident log</p>
        <p className="mb-3 text-caption text-ink-secondary">Flagged attempts to override the bot's system behavior — read-only, for transparency.</p>
        {incidents.length === 0 ? (
          <p className="text-meta text-ink-secondary">No incidents recorded.</p>
        ) : (
          <ul className="divide-y divide-hairline">
            {incidents.map((incident) => (
              <li key={incident.id} className="flex items-start justify-between gap-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-meta text-ink-primary">&quot;{incident.snippet}&quot;</p>
                  <p className="text-caption text-ink-muted">{formatDateTime(incident.occurredAt)}</p>
                </div>
                <span className="shrink-0 rounded-full bg-warning/10 px-2 py-0.5 text-caption font-medium capitalize text-warning">
                  {incident.action}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
