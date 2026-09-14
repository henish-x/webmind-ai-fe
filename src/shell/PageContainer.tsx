import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Standard page padding/max-width. Screens that need full-bleed height (Inbox) skip this. */
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto max-w-[1280px] px-6 py-6', className)}>{children}</div>
}
