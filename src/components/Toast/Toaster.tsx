import * as ToastPrimitive from '@radix-ui/react-toast'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn, focusRing } from '@/lib/utils'
import { type ToastVariant, useToastStore } from './toastStore'

const VARIANT_ICON: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const VARIANT_COLOR: Record<ToastVariant, string> = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-ink-primary',
}

/** Mount once at the app root. Auto-dismisses after 4s per spec; system colors only, never lane colors. */
export function Toaster() {
  const { toasts, dismiss } = useToastStore()

  return (
    <ToastPrimitive.Provider duration={4000} swipeDirection="right">
      {toasts.map((t) => {
        const Icon = VARIANT_ICON[t.variant]
        return (
          <ToastPrimitive.Root
            key={t.id}
            onOpenChange={(open) => {
              if (!open) dismiss(t.id)
            }}
            className={cn(
              'flex items-start gap-3 rounded-lg border border-hairline bg-surface-card p-4 shadow-overlay',
              'data-[state=open]:animate-toast-in data-[swipe=end]:animate-fade',
            )}
          >
            <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', VARIANT_COLOR[t.variant])} aria-hidden />
            <div className="min-w-0 flex-1">
              <ToastPrimitive.Title className="text-body font-medium text-ink-primary">{t.title}</ToastPrimitive.Title>
              {t.description && (
                <ToastPrimitive.Description className="mt-0.5 text-meta text-ink-secondary">
                  {t.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close className={cn('shrink-0 rounded p-0.5 text-ink-muted hover:text-ink-primary', focusRing)} aria-label="Dismiss">
              <X className="h-3.5 w-3.5" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        )
      })}
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] flex w-full max-w-sm flex-col gap-2 p-6 outline-none" />
    </ToastPrimitive.Provider>
  )
}
