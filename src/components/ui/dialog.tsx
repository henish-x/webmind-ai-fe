import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn, focusRing } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

export function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-ink-primary/40 data-[state=open]:animate-fade',
        className,
      )}
      {...props}
    />
  )
}

export function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { showClose?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2',
          'rounded-lg border border-hairline bg-surface-card p-6 shadow-overlay',
          'data-[state=open]:animate-fade',
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            className={cn('absolute right-4 top-4 rounded-md p-1 text-ink-muted hover:text-ink-primary', focusRing)}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
