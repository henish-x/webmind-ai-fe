import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn, focusRing } from '@/lib/utils'

/**
 * Marketing-only button styles — distinct from the dashboard's Button because
 * this page needs a button that reads correctly sitting directly on the dark
 * hero/CTA sections, not just on light surfaces.
 */
export const mktButtonVariants = cva(
  cn('inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-colors', focusRing),
  {
    variants: {
      variant: {
        // Ink-950 fill + a faint border so it never disappears even sitting on an ink-950 background (the nav's persistent CTA).
        dark: 'border border-mkt-cream/15 bg-mkt-ink-950 text-mkt-cream hover:bg-mkt-ink-950/90',
        // Paper fill for CTAs placed directly on a dark section (hero, final CTA banner).
        light: 'bg-surface-page text-mkt-ink-950 hover:bg-white',
        // Bordered, transparent fill — secondary CTA on a light surface (e.g. non-emphasized pricing tiers).
        outline: 'border border-hairline-strong text-ink-primary hover:bg-surface-sunken',
        'ghost-dark': 'text-ink-primary underline-offset-4 hover:underline',
        'ghost-light': 'text-mkt-cream/90 underline-offset-4 hover:text-mkt-cream hover:underline',
      },
      size: {
        md: 'h-11 px-5 text-[15px]',
        lg: 'h-12 px-7 text-base',
      },
    },
    defaultVariants: { variant: 'dark', size: 'md' },
  },
)

export interface MktButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof mktButtonVariants> {
  asChild?: boolean
}

export const MktButton = forwardRef<HTMLButtonElement, MktButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp ref={ref} className={cn(mktButtonVariants({ variant, size }), className)} {...props} />
  },
)
MktButton.displayName = 'MktButton'
