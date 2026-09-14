import { motion, useReducedMotion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  CalendlyIcon,
  GoogleSheetsIcon,
  HubSpotIcon,
  PipedriveIcon,
  SlackIcon,
  WhatsAppIcon,
  ZapierIcon,
  ZendeskIcon,
} from './BrandIcons'
import { SECTION_PADDING } from './sectionSpacing'

type Phase = 'support' | 'sales'

const PATH_DRAW_S = 0.9
const HOLD_MS = 1700
const PHASE_MS = PATH_DRAW_S * 1000 + HOLD_MS

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

const ALSO_CONNECTS = [
  { label: 'WhatsApp', icon: <WhatsAppIcon size={16} color="default" /> },
  { label: 'Google Sheets', icon: <GoogleSheetsIcon size={16} color="default" /> },
  { label: 'Zapier', icon: <ZapierIcon size={16} color="default" /> },
  { label: 'Pipedrive', icon: <PipedriveIcon size={16} /> },
  { label: 'Calendly', icon: <CalendlyIcon size={16} color="default" /> },
]

function LogoBubble({
  children,
  active,
  left,
  top,
}: {
  children: ReactNode
  active: boolean
  left: string
  top: string
}) {
  return (
    <motion.div
      animate={{ scale: active ? 1.08 : 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'absolute z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-overlay',
        active ? 'border-ink-primary/20' : 'border-hairline',
      )}
      style={{ left, top }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Animates the actual routing behavior instead of a static logo grid — a
 * central message routes out to real connector logos depending on which lane
 * it's in, reusing the fork's teal/coral system so this reads as a direct
 * continuation of that idea rather than a generic "integrations" section.
 */
export function ConnectorsSection() {
  const reducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('support')
  const [supportKey, setSupportKey] = useState(0)
  const [salesKey, setSalesKey] = useState(0)
  const runIdRef = useRef(0)

  useEffect(() => {
    if (reducedMotion) return
    const myRun = ++runIdRef.current
    const isCurrent = () => runIdRef.current === myRun

    async function loop() {
      for (;;) {
        setSupportKey((k) => k + 1)
        setPhase('support')
        await sleep(PHASE_MS)
        if (!isCurrent()) return

        setSalesKey((k) => k + 1)
        setPhase('sales')
        await sleep(PHASE_MS)
        if (!isCurrent()) return
      }
    }
    loop()
    return () => {
      runIdRef.current++
    }
  }, [reducedMotion])

  const isSupport = reducedMotion || phase === 'support'
  const isSales = reducedMotion || phase === 'sales'

  const pathTransition = { duration: reducedMotion ? 0 : PATH_DRAW_S, ease: 'easeInOut' as const }

  return (
    <section className={cn('relative overflow-hidden bg-surface-page', SECTION_PADDING)}>
      <div aria-hidden className="mkt-dot-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-[28px] font-medium leading-[1.2] text-ink-primary md:text-[36px]">
            It already knows where each conversation belongs.
          </h2>
          <p className="mx-auto mt-4 text-[17px] leading-[1.65] text-ink-secondary">
            Support escalations go to your helpdesk. Sales leads go to your CRM and Slack — the moment they happen,
            no middleware to configure.
          </p>
        </div>

        <div className="relative mx-auto mt-16 aspect-[5/2] w-full max-w-3xl">
          <svg viewBox="0 0 600 220" className="absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden="true">
            <motion.path
              key={`support-${supportKey}`}
              d="M300,110 C230,138 150,138 78,110"
              stroke="var(--support-500)"
              strokeWidth={2.5}
              strokeLinecap="round"
              initial={{ pathLength: reducedMotion ? 1 : 0 }}
              animate={{ pathLength: 1, opacity: isSupport ? 1 : 0.2 }}
              transition={pathTransition}
            />
            <motion.path
              key={`hubspot-${salesKey}`}
              d="M300,110 C380,110 460,72 522,62"
              stroke="var(--sales-500)"
              strokeWidth={2.5}
              strokeLinecap="round"
              initial={{ pathLength: reducedMotion ? 1 : 0 }}
              animate={{ pathLength: 1, opacity: isSales ? 1 : 0.2 }}
              transition={pathTransition}
            />
            <motion.path
              key={`slack-${salesKey}`}
              d="M300,110 C380,110 460,148 522,158"
              stroke="var(--sales-500)"
              strokeWidth={2.5}
              strokeLinecap="round"
              initial={{ pathLength: reducedMotion ? 1 : 0 }}
              animate={{ pathLength: 1, opacity: isSales ? 1 : 0.2 }}
              transition={pathTransition}
            />
          </svg>

          <div className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-hairline-strong bg-white shadow-overlay">
            <MessageCircle className="h-6 w-6 text-ink-primary" strokeWidth={1.5} />
          </div>

          <LogoBubble active={isSupport} left="13%" top="50%">
            <ZendeskIcon size={22} color="default" />
          </LogoBubble>
          <LogoBubble active={isSales} left="87%" top="28%">
            <HubSpotIcon size={22} color="default" />
          </LogoBubble>
          <LogoBubble active={isSales} left="87%" top="72%">
            <SlackIcon size={22} />
          </LogoBubble>
        </div>

        <div className="mx-auto mt-6 flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <p className={cn('text-[14px] font-medium text-support-700 transition-opacity duration-300', isSupport ? 'opacity-100' : 'opacity-40')}>
            Escalates to your helpdesk.
          </p>
          <p
            className={cn(
              'text-[14px] font-medium text-sales-700 transition-opacity duration-300 sm:text-right',
              isSales ? 'opacity-100' : 'opacity-40',
            )}
          >
            Lead lands in your CRM and Slack, instantly.
          </p>
        </div>

        <div className="mt-16 border-t border-hairline pt-8">
          <p className="text-center text-[13px] font-medium text-ink-muted">Also connects to</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {ALSO_CONNECTS.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5 text-[13px] text-ink-secondary">
                {c.icon}
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
