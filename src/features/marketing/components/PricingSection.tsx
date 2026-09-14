import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn, focusRing } from '@/lib/utils'
import { MARKETING_PLANS } from '../data/pricingContent'
import { MktButton } from './MktButton'
import { SECTION_PADDING } from './sectionSpacing'

export function PricingSection({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="pricing" className={cn('bg-surface-page', SECTION_PADDING)}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        {showHeading && (
          <div className="text-center">
            <h2 className="font-serif text-[28px] font-medium leading-[1.2] text-ink-primary md:text-[36px]">
              Simple pricing, real limits
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[17px] text-ink-secondary">
              Every plan includes both lanes — support and sales are never sold separately.
            </p>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {MARKETING_PLANS.map((plan) => (
            <div
              key={plan.tier}
              className={cn(
                'flex h-full flex-col rounded-xl border bg-white p-8',
                plan.emphasized ? 'border-2 border-mkt-ink-950 md:-translate-y-2 md:shadow-overlay' : 'border-hairline',
              )}
            >
              <p className="text-[15px] font-medium text-ink-primary">{plan.displayName}</p>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="font-serif text-[36px] font-medium text-ink-primary">${plan.price}</span>
                <span className="text-[15px] text-ink-muted">/mo</span>
              </p>
              <p className="mt-1 text-[14px] text-ink-muted">{plan.conversationLimit.toLocaleString()} conversations / month</p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[15px] text-ink-secondary">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-support-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <MktButton asChild variant={plan.emphasized ? 'dark' : 'outline'} size="md" className="mt-8 w-full">
                <Link to={plan.tier === 'scale' ? '/contact' : '/signup'}>{plan.ctaLabel}</Link>
              </MktButton>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-[15px] text-ink-secondary">
          Need something custom, or managing chatbots for multiple clients?{' '}
          <Link to="/contact" className={cn('text-ink-primary underline underline-offset-4', focusRing, 'rounded-sm')}>
            Talk to us.
          </Link>
        </p>
      </div>
    </section>
  )
}
