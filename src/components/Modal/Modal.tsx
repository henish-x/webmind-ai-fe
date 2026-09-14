import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  className?: string
}

export function Modal({ open, onOpenChange, title, description, children, footer, className }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogTitle className="text-card-title font-medium text-ink-primary">{title}</DialogTitle>
        {description && <DialogDescription className="mt-1 text-body text-ink-secondary">{description}</DialogDescription>}
        {children && <div className="mt-4">{children}</div>}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </DialogContent>
    </Dialog>
  )
}
