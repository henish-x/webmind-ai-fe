import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn, focusRing } from '@/lib/utils'

export function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'flex h-4 w-4 shrink-0 items-center justify-center rounded border border-hairline-strong bg-surface-card',
        'data-[state=checked]:border-ink-primary data-[state=checked]:bg-ink-primary',
        focusRing,
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="h-3 w-3 text-surface-page" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
