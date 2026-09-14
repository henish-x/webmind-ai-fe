import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, FileText, Search } from 'lucide-react'
import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react'
import { cn, focusRing } from '@/lib/utils'
import { HubSpotIcon, SlackIcon, ZendeskIcon } from './BrandIcons'
import { HERO_LOOP_SCRIPTS } from '../data/heroLoopScripts'

type Step =
  | 'idle'
  | 'crawling'
  | 'support-typing-q'
  | 'support-q'
  | 'support-typing-a'
  | 'support-done'
  | 'sales-typing-q'
  | 'sales-q'
  | 'sales-typing-a'
  | 'sales-done'
  | 'lead-typing-q'
  | 'lead-q'
  | 'lead-done'

/** Order matters — render logic below uses this to derive "has this step (or a later one) happened yet". */
const STEP_ORDER: Step[] = [
  'idle',
  'crawling',
  'support-typing-q',
  'support-q',
  'support-typing-a',
  'support-done',
  'sales-typing-q',
  'sales-q',
  'sales-typing-a',
  'sales-done',
  'lead-typing-q',
  'lead-q',
  'lead-done',
]

function atOrAfter(step: Step, target: Step) {
  return STEP_ORDER.indexOf(step) >= STEP_ORDER.indexOf(target)
}

const PAUSE_BEFORE_CRAWL = 500
const PAUSE_CRAWL = 1700
const CRAWL_BAR_DURATION = 1.5
const PAUSE_TYPING_INDICATOR = 900
const PAUSE_AFTER_QUESTION = 400
const PAUSE_AFTER_SUPPORT_A = 1400
const PAUSE_AFTER_SALES_A = 1400
const PAUSE_AFTER_LEAD_Q = 400
const PAUSE_LEAD_DONE_HOLD = 2400
const PAUSE_WHILE_PAUSED = 300
const CROSSFADE_DURATION = 0.4

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/** A plausible name+email reply to "What's your name and email?", derived from the lead's name. */
function leadReplyText(leadName: string) {
  const email = `${leadName.toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/).join('.')}@gmail.com`
  return `${leadName}, ${email}`
}

function LaneBadge({ lane }: { lane: 'support' | 'sales' }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={lane}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.25 }}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium',
          lane === 'support' ? 'bg-support-100 text-support-700' : 'bg-sales-100 text-sales-700',
        )}
      >
        {lane === 'support' ? 'Support' : 'Sales'}
      </motion.span>
    </AnimatePresence>
  )
}

function Bubble({ children, align = 'left' }: { children: ReactNode; align?: 'left' | 'right' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('flex', align === 'right' ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] leading-snug',
          align === 'right' ? 'bg-white text-mkt-ink-950' : 'bg-mkt-cream/10 text-mkt-cream',
        )}
      >
        {children}
      </div>
    </motion.div>
  )
}

/** The "…" bubble shown while the other side is composing, WhatsApp-style — replaced by the
    full message bubble once it "sends", never a character-by-character reveal. */
function TypingIndicator({ align = 'left' }: { align?: 'left' | 'right' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex', align === 'right' ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'flex items-center gap-1 rounded-2xl px-4 py-3',
          align === 'right' ? 'bg-white' : 'bg-mkt-cream/10',
        )}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn('h-1.5 w-1.5 animate-bounce rounded-full', align === 'right' ? 'bg-mkt-ink-950/40' : 'bg-mkt-cream/40')}
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </motion.div>
  )
}

/** The row of real connector logos that fades/scales in once a sales lead (or an escalation) fires. */
function ConnectorRow({ children, tone }: { children: ReactNode; tone: 'sales' | 'escalation' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium',
        tone === 'sales' ? 'bg-sales-500/15 text-sales-100' : 'bg-mkt-cream/10 text-mkt-cream/80',
      )}
    >
      {children}
    </motion.div>
  )
}

export function HeroDemo() {
  const reducedMotion = useReducedMotion()
  const [domainInput, setDomainInput] = useState('')
  const [loopIndex, setLoopIndex] = useState(0)
  const [playKey, setPlayKey] = useState(0)
  const [step, setStep] = useState<Step>('idle')
  const [escalationActive, setEscalationActive] = useState(false)
  const [domain, setDomain] = useState(HERO_LOOP_SCRIPTS[0].domain)

  const runIdRef = useRef(0)
  const pausedRef = useRef(false)
  const loopIndexRef = useRef(0)
  const dentalPlayCountRef = useRef(0)
  const domainOverrideRef = useRef<string | null>(null)

  useEffect(() => {
    pausedRef.current = domainInput.trim().length > 0
  }, [domainInput])

  async function runLoop() {
    const myRun = ++runIdRef.current
    const isCurrent = () => runIdRef.current === myRun

    for (;;) {
      while (pausedRef.current) {
        await sleep(PAUSE_WHILE_PAUSED)
        if (!isCurrent()) return
      }

      const script = HERO_LOOP_SCRIPTS[loopIndexRef.current]
      const scriptDomain = domainOverrideRef.current ?? script.domain
      domainOverrideRef.current = null

      let useEscalation = false
      if (script.escalation) {
        dentalPlayCountRef.current += 1
        useEscalation = dentalPlayCountRef.current % 2 === 0
      }

      setDomain(scriptDomain)
      setLoopIndex(loopIndexRef.current)
      setEscalationActive(useEscalation)
      setPlayKey((k) => k + 1)
      setStep('idle')
      await sleep(PAUSE_BEFORE_CRAWL)
      if (!isCurrent()) return

      setStep('crawling')
      await sleep(PAUSE_CRAWL)
      if (!isCurrent()) return

      setStep('support-typing-q')
      await sleep(PAUSE_TYPING_INDICATOR)
      if (!isCurrent()) return

      setStep('support-q')
      await sleep(PAUSE_AFTER_QUESTION)
      if (!isCurrent()) return

      setStep('support-typing-a')
      await sleep(PAUSE_TYPING_INDICATOR)
      if (!isCurrent()) return

      setStep('support-done')
      await sleep(PAUSE_AFTER_SUPPORT_A)
      if (!isCurrent()) return

      setStep('sales-typing-q')
      await sleep(PAUSE_TYPING_INDICATOR)
      if (!isCurrent()) return

      setStep('sales-q')
      await sleep(PAUSE_AFTER_QUESTION)
      if (!isCurrent()) return

      setStep('sales-typing-a')
      await sleep(PAUSE_TYPING_INDICATOR)
      if (!isCurrent()) return

      setStep('sales-done')
      await sleep(PAUSE_AFTER_SALES_A)
      if (!isCurrent()) return

      setStep('lead-typing-q')
      await sleep(PAUSE_TYPING_INDICATOR)
      if (!isCurrent()) return

      setStep('lead-q')
      await sleep(PAUSE_AFTER_LEAD_Q)
      if (!isCurrent()) return

      setStep('lead-done')
      await sleep(PAUSE_LEAD_DONE_HOLD)
      if (!isCurrent()) return

      loopIndexRef.current = (loopIndexRef.current + 1) % HERO_LOOP_SCRIPTS.length
      // loop back to the top with a fresh business type, cross-fading via playKey
    }
  }

  useEffect(() => {
    if (reducedMotion) return // static Loop 1 display only — see the render branch below
    runLoop()
    return () => {
      runIdRef.current++
    }
  }, [reducedMotion])

  function handleAnalyze(e: FormEvent) {
    e.preventDefault()
    const trimmed = domainInput.trim()
    if (trimmed) {
      // No backend yet — reuses the scripted demo, personalized with the domain the visitor typed.
      domainOverrideRef.current = trimmed.replace(/^https?:\/\//, '')
      loopIndexRef.current = 0
    }
    setDomainInput('')
    pausedRef.current = false
    runLoop()
  }

  if (reducedMotion) {
    const script = HERO_LOOP_SCRIPTS[0]
    return (
      <div className="w-full max-w-2xl">
        <StaticAnalyzeForm value={domainInput} onChange={setDomainInput} />
        <div className="overflow-hidden rounded-2xl border border-mkt-cream/10 bg-white/[0.03]">
          <BrowserChromeBar domain={script.domain} />
          <div className="min-h-72 space-y-3 p-5 md:min-h-64">
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-mkt-cream/40">Live on {script.domain}</p>
              <LaneBadge lane="sales" />
            </div>
            <Bubble align="right">{script.support.question}</Bubble>
            <div className="space-y-1.5">
              <Bubble>{script.support.answer}</Bubble>
              <div className="flex items-center gap-1.5 pl-1 text-[12px] text-mkt-cream/40">
                <FileText className="h-3 w-3" /> {script.support.citation}
              </div>
            </div>
            <Bubble align="right">{script.sales.question}</Bubble>
            <Bubble>{script.sales.answer}</Bubble>
            <Bubble align="right">{leadReplyText(script.sales.leadName)}</Bubble>
            <div className="flex items-center gap-1.5 rounded-full bg-sales-500/15 px-3 py-1.5 text-[13px] text-sales-100">
              <CheckCircle2 className="h-3.5 w-3.5" /> Lead sent to your team — {script.sales.leadName}
            </div>
            <ConnectorRow tone="sales">
              <span className="flex items-center gap-1">
                <HubSpotIcon size={16} color="default" />
                <SlackIcon size={16} />
              </span>
              Synced to HubSpot · Notified on Slack
            </ConnectorRow>
          </div>
        </div>
      </div>
    )
  }

  const script = HERO_LOOP_SCRIPTS[loopIndex]
  const supportContent = escalationActive ? script.escalation! : script.support

  const showTranscript = step !== 'idle' && step !== 'crawling'
  const laneVisible = atOrAfter(step, 'support-q')
  const lane = atOrAfter(step, 'sales-typing-q') ? 'sales' : 'support'

  const showSupportQTyping = step === 'support-typing-q'
  const showSupportQFull = atOrAfter(step, 'support-q')
  const showSupportATyping = step === 'support-typing-a'
  const showSupportAFull = atOrAfter(step, 'support-done')

  const showSalesQTyping = step === 'sales-typing-q'
  const showSalesQFull = atOrAfter(step, 'sales-q')
  const showSalesATyping = step === 'sales-typing-a'
  const showSalesAFull = atOrAfter(step, 'sales-done')

  const showLeadQTyping = step === 'lead-typing-q'
  const showLeadQFull = atOrAfter(step, 'lead-q')
  const showLeadDone = step === 'lead-done'

  return (
    <div className="w-full max-w-2xl">
      <StaticAnalyzeForm value={domainInput} onChange={setDomainInput} onSubmit={handleAnalyze} />

      <div className="overflow-hidden rounded-2xl border border-mkt-cream/10 bg-white/[0.03]">
        <AnimatePresence mode="wait">
          <motion.div
            key={playKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: CROSSFADE_DURATION }}
          >
            <BrowserChromeBar domain={domain} />

            <div className="min-h-72 space-y-3 p-5 md:min-h-64">
              {step === 'idle' && (
                <p className="flex items-center gap-2 text-[14px] text-mkt-cream/40">
                  <Search className="h-3.5 w-3.5" /> Paste your URL above, or watch a live example play out below.
                </p>
              )}

              {step === 'crawling' && (
                <div className="space-y-2">
                  <p className="text-[14px] text-mkt-cream/70">Reading your site…</p>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-mkt-cream/10">
                    <motion.div
                      className="h-full bg-mkt-cream/60"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: CRAWL_BAR_DURATION, ease: 'easeInOut' }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {script.indexedPages.map((p) => (
                      <span key={p} className="rounded-full bg-mkt-cream/5 px-2.5 py-1 font-mono text-[11px] text-mkt-cream/40">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {showTranscript && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] text-mkt-cream/40">Live on {domain}</p>
                    {laneVisible && <LaneBadge lane={lane} />}
                  </div>

                  {showSupportQTyping && <TypingIndicator align="right" />}
                  {showSupportQFull && <Bubble align="right">{supportContent.question}</Bubble>}

                  {showSupportATyping && <TypingIndicator align="left" />}
                  {showSupportAFull && (
                    <div className="space-y-1.5">
                      <Bubble>{supportContent.answer}</Bubble>
                      {escalationActive ? (
                        <ConnectorRow tone="escalation">
                          <ZendeskIcon size={16} color="default" />
                          Escalated to Zendesk
                        </ConnectorRow>
                      ) : (
                        <div className="flex items-center gap-1.5 pl-1 text-[12px] text-mkt-cream/40">
                          <FileText className="h-3 w-3" /> {script.support.citation}
                        </div>
                      )}
                    </div>
                  )}

                  {showSalesQTyping && <TypingIndicator align="right" />}
                  {showSalesQFull && <Bubble align="right">{script.sales.question}</Bubble>}

                  {showSalesATyping && <TypingIndicator align="left" />}
                  {showSalesAFull && <Bubble>{script.sales.answer}</Bubble>}

                  {showLeadQTyping && <TypingIndicator align="right" />}
                  {showLeadQFull && <Bubble align="right">{leadReplyText(script.sales.leadName)}</Bubble>}

                  {showLeadDone && (
                    <div className="space-y-2">
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 rounded-full bg-sales-500/15 px-3 py-1.5 text-[13px] text-sales-100"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Lead sent to your team — {script.sales.leadName}
                      </motion.div>
                      <ConnectorRow tone="sales">
                        <span className="flex items-center gap-1">
                          <HubSpotIcon size={16} color="default" />
                          <SlackIcon size={16} />
                        </span>
                        Synced to HubSpot · Notified on Slack
                      </ConnectorRow>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function BrowserChromeBar({ domain }: { domain: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-mkt-cream/10 px-4 py-2.5">
      <span className="h-2.5 w-2.5 rounded-full bg-mkt-cream/20" />
      <span className="h-2.5 w-2.5 rounded-full bg-mkt-cream/20" />
      <span className="h-2.5 w-2.5 rounded-full bg-mkt-cream/20" />
      <span className="ml-3 truncate font-mono text-[12px] text-mkt-cream/50">{domain}</span>
    </div>
  )
}

function StaticAnalyzeForm({
  value,
  onChange,
  onSubmit,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit?: (e: FormEvent) => void
}) {
  return (
    <form onSubmit={onSubmit ?? ((e) => e.preventDefault())} className="mb-4 flex gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="yourwebsite.com"
        className={cn(
          'h-12 flex-1 rounded-xl border border-mkt-cream/15 bg-white/5 px-4 text-[15px] text-mkt-cream placeholder:text-mkt-cream/40',
          focusRing,
        )}
      />
      <button
        type="submit"
        className={cn(
          'h-12 shrink-0 rounded-xl bg-surface-page px-5 text-[15px] font-medium text-mkt-ink-950 transition-colors hover:bg-white',
          focusRing,
        )}
      >
        Analyze
      </button>
    </form>
  )
}
