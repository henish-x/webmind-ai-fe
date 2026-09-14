import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, focusRing } from '@/lib/utils'
import { useBotStore } from '@/state/useBotStore'
import { useNotifications } from './useNotifications'

export function NotificationBell() {
  const currentBotId = useBotStore((s) => s.currentBotId)
  const items = useNotifications(currentBotId)
  const navigate = useNavigate()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Notifications${items.length ? `, ${items.length} unread` : ''}`}
          className={cn('relative rounded-md p-2 text-ink-secondary hover:bg-surface-sunken hover:text-ink-primary', focusRing)}
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} />
          {items.length > 0 && (
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" aria-hidden />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-hairline px-4 py-2.5">
          <p className="text-meta font-medium text-ink-primary">Notifications</p>
        </div>
        {items.length === 0 ? (
          <p className="px-4 py-6 text-center text-meta text-ink-secondary">You&apos;re all caught up.</p>
        ) : (
          <ul className="max-h-80 overflow-y-auto py-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => navigate(item.href)}
                  className={cn('block w-full px-4 py-2.5 text-left hover:bg-surface-sunken', focusRing)}
                >
                  <p className="text-meta font-medium text-ink-primary">{item.label}</p>
                  <p className="truncate text-caption text-ink-secondary">{item.sublabel}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}
