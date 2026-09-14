import { Faq } from './components/Faq'
import { FinalCta } from './components/FinalCta'
import { PricingSection } from './components/PricingSection'

export function PricingPage() {
  return (
    <>
      <div className="bg-surface-page px-6 pb-4 pt-32 text-center md:px-10 md:pt-40">
        <h1 className="font-serif text-[36px] font-medium leading-[1.15] text-ink-primary md:text-[48px]">Pricing</h1>
        <p className="mx-auto mt-4 max-w-md text-[17px] leading-[1.65] text-ink-secondary">
          One bot, two lanes, on every plan. Pick the size that matches your traffic.
        </p>
      </div>
      <PricingSection showHeading={false} />
      <Faq />
      <FinalCta />
    </>
  )
}
