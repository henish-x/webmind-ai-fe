import { useId, useState } from 'react'
import { Button } from '@/components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from './Modal'

export interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  confirmLabel?: string
  /** Styles the confirm button red. Independent of confirmWord — a reversible-but-
   * still-destructive action (e.g. removing a teammate) can set this without the typed gate. */
  destructive?: boolean
  /** When set, the confirm button stays disabled until the visitor types this exact
   * word — reserved for irreversible actions (deleting a bot, an account, all data). */
  confirmWord?: string
  loading?: boolean
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = 'Confirm',
  destructive = false,
  confirmWord,
  loading = false,
}: ConfirmModalProps) {
  const [typed, setTyped] = useState('')
  const inputId = useId()
  const isDestructive = destructive || Boolean(confirmWord)
  const canConfirm = !confirmWord || typed === confirmWord

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next) setTyped('')
        onOpenChange(next)
      }}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant={isDestructive ? 'destructive' : 'primary'} disabled={!canConfirm || loading} onClick={onConfirm}>
            {loading ? `${confirmLabel}…` : confirmLabel}
          </Button>
        </>
      }
    >
      {confirmWord && (
        <div className="space-y-1.5">
          <Label htmlFor={inputId}>
            Type <span className="font-mono">{confirmWord}</span> to confirm
          </Label>
          <Input id={inputId} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
        </div>
      )}
    </Modal>
  )
}
