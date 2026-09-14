import { BarChart3, Lock, Plug, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SECTION_PADDING } from './sectionSpacing'

const FEATURES = [
  {
    icon: ShieldCheck,
    iconClassName: 'text-ink-secondary',
    title: 'Guardrails built in',
    description:
      "The bot only answers from your content, never guesses, and can't be tricked into ignoring its instructions.",
  },
  {
    icon: BarChart3,
    iconClassName: 'text-ink-secondary',
    title: 'Real analytics',
    description: "See exactly what people ask, what leads convert, and what your bot still can't answer.",
  },
  {
    // Framed around CRM/lead routing, so it picks up the sales lane color rather
    // than staying neutral like the product-wide icons above and below it.
    icon: Plug,
    iconClassName: 'text-sales-500',
    title: 'Connects to what you already use',
    description: 'CRM, Slack, WhatsApp, and your existing helpdesk.',
  },
  {
    icon: Lock,
    iconClassName: 'text-ink-secondary',
    title: 'Your data stays yours',
    description: 'Clear retention controls, and you can delete everything anytime.',
  },
]

export function FeatureHighlights() {
  return (
    <section id="features" className={cn('bg-surface-page', SECTION_PADDING)}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h2 className="font-serif text-[28px] font-medium leading-[1.2] text-ink-primary md:text-[36px]">
              Beyond the fork
            </h2>
            <div className="mt-10 divide-y divide-hairline border-t border-hairline">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex gap-5 py-7 sm:items-start">
                  <f.icon className={cn('mt-0.5 h-5 w-5 shrink-0', f.iconClassName)} strokeWidth={1.5} />
                  <div>
                    <p className="text-[17px] font-medium text-ink-primary">{f.title}</p>
                    <p className="mt-1.5 text-[15px] leading-[1.6] text-ink-secondary">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-overlay">
            <div className="flex items-center gap-1.5 border-b border-hairline bg-surface-sunken px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
              <span className="ml-3 truncate font-mono text-[12px] text-ink-muted">
                app.webmindai.com/inbox
              </span>
            </div>
            <img
              src="/marketing/inbox-preview.png"
              alt="WebMind inbox showing support and sales conversations tagged by lane"
              className="w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
