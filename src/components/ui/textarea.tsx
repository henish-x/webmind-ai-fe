import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn, focusRing } from '@/lib/utils'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-20 w-full rounded-md border border-hairline bg-surface-card px-3 py-2 text-body text-ink-primary placeholder:text-ink-muted',
        'disabled:cursor-not-allowed disabled:opacity-50',
        focusRing,
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'
