import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { toast } from '@/components/Toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { integrationService } from '@/data/services'
import type { CaptureField, Integration, NotificationChannel, QualificationQuestion } from '@/data/types'
import { cn, focusRing } from '@/lib/utils'
import { useCurrentBot } from './useCurrentBot'

function reorder<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const next = [...list]
  const target = index + direction
  if (target < 0 || target >= next.length) return next
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

export function LaneConfigTab() {
  const { bot, loading, save } = useCurrentBot()
  const [helpdesks, setHelpdesks] = useState<Integration[]>([])
  const [crms, setCrms] = useState<Integration[]>([])

  const [confidence, setConfidence] = useState(70)
  const [maxTurns, setMaxTurns] = useState(4)
  const [thumbsDown, setThumbsDown] = useState(true)
  const [escalationKeywords, setEscalationKeywords] = useState('')
  const [helpdeskId, setHelpdeskId] = useState<string | null>(null)

  const [captureFields, setCaptureFields] = useState<CaptureField[]>([])
  const [questions, setQuestions] = useState<QualificationQuestion[]>([])
  const [crmId, setCrmId] = useState<string | null>(null)
  const [notifChannel, setNotifChannel] = useState<NotificationChannel>('email')
  const [schedulingLink, setSchedulingLink] = useState('')

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    integrationService.getIntegrations().then((all) => {
      setHelpdesks(all.filter((i) => i.category === 'helpdesk'))
      setCrms(all.filter((i) => i.category === 'crm'))
    })
  }, [])

  useEffect(() => {
    if (!bot) return
    setConfidence(bot.supportLane.confidenceThreshold)
    setMaxTurns(bot.supportLane.maxTurnsBeforeEscalation)
    setThumbsDown(bot.supportLane.escalateOnThumbsDown)
    setEscalationKeywords(bot.supportLane.escalationKeywords.join(', '))
    setHelpdeskId(bot.supportLane.connectedHelpdeskIntegrationId)

    setCaptureFields(bot.salesLane.captureFields)
    setQuestions(bot.salesLane.qualificationQuestions)
    setCrmId(bot.salesLane.connectedCrmIntegrationId)
    setNotifChannel(bot.salesLane.notificationChannel)
    setSchedulingLink(bot.salesLane.schedulingLink ?? '')
  }, [bot])

  function addQuestion() {
    setQuestions((prev) => [...prev, { id: `q_${Date.now()}`, label: '', order: prev.length + 1 }])
  }

  async function handleSave() {
    setSaving(true)
    await save({
      supportLane: {
        confidenceThreshold: confidence,
        maxTurnsBeforeEscalation: maxTurns,
        escalateOnThumbsDown: thumbsDown,
        escalationKeywords: escalationKeywords.split(',').map((k) => k.trim()).filter(Boolean),
        connectedHelpdeskIntegrationId: helpdeskId,
      },
      salesLane: {
        captureFields,
        qualificationQuestions: questions.filter((q) => q.label.trim()),
        connectedCrmIntegrationId: crmId,
        notificationChannel: notifChannel,
        schedulingLink: schedulingLink || null,
      },
    })
    setSaving(false)
    toast({ title: 'Changes saved', variant: 'success' })
  }

  if (loading || !bot) return <p className="text-body text-ink-secondary">Loading…</p>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="overflow-hidden rounded-lg border border-hairline">
        <div className="bg-support-50 px-4 py-2.5">
          <p className="text-meta font-medium text-support-700">Support lane</p>
        </div>
        <div className="space-y-5 p-4">
          <div>
            <Label>How sure should the bot be before answering? ({confidence}%)</Label>
            <Slider value={[confidence]} onValueChange={([v]) => setConfidence(v)} min={0} max={100} step={5} className="mt-3" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="max-turns">Max turns before escalation</Label>
              <Input id="max-turns" type="number" min={1} value={maxTurns} onChange={(e) => setMaxTurns(Number(e.target.value))} />
            </div>
            <div className="flex items-center justify-between rounded-md border border-hairline px-3">
              <Label htmlFor="thumbs-down" className="text-meta">
                Escalate on thumbs-down
              </Label>
              <Switch id="thumbs-down" checked={thumbsDown} onCheckedChange={setThumbsDown} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="escalation-keywords">Escalation keyword triggers</Label>
            <Input id="escalation-keywords" value={escalationKeywords} onChange={(e) => setEscalationKeywords(e.target.value)} placeholder="refund, complaint, talk to a human" />
          </div>
          <div className="space-y-1.5">
            <Label>Connected helpdesk</Label>
            <Select value={helpdeskId ?? 'none'} onValueChange={(v) => setHelpdeskId(v === 'none' ? null : v)}>
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {helpdesks.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-hairline">
        <div className="bg-sales-50 px-4 py-2.5">
          <p className="text-meta font-medium text-sales-700">Sales lane</p>
        </div>
        <div className="space-y-5 p-4">
          <div className="space-y-1.5">
            <Label>Fields to capture (in order)</Label>
            <div className="space-y-1.5">
              {captureFields.map((field, i) => (
                <div key={field} className="flex items-center gap-2 rounded-md border border-hairline px-3 py-1.5">
                  <span className="flex-1 text-meta capitalize text-ink-primary">{field}</span>
                  <button type="button" disabled={i === 0} onClick={() => setCaptureFields((p) => reorder(p, i, -1))} className={cn('rounded p-1 text-ink-muted hover:text-ink-primary disabled:opacity-30', focusRing)} aria-label={`Move ${field} up`}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" disabled={i === captureFields.length - 1} onClick={() => setCaptureFields((p) => reorder(p, i, 1))} className={cn('rounded p-1 text-ink-muted hover:text-ink-primary disabled:opacity-30', focusRing)} aria-label={`Move ${field} down`}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Qualification questions</Label>
            <div className="space-y-2">
              {questions.map((q) => (
                <div key={q.id} className="flex items-center gap-2">
                  <Input
                    value={q.label}
                    onChange={(e) => setQuestions((prev) => prev.map((p) => (p.id === q.id ? { ...p, label: e.target.value } : p)))}
                    placeholder="Ask a question…"
                  />
                  <button type="button" onClick={() => setQuestions((prev) => prev.filter((p) => p.id !== q.id))} aria-label="Remove question" className={cn('shrink-0 rounded-md p-1.5 text-ink-muted hover:text-danger', focusRing)}>
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addQuestion} className={cn('flex items-center gap-1 rounded-md py-1 text-meta font-medium text-sales-700', focusRing)}>
              <Plus className="h-3.5 w-3.5" /> Add question
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Connected CRM</Label>
              <Select value={crmId ?? 'none'} onValueChange={(v) => setCrmId(v === 'none' ? null : v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {crms.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Notification channel</Label>
              <Select value={notifChannel} onValueChange={(v) => setNotifChannel(v as NotificationChannel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slack">Slack</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="scheduling-link">Scheduling link</Label>
            <Input id="scheduling-link" value={schedulingLink} onChange={(e) => setSchedulingLink(e.target.value)} placeholder="https://cal.com/you/intro" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-hairline bg-surface-sunken p-3 text-caption text-ink-secondary">
        <p className="font-medium text-ink-primary">Active keyword rules</p>
        <p className="mt-1">
          {bot.keywordRules.filter((r) => r.active).length} custom rules are routing specific phrases to a lane. Full rule editing lives in{' '}
          <span className="font-medium text-ink-primary">Settings → Guardrails</span>.
        </p>
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  )
}
