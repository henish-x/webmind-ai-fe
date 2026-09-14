import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn, focusRing } from '@/lib/utils'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-9 w-full rounded-md border border-hairline bg-surface-card px-3 text-body text-ink-primary placeholder:text-ink-muted',
        'disabled:cursor-not-allowed disabled:opacity-50',
        focusRing,
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
