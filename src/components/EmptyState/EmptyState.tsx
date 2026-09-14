import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
  icon?: ReactNode
  className?: string
}

/** Icon-free by default per the writing guidance: direct, active-voice copy over decoration. */
export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-16 text-center', className)}>
      {icon}
      <div className="max-w-sm space-y-1">
        <p className="text-card-title font-medium text-ink-primary">{title}</p>
        <p className="text-body text-ink-secondary">{description}</p>
      </div>
      {action}
    </div>
  )
}
