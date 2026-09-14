import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { MktButton } from './MktButton'
import { SECTION_PADDING } from './sectionSpacing'

export function FinalCta() {
  return (
    <section className={cn('relative overflow-hidden bg-mkt-ink-950 px-6 text-center md:px-10', SECTION_PADDING)}>
      {/* Echoes the hero's glow so the dark bookend sections read as one pair, not two flat blocks. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-[85%] -translate-y-1/2 rounded-full bg-support-500 opacity-[0.06] blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-[15%] -translate-y-1/2 rounded-full bg-sales-500 opacity-[0.06] blur-[100px]" />
      </div>

      <h2 className="relative mx-auto max-w-xl font-serif text-[28px] font-medium leading-[1.2] text-mkt-cream md:text-[36px]">
        Paste your URL. See what your bot could catch.
      </h2>
      <div className="relative mt-8">
        <MktButton asChild variant="light" size="lg">
          <Link to="/signup">Try it on your own site</Link>
        </MktButton>
      </div>
    </section>
  )
}
