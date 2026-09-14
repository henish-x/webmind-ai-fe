import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn, focusRing } from '@/lib/utils'

export function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'relative h-5 w-9 shrink-0 rounded-full bg-hairline-strong transition-colors',
        'data-[state=checked]:bg-ink-primary',
        focusRing,
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-surface-card shadow-overlay transition-transform data-[state=checked]:translate-x-4" />
    </SwitchPrimitive.Root>
  )
}
