import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { ConfirmModal } from '@/components/Modal'
import { toast } from '@/components/Toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { teamService } from '@/data/services'
import type { ApiKey } from '@/data/types'
import { formatDate, formatNumber, formatRelativeTime } from '@/lib/formatters'
import { useAuthStore } from '@/state/useAuthStore'

export function ApiKeysTab() {
  const session = useAuthStore((s) => s.session)
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [newKeyName, setNewKeyName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null)

  async function reload() {
    if (!session) return
    setLoading(true)
    setKeys(await teamService.getApiKeys(session.tenantId))
    setLoading(false)
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  async function handleGenerate() {
    if (!session || !newKeyName.trim()) return
    setGenerating(true)
    await teamService.generateApiKey(session.tenantId, newKeyName)
    setNewKeyName('')
    setGenerating(false)
    reload()
    toast({ title: 'API key generated', variant: 'success' })
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="new-key-name">New key name</Label>
          <Input id="new-key-name" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="e.g. Production" />
        </div>
        <Button onClick={handleGenerate} disabled={generating || !newKeyName.trim()}>
          {generating ? 'Generating…' : 'Generate key'}
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-hairline bg-surface-card">
        {loading ? (
          <p className="p-4 text-meta text-ink-secondary">Loading…</p>
        ) : keys.length === 0 ? (
          <p className="p-4 text-meta text-ink-secondary">No API keys yet.</p>
        ) : (
          <ul className="divide-y divide-hairline">
            {keys.map((key) => (
              <li key={key.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="text-meta font-medium text-ink-primary">{key.name}</p>
                  <p className="mt-0.5 font-mono text-caption text-ink-muted">{key.keyPrefix}••••••••••••</p>
                  <p className="mt-1 text-caption text-ink-secondary">
                    {formatNumber(key.usageCount)} calls · {key.lastUsedAt ? `last used ${formatRelativeTime(key.lastUsedAt)}` : 'never used'} · created {formatDate(key.createdAt)}
                  </p>
                </div>
                {key.revoked ? (
                  <span className="shrink-0 text-caption font-medium text-danger">Revoked</span>
                ) : (
                  <Button variant="ghost" size="sm" className="shrink-0 text-danger" onClick={() => setRevokeTarget(key)}>
                    Revoke
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmModal
        open={!!revokeTarget}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
        title="Revoke API key"
        description={`Requests using "${revokeTarget?.name}" will stop working immediately.`}
        confirmLabel="Revoke"
        destructive
        onConfirm={async () => {
          if (!revokeTarget) return
          await teamService.revokeApiKey(revokeTarget.id)
          setRevokeTarget(null)
          reload()
          toast({ title: 'API key revoked', variant: 'info' })
        }}
      />
    </div>
  )
}
