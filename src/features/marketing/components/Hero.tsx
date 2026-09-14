import { Link } from 'react-router-dom'
import { focusRing } from '@/lib/utils'
import { HeroDemo } from './HeroDemo'
import { MktButton } from './MktButton'

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-mkt-ink-950 px-6 pb-8 pt-32 md:px-10 md:pb-10 md:pt-24">
      {/* Grounds the floating demo panel and quietly previews the two lane colors ahead
          of the fork section below. Slow, ambient drift (see globals.css) so the hero
          reads as designed rather than a flat fill — kept subtle so the panel stays the
          focal point, and respects prefers-reduced-motion via the site-wide media query. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hero-glow-support absolute left-1/2 top-[62%] h-[560px] w-[560px] rounded-full bg-support-500 blur-[110px]" />
        <div className="hero-glow-sales absolute left-1/2 top-[62%] h-[560px] w-[560px] rounded-full bg-sales-500 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-[760px] text-center">
        <h1 className="font-serif text-[36px] font-medium leading-[1.15] text-mkt-cream md:text-[56px]">
          Your website already knows the answers.
        </h1>
        <p className="mx-auto mt-6 max-w-[560px] text-[17px] leading-[1.65] text-mkt-cream/70 md:mt-4 md:text-[20px]">
          Paste the URL. We'll turn it into a chatbot that answers questions and catches every buyer — live on your
          site in under 10 minutes.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:mt-6">
          <MktButton asChild variant="light" size="lg">
            <Link to="/signup">Try it on your own site</Link>
          </MktButton>
          <a href="#how-it-works" className={focusRing.concat(' rounded-sm text-[15px] text-mkt-cream/80 underline-offset-4 hover:text-mkt-cream hover:underline')}>
            See how it works
          </a>
        </div>
      </div>

      <div className="relative mt-14 flex w-full justify-center md:mt-8">
        <HeroDemo />
      </div>
    </section>
  )
}
