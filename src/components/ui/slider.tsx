import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn, focusRing } from '@/lib/utils'

export function Slider({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn('relative flex h-4 w-full touch-none items-center', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow rounded-full bg-surface-sunken">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-ink-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn('block h-4 w-4 rounded-full border-2 border-ink-primary bg-surface-card', focusRing)}
      />
    </SliderPrimitive.Root>
  )
}
