import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { useCurrentBot } from '@/features/builder/useCurrentBot'
import { ConfirmModal } from '@/components/Modal'
import { toast } from '@/components/Toast'
import { botService } from '@/data/services'
import { useAuthStore } from '@/state/useAuthStore'
import { useBotStore } from '@/state/useBotStore'

export function DangerZoneTab() {
  const { bot, loading, save } = useCurrentBot()
  const currentBotId = useBotStore((s) => s.currentBotId)
  const loadBots = useBotStore((s) => s.loadBots)
  const session = useAuthStore((s) => s.session)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const [pausing, setPausing] = useState(false)
  const [deleteBotOpen, setDeleteBotOpen] = useState(false)
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handlePauseToggle() {
    if (!bot) return
    setPausing(true)
    await save({ status: bot.status === 'paused' ? 'active' : 'paused' })
    setPausing(false)
  }

  async function handleDeleteBot() {
    if (!currentBotId || !session) return
    setBusy(true)
    await botService.deleteBot(currentBotId)
    await loadBots(session.tenantId)
    setBusy(false)
    setDeleteBotOpen(false)
    toast({ title: 'Bot deleted', variant: 'info' })
    navigate('/dashboard')
  }

  function handleDeleteAccount() {
    setDeleteAccountOpen(false)
    logout()
    navigate('/login')
  }

  if (loading || !bot) return <p className="text-body text-ink-secondary">Loading…</p>

  return (
    <div className="max-w-lg space-y-4 rounded-lg border border-danger/40 p-5">
      <p className="text-card-title font-medium text-danger">Danger zone</p>

      <div className="flex items-center justify-between border-b border-danger/20 pb-4">
        <div>
          <p className="text-meta font-medium text-ink-primary">{bot.status === 'paused' ? 'Resume bot' : 'Pause bot'}</p>
          <p className="text-caption text-ink-secondary">{bot.status === 'paused' ? 'The widget is currently hidden from visitors.' : 'Hides the widget from visitors without deleting anything.'}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handlePauseToggle} disabled={pausing}>
          {bot.status === 'paused' ? 'Resume' : 'Pause'}
        </Button>
      </div>

      <div className="flex items-center justify-between border-b border-danger/20 pb-4">
        <div>
          <p className="text-meta font-medium text-ink-primary">Delete this bot</p>
          <p className="text-caption text-ink-secondary">Permanently removes the bot, its knowledge base, and all conversations.</p>
        </div>
        <Button variant="destructive" size="sm" onClick={() => setDeleteBotOpen(true)}>
          Delete bot
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-meta font-medium text-ink-primary">Delete account</p>
          <p className="text-caption text-ink-secondary">Permanently deletes your workspace, all bots, and billing history.</p>
        </div>
        <Button variant="destructive" size="sm" onClick={() => setDeleteAccountOpen(true)}>
          Delete account
        </Button>
      </div>

      <ConfirmModal
        open={deleteBotOpen}
        onOpenChange={setDeleteBotOpen}
        title="Delete this bot"
        description={`This permanently deletes "${bot.name}" and everything attached to it.`}
        confirmLabel="Delete bot"
        confirmWord={bot.name}
        loading={busy}
        onConfirm={handleDeleteBot}
      />
      <ConfirmModal
        open={deleteAccountOpen}
        onOpenChange={setDeleteAccountOpen}
        title="Delete account"
        description="This permanently deletes your entire workspace. This cannot be undone."
        confirmLabel="Delete account"
        confirmWord="delete my account"
        onConfirm={handleDeleteAccount}
      />
    </div>
  )
}
