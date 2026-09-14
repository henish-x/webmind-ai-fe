import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SplitPreviewLayoutProps {
  form: ReactNode
  preview: ReactNode
  previewLabel?: string
  className?: string
}

/** Left form / right live preview. Used by Onboarding (step 5+) and Customize. Stacks on tablet/mobile. */
export function SplitPreviewLayout({ form, preview, previewLabel, className }: SplitPreviewLayoutProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-8 lg:grid-cols-2', className)}>
      <div className="min-w-0 space-y-6">{form}</div>
      <div className="lg:sticky lg:top-6 lg:self-start">
        {previewLabel && <p className="mb-2 text-meta font-medium text-ink-secondary">{previewLabel}</p>}
        {preview}
      </div>
    </div>
  )
}

/** The mock-browser chrome the live widget preview renders inside (Customize + Onboarding step 5). */
export function MockBrowserFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-hairline shadow-overlay', className)}>
      <div className="flex items-center gap-1.5 border-b border-hairline bg-surface-sunken px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
      </div>
      <div className="relative min-h-96 bg-surface-page">{children}</div>
    </div>
  )
}
