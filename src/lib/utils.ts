import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge doesn't know our design-token names out of the box, so
 * `text-body` (a custom font-size) and `text-ink-primary` (a custom color)
 * both look like "text-*" to it and get treated as the same conflicting
 * group — it silently drops one. Registering the token names against the
 * right theme scale fixes that.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        'surface-page',
        'surface-card',
        'surface-sunken',
        'hairline',
        'hairline-strong',
        'ink-primary',
        'ink-secondary',
        'ink-muted',
        'support-50',
        'support-100',
        'support-500',
        'support-700',
        'sales-50',
        'sales-100',
        'sales-500',
        'sales-700',
        'danger',
        'warning',
        'success',
        'mkt-ink-950',
        'mkt-cream',
      ],
      text: [
        'page-title',
        'section-heading',
        'card-title',
        'body',
        'meta',
        'caption',
        'hero',
        'mkt-headline',
        'mkt-subhead',
        'mkt-body',
        'mkt-caption',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Shared focus-visible ring per the a11y spec: 2px solid ink-primary, 2px offset,
 * never the browser default. `outline-none` sets the shared --tw-outline-style
 * variable to "none" (Tailwind v4's outline utilities all read from it), and no
 * other built-in utility resets it — the bare `outline` class would, but
 * tailwind-merge treats it and `outline-2` as the same conflict group and drops
 * one. Setting the variable directly sidesteps that without fighting twMerge.
 */
export const focusRing =
  'outline-none focus-visible:[--tw-outline-style:solid] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary'
