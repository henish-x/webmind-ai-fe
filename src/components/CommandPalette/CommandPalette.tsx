import { Command } from 'cmdk'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface CommandItemDef {
  id: string
  label: string
  group: string
  icon?: ReactNode
  keywords?: string[]
  onSelect: () => void
}

export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CommandItemDef[]
}

/** ⌘K palette — jump to any conversation, settings page, or bot. */
export function CommandPalette({ open, onOpenChange, items }: CommandPaletteProps) {
  const groups = [...new Set(items.map((i) => i.group))]

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      overlayClassName="fixed inset-0 z-50 bg-ink-primary/40 data-[state=open]:animate-fade"
      contentClassName={cn(
        'fixed left-1/2 top-24 z-50 w-full max-w-lg -translate-x-1/2',
        'overflow-hidden rounded-lg border border-hairline bg-surface-card shadow-overlay',
        'data-[state=open]:animate-fade',
      )}
    >
      <div className="border-b border-hairline px-3">
        <Command.Input
          placeholder="Search conversations, settings, bots…"
          className={cn(
            'h-11 w-full bg-transparent text-body text-ink-primary placeholder:text-ink-muted outline-none',
          )}
        />
      </div>
      <Command.List className="max-h-80 overflow-y-auto p-2">
        <Command.Empty className="px-2 py-6 text-center text-body text-ink-secondary">No results found.</Command.Empty>
        {groups.map((group) => (
          <Command.Group key={group} heading={group} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-caption [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-ink-muted">
            {items
              .filter((i) => i.group === group)
              .map((item) => (
                <Command.Item
                  key={item.id}
                  value={`${item.label} ${item.keywords?.join(' ') ?? ''}`}
                  onSelect={() => {
                    item.onSelect()
                    onOpenChange(false)
                  }}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-body text-ink-primary',
                    'data-[selected=true]:bg-surface-sunken',
                  )}
                >
                  {item.icon}
                  {item.label}
                </Command.Item>
              ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  )
}
