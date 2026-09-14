import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn, focusRing } from '@/lib/utils'

export const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors',
    'disabled:pointer-events-none disabled:opacity-50',
    focusRing,
  ),
  {
    variants: {
      variant: {
        primary: 'bg-ink-primary text-surface-page hover:bg-ink-primary/90',
        secondary: 'border border-hairline-strong bg-surface-card text-ink-primary hover:bg-surface-sunken',
        destructive: 'bg-danger text-white hover:bg-danger/90',
        ghost: 'text-ink-primary hover:bg-surface-sunken',
      },
      size: {
        sm: 'h-8 px-3 text-meta',
        md: 'h-9 px-4 text-body',
        lg: 'h-11 px-5 text-body',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  },
)
Button.displayName = 'Button'
