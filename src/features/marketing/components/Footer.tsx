import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn, focusRing } from '@/lib/utils'

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#fork' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Integrations', href: '/#features' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'Book a demo', href: '/book-a-demo' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const className = cn(
    'text-[15px] text-ink-secondary transition-colors hover:text-ink-primary',
    focusRing,
    'rounded-sm',
  )
  if (href.startsWith('/#')) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface-page">
      <div className="mx-auto max-w-[1200px] px-6 pt-16 md:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-serif text-lg font-medium text-ink-primary">WebMind</p>
            <p className="mt-2 max-w-[220px] text-[14px] text-ink-secondary">
              One chatbot that answers questions and catches every buyer.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[13px] font-medium text-ink-muted">{col.title}</p>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Purely decorative giant wordmark — intentionally near-invisible against the
            footer background (color matches --hairline exactly). Sits flush against
            the bottom of the footer with no trailing space below it, and is allowed
            to run past the container width and clip, rather than being neatly boxed in. */}
        <div className="mt-14 w-full overflow-hidden text-center" aria-hidden="true">
          <p
            className="select-none whitespace-nowrap font-serif font-medium leading-[0.8] tracking-tighter text-hairline"
            style={{ fontSize: 'clamp(4rem, 18vw, 12rem)' }}
          >
            WebMind
          </p>
        </div>
      </div>
    </footer>
  )
}
