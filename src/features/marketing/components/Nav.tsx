import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn, focusRing } from '@/lib/utils'
import { MktButton } from './MktButton'

const NAV_LINKS = [
  { label: 'Product', href: '/#fork' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resellers / Agencies', href: '/book-a-demo' },
  { label: 'Contact', href: '/contact' },
]

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

export function Nav() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const scrolled = useScrolled()
  const transparent = isHome && !scrolled
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <header
      className={cn(
        // backdrop-blur-sm is unconditional so it never pops in/out on its own — only
        // background-color/border transition (via transition-colors). Toggling the blur
        // itself alongside the color caused a translucent "flash" while scrolling past
        // the threshold, since backdrop-filter can't animate through transition-colors.
        'fixed inset-x-0 top-0 z-50 backdrop-blur-sm transition-colors duration-200',
        transparent ? 'bg-transparent' : 'border-b border-hairline bg-surface-page/95',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 md:px-10">
        <Link
          to="/"
          className={cn(
            'font-serif text-lg font-medium',
            transparent ? 'text-mkt-cream' : 'text-ink-primary',
            focusRing,
            'rounded-sm',
          )}
        >
          WebMind
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                'text-[15px] transition-colors',
                transparent
                  ? 'text-mkt-cream/80 hover:text-mkt-cream'
                  : 'text-ink-secondary hover:text-ink-primary',
                focusRing,
                'rounded-sm',
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <MktButton asChild variant="dark" size="md" className="hidden sm:inline-flex">
            <Link to="/signup">Try it free</Link>
          </MktButton>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className={cn(
              'rounded-md p-2 md:hidden',
              transparent ? 'text-mkt-cream' : 'text-ink-primary',
              focusRing,
            )}
          >
            <Menu className="h-5 w-5" />
          </button>
          <MktButton asChild variant="dark" size="md" className="sm:hidden">
            <Link to="/signup">Try free</Link>
          </MktButton>
        </div>
      </div>

      <DialogPrimitive.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-mkt-ink-950/50 data-[state=open]:animate-fade" />
          <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-surface-page data-[state=open]:animate-fade">
            <DialogPrimitive.Title className="sr-only">Menu</DialogPrimitive.Title>
            <div className="flex h-16 items-center justify-between border-b border-hairline px-5">
              <span className="font-serif text-lg font-medium text-ink-primary">WebMind</span>
              <DialogPrimitive.Close
                className={cn('rounded-md p-1.5 text-ink-muted hover:text-ink-primary', focusRing)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>
            </div>
            <nav className="flex flex-1 flex-col gap-1 p-5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  className={cn(
                    'rounded-md px-2 py-3 text-[15px] text-ink-secondary hover:bg-surface-sunken hover:text-ink-primary',
                    focusRing,
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="border-t border-hairline p-5">
              <MktButton asChild variant="dark" size="md" className="w-full">
                <Link to="/signup" onClick={() => setDrawerOpen(false)}>
                  Try it free
                </Link>
              </MktButton>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </header>
  )
}
