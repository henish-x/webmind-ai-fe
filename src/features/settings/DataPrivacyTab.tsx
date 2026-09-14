import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { ConfirmModal } from '@/components/Modal'
import { toast } from '@/components/Toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { conversationService } from '@/data/services'
import { useCurrentBot } from '@/features/builder/useCurrentBot'
import { useBotStore } from '@/state/useBotStore'

export function DataPrivacyTab() {
  const { bot, loading, save } = useCurrentBot()
  const currentBotId = useBotStore((s) => s.currentBotId)
  const [retentionDays, setRetentionDays] = useState(180)
  const [piiMasking, setPiiMasking] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!bot) return
    setRetentionDays(bot.dataRetentionDays)
    setPiiMasking(bot.piiMaskingEnabled)
  }, [bot])

  async function handleSave() {
    setSaving(true)
    await save({ dataRetentionDays: retentionDays, piiMaskingEnabled: piiMasking })
    setSaving(false)
    toast({ title: 'Changes saved', variant: 'success' })
  }

  async function handleDeleteAll() {
    if (!currentBotId) return
    setDeleting(true)
    await conversationService.deleteAllConversationData(currentBotId)
    setDeleting(false)
    setDeleteOpen(false)
    toast({ title: 'Conversation data deleted', description: 'All conversations, leads, and tickets were removed.', variant: 'success' })
  }

  if (loading || !bot) return <p className="text-body text-ink-secondary">Loading…</p>

  return (
    <div className="max-w-lg space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="retention">Data retention period (days)</Label>
        <Input id="retention" type="number" min={1} value={retentionDays} onChange={(e) => setRetentionDays(Number(e.target.value))} className="max-w-xs" />
        <p className="text-caption text-ink-secondary">Conversations older than this are automatically purged.</p>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-hairline p-3">
        <div>
          <p className="text-meta font-medium text-ink-primary">Mask PII in logs</p>
          <p className="text-caption text-ink-secondary">Emails, phone numbers, and card numbers are hidden in analytics and log views by default.</p>
        </div>
        <Switch checked={piiMasking} onCheckedChange={setPiiMasking} aria-label="PII masking" />
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save changes'}
      </Button>

      <div className="rounded-lg border border-danger/40 p-4">
        <p className="text-meta font-medium text-ink-primary">Delete all conversation data</p>
        <p className="mt-1 text-caption text-ink-secondary">
          Permanently removes every conversation, message, lead, and ticket for this bot. This can&apos;t be undone.
        </p>
        <Button variant="destructive" size="sm" className="mt-3" onClick={() => setDeleteOpen(true)}>
          Delete all conversation data
        </Button>
      </div>

      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete all conversation data"
        description="This permanently deletes every conversation, lead, and ticket for this bot. This cannot be undone."
        confirmLabel="Delete everything"
        confirmWord="delete"
        loading={deleting}
        onConfirm={handleDeleteAll}
      />
    </div>
  )
}
