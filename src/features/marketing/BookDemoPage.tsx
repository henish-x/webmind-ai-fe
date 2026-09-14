import { CalendarClock } from 'lucide-react'

export function BookDemoPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-32 text-center md:px-10 md:pt-40">
      <h1 className="font-serif text-[36px] font-medium leading-[1.15] text-ink-primary md:text-[48px]">Book a demo</h1>
      <p className="mx-auto mt-4 max-w-md text-[17px] leading-[1.65] text-ink-secondary">
        20 minutes, one of us on screen-share — we'll run your own site through it live and answer whatever's specific
        to your setup, agency or otherwise.
      </p>

      <div className="mt-10 flex min-h-96 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline-strong bg-white p-10">
        <CalendarClock className="h-8 w-8 text-ink-muted" strokeWidth={1.5} />
        <p className="text-[15px] font-medium text-ink-primary">Scheduling embed goes here</p>
        <p className="max-w-xs text-[14px] text-ink-secondary">
          Connect a scheduling tool (Calendly or equivalent) in Settings and this panel becomes the live booking
          widget — no other changes needed on this page.
        </p>
      </div>
    </div>
  )
}
