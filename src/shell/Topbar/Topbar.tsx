import { LogOut, Menu, Moon, Search, Sun } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CommandPalette, type CommandItemDef, useCommandPaletteShortcut } from '@/components/CommandPalette'
import { cn, focusRing } from '@/lib/utils'
import { useAuthStore } from '@/state/useAuthStore'
import { useThemeStore } from '@/state/useThemeStore'
import { MobileNavDrawer } from '../Sidebar/MobileNavDrawer'
import { NAV_ITEMS } from '../navItems'
import { NotificationBell } from '../NotificationBell'

export function Topbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const session = useAuthStore((s) => s.session)
  const logout = useAuthStore((s) => s.logout)
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  useCommandPaletteShortcut(() => setPaletteOpen(true))

  const paletteItems: CommandItemDef[] = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        id: item.href,
        label: item.label,
        group: 'Go to',
        icon: <item.icon className="h-4 w-4" strokeWidth={1.5} />,
        onSelect: () => navigate(item.href),
      })),
    [navigate],
  )

  const initials = session?.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-hairline bg-surface-card px-4">
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open navigation"
        className={cn('rounded-md p-2 text-ink-secondary hover:bg-surface-sunken md:hidden', focusRing)}
      >
        <Menu className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        className={cn(
          'hidden w-full max-w-xs items-center gap-2 rounded-md border border-hairline bg-surface-sunken px-3 py-1.5 text-meta text-ink-muted',
          'md:flex',
          focusRing,
        )}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="rounded border border-hairline-strong bg-surface-card px-1 font-mono text-caption">⌘K</kbd>
      </button>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Search"
          className={cn('rounded-md p-2 text-ink-secondary hover:bg-surface-sunken md:hidden', focusRing)}
        >
          <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className={cn('rounded-md p-2 text-ink-secondary hover:bg-surface-sunken hover:text-ink-primary', focusRing)}
        >
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" strokeWidth={1.5} /> : <Moon className="h-[18px] w-[18px]" strokeWidth={1.5} />}
        </button>
        <NotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger className={cn('ml-1 rounded-full', focusRing)} aria-label="Account menu">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-meta font-medium text-ink-primary">{session?.name}</p>
              <p className="text-caption text-ink-muted">{session?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate('/settings')}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => {
                logout()
                navigate('/login')
              }}
            >
              <LogOut className="h-3.5 w-3.5" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <MobileNavDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} items={paletteItems} />
    </header>
  )
}
