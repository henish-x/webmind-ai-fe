import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, FileText } from 'lucide-react'
import type { ReactNode } from 'react'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { cn } from '@/lib/utils'
import { SECTION_PADDING } from './sectionSpacing'

function MockTranscript({
  lane,
  question,
  children,
}: {
  lane: 'support' | 'sales'
  question: string
  children: ReactNode
}) {
  const bubbleBg = lane === 'support' ? 'bg-support-500' : 'bg-sales-500'
  return (
    <div className="mt-8 space-y-2.5">
      <div className="flex justify-end">
        <div className={cn('max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-[14px] text-white', bubbleBg)}>{question}</div>
      </div>
      {children}
    </div>
  )
}

function BotBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/60 bg-white/70 px-4 py-2.5 text-[14px] text-ink-primary">
        {children}
      </div>
    </div>
  )
}

export function ForkSection() {
  const reducedMotion = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const duration = reducedMotion ? 0 : 0.85
  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <section id="fork" className={cn('bg-surface-page', SECTION_PADDING)}>
      <div className="mx-auto max-w-[1200px] px-6 text-center md:px-10">
        <h2 className="font-serif text-[28px] font-medium leading-[1.2] text-ink-primary md:text-[36px]">
          It picks a lane before you even finish typing.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[17px] leading-[1.65] text-ink-secondary">
          Most chatbots treat every message the same. Yours tells a question from a buying signal — and responds
          differently, automatically.
        </p>
      </div>

      <div className="relative mt-16 flex flex-col md:flex-row">
        <motion.div
          initial={isDesktop ? { scaleX: 0, opacity: 0 } : { scaleY: 0, opacity: 0 }}
          whileInView={isDesktop ? { scaleX: 1, opacity: 1 } : { scaleY: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration, ease }}
          style={{ transformOrigin: isDesktop ? 'right center' : 'bottom center' }}
          className="bg-support-50 px-6 py-14 md:w-1/2 md:px-16 md:py-20"
        >
          <p className="text-[13px] font-medium text-support-700">Support</p>
          <MockTranscript lane="support" question="What are your office hours?">
            <BotBubble>We're open Monday–Saturday, 10am–6pm — happy to help with anything else too.</BotBubble>
            <div className="flex items-center gap-1.5 pl-1 text-[12px] text-support-700/70">
              <FileText className="h-3 w-3" /> FAQ page
            </div>
          </MockTranscript>
          <p className="mt-8 text-[15px] text-support-700">Answered instantly, from your own content.</p>
        </motion.div>

        {/* Straddles the top boundary of the split — deliberately not dead-center on the
            panels, since the chat transcripts occupy that space; this keeps it legible
            without ever overlapping bubble content regardless of viewport height. */}
        <div className="flex items-center justify-center bg-surface-page px-6 py-6 md:pointer-events-none md:absolute md:inset-x-0 md:top-0 md:z-10 md:-translate-y-1/2 md:bg-transparent md:py-0">
          <p className="max-w-[300px] rounded-full border border-hairline bg-surface-page px-5 py-2 text-center font-serif text-[16px] italic leading-snug text-ink-secondary shadow-overlay">
            Same conversation. It just knows which lane it's in.
          </p>
        </div>

        <motion.div
          initial={isDesktop ? { scaleX: 0, opacity: 0 } : { scaleY: 0, opacity: 0 }}
          whileInView={isDesktop ? { scaleX: 1, opacity: 1 } : { scaleY: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration, ease }}
          style={{ transformOrigin: isDesktop ? 'left center' : 'top center' }}
          className="bg-sales-50 px-6 py-14 md:w-1/2 md:px-16 md:py-20"
        >
          <p className="text-[13px] font-medium text-sales-700">Sales</p>
          <MockTranscript lane="sales" question="Do you have anything under $2,000?">
            <BotBubble>We do — I can have someone put a shortlist together. What's your name and email?</BotBubble>
            <div className="flex items-center gap-1.5 rounded-full bg-sales-500/15 px-3 py-1.5 text-[12px] text-sales-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> Lead sent to your team
            </div>
          </MockTranscript>
          <p className="mt-8 text-[15px] text-sales-700">Captured instantly, sent straight to your team.</p>
        </motion.div>
      </div>
    </section>
  )
}
