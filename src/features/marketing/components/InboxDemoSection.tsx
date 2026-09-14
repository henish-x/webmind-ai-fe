import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, FileText, Send } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { LaneBadge } from '@/components/LaneBadge'
import { cn, focusRing } from '@/lib/utils'
import { MOCK_CARD } from './mockCard'
import { SECTION_PADDING } from './sectionSpacing'

type Step =
  | 'baseline'
  | 'frustrated-typing'
  | 'frustrated'
  | 'escalating-typing'
  | 'escalated'
  | 'agent-typing'
  | 'agent-reply'
  | 'resolved'

const STEP_ORDER: Step[] = [
  'baseline',
  'frustrated-typing',
  'frustrated',
  'escalating-typing',
  'escalated',
  'agent-typing',
  'agent-reply',
  'resolved',
]

function atOrAfter(step: Step, target: Step) {
  return STEP_ORDER.indexOf(step) >= STEP_ORDER.indexOf(target)
}

const PAUSE_BASELINE_HOLD = 2400
const PAUSE_TYPING = 900
const PAUSE_AFTER_FRUSTRATED_TYPING = 300
const PAUSE_FRUSTRATED_HOLD = 1600
const PAUSE_ESCALATING_TYPING = 900
const PAUSE_AFTER_ESCALATED = 1100
const PAUSE_AGENT_TYPING = 900
const PAUSE_AFTER_AGENT_REPLY = 1800
const PAUSE_RESOLVED_HOLD = 2400
const CROSSFADE_DURATION = 0.4

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function Avatar({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-primary text-[11px] font-medium text-surface-page">
      {children}
    </span>
  )
}

function Bubble({ author, children }: { author: 'visitor' | 'bot' | 'agent'; children: ReactNode }) {
  // Visitor messages sit on the right, AI/agent replies on the left — matching the hero
  // demo's chat convention (kept separate from the real dashboard's ConversationDetail,
  // which mirrors it, since this is the visitor-facing side of the same conversation).
  const isOutgoing = author === 'visitor'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('flex items-end gap-2', isOutgoing ? 'justify-end' : 'justify-start')}
    >
      {author === 'agent' && <Avatar>P</Avatar>}
      <div className={cn('flex flex-col', isOutgoing ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'max-w-[240px] rounded-lg px-3 py-2 text-[13px] leading-snug sm:max-w-xs',
            author === 'agent'
              ? 'bg-ink-primary text-surface-page'
              : author === 'bot'
                ? 'border border-hairline bg-surface-card text-ink-primary'
                : 'bg-surface-sunken text-ink-primary',
          )}
        >
          {children}
        </div>
        {author === 'agent' && <span className="mt-0.5 text-[11px] text-ink-muted">Priya</span>}
      </div>
    </motion.div>
  )
}

function TypingDots({ align = 'left' }: { align?: 'left' | 'right' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex', align === 'right' ? 'justify-end' : 'justify-start')}
    >
      <div className={cn('flex items-center gap-1 rounded-lg px-3 py-2.5', align === 'right' ? 'bg-ink-primary/10' : 'bg-surface-sunken')}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
    </motion.div>
  )
}

function ListRow({ name, preview, time, lane, active, escalated }: { name: string; preview: string; time: string; lane: 'support' | 'sales'; active: boolean; escalated: boolean }) {
  return (
    <div
      className={cn(
        'border-l-2 px-3 py-2.5 text-left transition-colors',
        escalated ? 'border-l-danger' : 'border-l-transparent',
        active ? 'bg-surface-sunken' : '',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[12px] font-medium text-ink-primary">{name}</span>
        <span className="shrink-0 text-[11px] text-ink-muted">{time}</span>
      </div>
      <div className="mt-1">
        <LaneBadge lane={lane} />
      </div>
      <p className="mt-1 truncate text-[11px] text-ink-secondary">{preview}</p>
    </div>
  )
}

export function InboxDemoSection() {
  const reducedMotion = useReducedMotion()
  const [step, setStep] = useState<Step>(reducedMotion ? 'agent-reply' : 'baseline')
  const [playKey, setPlayKey] = useState(0)
  const runIdRef = useRef(0)
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    const myRun = ++runIdRef.current
    const isCurrent = () => runIdRef.current === myRun

    async function runLoop() {
      for (;;) {
        setStep('baseline')
        setPlayKey((k) => k + 1)
        await sleep(PAUSE_BASELINE_HOLD)
        if (!isCurrent()) return

        setStep('frustrated-typing')
        await sleep(PAUSE_TYPING)
        if (!isCurrent()) return

        setStep('frustrated')
        await sleep(PAUSE_AFTER_FRUSTRATED_TYPING + PAUSE_FRUSTRATED_HOLD)
        if (!isCurrent()) return

        setStep('escalating-typing')
        await sleep(PAUSE_ESCALATING_TYPING)
        if (!isCurrent()) return

        setStep('escalated')
        await sleep(PAUSE_AFTER_ESCALATED)
        if (!isCurrent()) return

        setStep('agent-typing')
        await sleep(PAUSE_AGENT_TYPING)
        if (!isCurrent()) return

        setStep('agent-reply')
        await sleep(PAUSE_AFTER_AGENT_REPLY)
        if (!isCurrent()) return

        setStep('resolved')
        await sleep(PAUSE_RESOLVED_HOLD)
        if (!isCurrent()) return
      }
    }
    runLoop()
    return () => {
      runIdRef.current++
    }
  }, [reducedMotion])

  useEffect(() => {
    // Scrolls only the thread pane itself (scrollTo, not scrollIntoView) — scrollIntoView
    // bubbles up to every scrollable ancestor including the page, which on this scrolling
    // marketing page would yank the visitor back to this section on every step change.
    const el = threadRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [step, playKey, reducedMotion])

  const escalated = atOrAfter(step, 'escalated')
  const showFrustratedTyping = step === 'frustrated-typing'
  const showFrustrated = atOrAfter(step, 'frustrated')
  const showEscalatingTyping = step === 'escalating-typing'
  const showAgentTyping = step === 'agent-typing'
  const showAgentReply = atOrAfter(step, 'agent-reply')
  const showResolved = step === 'resolved'

  return (
    <section className={cn('relative overflow-hidden bg-surface-page', SECTION_PADDING)}>
      <div aria-hidden className="mkt-dot-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
        <h2 className="text-center font-serif text-[28px] font-medium leading-[1.2] text-ink-primary md:text-[36px]">
          Your team stays in the loop, not out of it.
        </h2>

        <div className={cn(MOCK_CARD, 'mx-auto mt-12 max-w-4xl')}>
          <div className="flex items-center gap-1.5 border-b border-hairline bg-surface-sunken px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
            <span className="ml-3 truncate font-mono text-[12px] text-ink-muted">app.webmindai.com/inbox</span>
          </div>

          <div className="flex h-[460px]">
            <div className="hidden w-48 shrink-0 flex-col divide-y divide-hairline overflow-y-auto border-r border-hairline md:flex">
              <ListRow name="Marcus T." preview={showFrustrated ? "This is the second time…" : 'Do you ship to Canada?'} time="2m ago" lane="support" active escalated={escalated} />
              <ListRow name="Elena R." preview="Do you have a Pro plan demo?" time="18m ago" lane="sales" active={false} escalated={false} />
              <ListRow name="Devon K." preview="Thanks, that answered it!" time="1h ago" lane="support" active={false} escalated={false} />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <LaneBadge lane="support" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={escalated ? 'paused' : 'active'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                        escalated ? 'bg-surface-sunken text-ink-secondary' : 'bg-support-50 text-support-700',
                      )}
                    >
                      {escalated ? 'AI paused' : 'AI replying'}
                    </motion.span>
                  </AnimatePresence>
                  {escalated && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center rounded-full bg-danger/10 px-2 py-0.5 text-[11px] font-medium text-danger"
                    >
                      Escalated
                    </motion.span>
                  )}
                </div>
                <p className="text-[12px] text-ink-secondary">Marcus T.</p>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={playKey}
                  ref={threadRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: CROSSFADE_DURATION }}
                  className="flex-1 space-y-3 overflow-y-auto p-4"
                >
                  <Bubble author="visitor">Do you ship to Canada?</Bubble>
                  <Bubble author="bot">Yes — we ship to Canada with a 5–7 day delivery window.</Bubble>

                  {showFrustratedTyping && <TypingDots align="right" />}
                  {showFrustrated && (
                    <>
                      <Bubble author="visitor">
                        This is the second time your bot's given me a different answer about my refund. I just want this sorted.
                      </Bubble>
                      <div className="flex justify-start">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-[11px] text-warning">
                          <AlertTriangle className="h-3 w-3" /> Confidence low — flagged for escalation
                        </span>
                      </div>
                    </>
                  )}

                  {showEscalatingTyping && <TypingDots align="left" />}

                  {escalated && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center gap-2 py-1"
                    >
                      <Avatar>P</Avatar>
                      <p className="text-[12px] text-ink-muted">Priya joined the conversation</p>
                    </motion.div>
                  )}

                  {showAgentTyping && <TypingDots align="left" />}
                  {showAgentReply && (
                    <Bubble author="agent">
                      Hi, I'm Priya — I can see your order and the refund request. I've processed it now; you'll see it back in
                      3–5 business days.
                    </Bubble>
                  )}

                  {showResolved && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center pt-1"
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-[12px] font-medium text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Resolved by Priya in 40s
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {escalated && (
                <div className="border-t border-hairline bg-surface-sunken px-4 py-1.5 text-[11px] text-ink-secondary">
                  AI paused — Priya is replying
                </div>
              )}

              <div className="flex items-center gap-2 border-t border-hairline p-2.5">
                <div className={cn('h-8 flex-1 rounded-md border border-hairline bg-surface-card px-3 text-[12px] leading-8 text-ink-muted', focusRing)}>
                  {escalated ? 'Reply as yourself…' : 'Reply to take over from the AI…'}
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink-primary text-surface-page">
                  <Send className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            <div className="hidden w-48 shrink-0 flex-col gap-2 overflow-y-auto border-l border-hairline bg-surface-card p-3 xl:flex">
              <p className="text-[11px] font-medium text-support-700">Cited sources</p>
              <div className="flex items-start gap-2 rounded-md border border-hairline p-2">
                <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted" strokeWidth={1.5} />
                <span className="truncate text-[11px] text-ink-primary">Refund policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
