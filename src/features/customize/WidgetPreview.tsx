import { MessageCircle } from 'lucide-react'
import { MockBrowserFrame } from '@/components/SplitPreviewLayout'
import type { WidgetPosition } from '@/data/types'
import { cn } from '@/lib/utils'

export interface WidgetPreviewConfig {
  primaryColor: string
  position: WidgetPosition
  greeting: string
}

export function WidgetPreview({ config }: { config: WidgetPreviewConfig }) {
  return (
    <MockBrowserFrame>
      <div className="flex h-full min-h-96 flex-col justify-end p-4">
        <div
          className={cn(
            'flex max-w-[220px] flex-col gap-2',
            config.position === 'bottom-right' ? 'ml-auto items-end' : 'mr-auto items-start',
          )}
        >
          <div className="rounded-lg border border-hairline bg-surface-card p-3 text-meta text-ink-primary shadow-overlay">
            {config.greeting}
          </div>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-overlay transition-transform"
            style={{ backgroundColor: config.primaryColor }}
            aria-label="Open chat"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </MockBrowserFrame>
  )
}
