import { Calendar, FileText, Headset, HelpCircle, Send } from 'lucide-react'
import { useRef, useState } from 'react'
import { LaneBadge } from '@/components/LaneBadge'
import { cn, focusRing } from '@/lib/utils'
import { type DemoExample, DEMO_SCRIPTS } from '../data/demoScripts'
import { SECTION_PADDING } from './sectionSpacing'

const SALES_KEYWORDS = ['price', 'cost', 'buy', 'purchase', '$', 'under', 'quote', 'much']

interface DemoMessage {
  id: number
  author: 'visitor' | 'bot'
  text: string
  lane?: 'support' | 'sales'
  variant?: DemoExample['category']
  meta?: string
}

function findExample(script: (typeof DEMO_SCRIPTS)[number], category: DemoExample['category']) {
  return script.examples.find((e) => e.category === category)!
}

/** A played-through support + sales Q&A, so the card never opens on an empty shell. */
function playedExample(script: (typeof DEMO_SCRIPTS)[number]): DemoMessage[] {
  const supportExample = findExample(script, 'support')
  const salesExample = findExample(script, 'sales')
  return [
    { id: 1, author: 'visitor', text: supportExample.question },
    { id: 2, author: 'bot', text: supportExample.answer, lane: 'support', variant: 'support', meta: supportExample.meta },
    { id: 3, author: 'visitor', text: salesExample.question },
    { id: 4, author: 'bot', text: salesExample.answer, lane: 'sales', variant: 'sales' },
  ]
}

export function InteractiveDemo() {
  const [scriptId, setScriptId] = useState(DEMO_SCRIPTS[0].id)
  const script = DEMO_SCRIPTS.find((s) => s.id === scriptId)!
  const [messages, setMessages] = useState<DemoMessage[]>(() => playedExample(DEMO_SCRIPTS[0]))
  const [input, setInput] = useState('')
  const nextIdRef = useRef(5)

  function nextId() {
    nextIdRef.current += 1
    return nextIdRef.current
  }

  function reset(nextScriptId: string) {
    setScriptId(nextScriptId)
    const nextScript = DEMO_SCRIPTS.find((s) => s.id === nextScriptId)!
    setMessages(playedExample(nextScript))
    setInput('')
  }

  function sendExample(example: DemoExample) {
    const lane = example.category === 'support' ? 'support' : example.category === 'sales' ? 'sales' : undefined
    const visitorMsg: DemoMessage = { id: nextId(), author: 'visitor', text: example.question }
    const botMsg: DemoMessage = {
      id: nextId(),
      author: 'bot',
      text: example.answer,
      lane,
      variant: example.category,
      meta: example.meta,
    }
    setMessages((prev) => [...prev, visitorMsg, botMsg])
  }

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    const isSales = SALES_KEYWORDS.some((kw) => trimmed.toLowerCase().includes(kw))
    const supportExample = findExample(script, 'support')
    const salesExample = findExample(script, 'sales')
    const visitorMsg: DemoMessage = { id: nextId(), author: 'visitor', text: trimmed }
    const botMsg: DemoMessage = isSales
      ? { id: nextId(), author: 'bot', text: salesExample.answer, lane: 'sales', variant: 'sales' }
      : {
          id: nextId(),
          author: 'bot',
          text: supportExample.answer,
          lane: 'support',
          variant: 'support',
          meta: supportExample.meta,
        }
    setMessages((prev) => [...prev, visitorMsg, botMsg])
    setInput('')
  }

  return (
    <section className={cn('bg-surface-page', SECTION_PADDING)}>
      <div className="mx-auto max-w-[900px] px-6 md:px-10">
        <div className="text-center">
          <h2 className="font-serif text-[28px] font-medium leading-[1.2] text-ink-primary md:text-[36px]">
            Try it for your kind of business
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[17px] text-ink-secondary">
            Ask a question below and watch which lane it lands in.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {DEMO_SCRIPTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => reset(s.id)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-[14px] transition-colors',
                s.id === scriptId ? 'border-ink-primary bg-ink-primary text-surface-page' : 'border-hairline text-ink-secondary hover:bg-surface-sunken',
                focusRing,
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-hairline bg-white shadow-overlay">
          <div className="flex items-center gap-1.5 border-b border-hairline bg-surface-sunken px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
            <span className="ml-3 truncate font-mono text-[12px] text-ink-muted">{script.domain}</span>
          </div>

          <div className="min-h-64 space-y-3 p-5">
            {messages.map((m) => (
              <div key={m.id} className={cn('flex flex-col gap-1', m.author === 'visitor' ? 'items-end' : 'items-start')}>
                {m.lane && <LaneBadge lane={m.lane} />}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px]',
                    m.author === 'visitor' ? 'bg-ink-primary text-surface-page' : 'border border-hairline bg-surface-page text-ink-primary',
                  )}
                >
                  {m.text}
                </div>

                {m.variant === 'support' && m.meta && (
                  <div className="flex items-center gap-1.5 pl-1 text-[12px] text-ink-muted">
                    <FileText className="h-3 w-3" /> {m.meta}
                  </div>
                )}
                {m.variant === 'sales' && (
                  <p className="pl-1 text-[12px] text-sales-700">
                    In the real product, a name and email captured here would land straight in your inbox — and your CRM, if connected.
                  </p>
                )}
                {m.variant === 'fallback' && m.meta && (
                  <div className="flex items-center gap-1.5 pl-1 text-[12px] text-ink-muted">
                    <HelpCircle className="h-3 w-3" /> {m.meta}
                  </div>
                )}
                {m.variant === 'booking' && m.meta && (
                  <div className="flex items-center gap-1.5 pl-1 text-[12px] text-ink-muted">
                    <Calendar className="h-3 w-3" /> {m.meta}
                  </div>
                )}
                {m.variant === 'escalation' && m.meta && (
                  <div className="flex items-center gap-1.5 rounded-full bg-surface-sunken px-3 py-1.5 text-[12px] text-ink-secondary">
                    <Headset className="h-3.5 w-3.5" /> {m.meta}
                  </div>
                )}
              </div>
            ))}

            <div className="space-y-2 pt-2">
              <p className="text-[13px] text-ink-secondary">Try another question:</p>
              <div className="flex flex-wrap gap-2">
                {script.examples.map((ex) => (
                  <button
                    key={ex.category}
                    type="button"
                    onClick={() => sendExample(ex)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-[13px] transition-colors',
                      ex.category === 'support' && 'bg-support-50 text-support-700 hover:bg-support-100',
                      ex.category === 'sales' && 'bg-sales-50 text-sales-700 hover:bg-sales-100',
                      (ex.category === 'fallback' || ex.category === 'booking' || ex.category === 'escalation') &&
                        'border border-hairline text-ink-secondary hover:bg-surface-sunken',
                      focusRing,
                    )}
                  >
                    {ex.question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-center gap-2 border-t border-hairline p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className={cn('h-10 flex-1 rounded-lg border border-hairline bg-surface-page px-3 text-[14px] text-ink-primary placeholder:text-ink-muted', focusRing)}
            />
            <button
              type="submit"
              aria-label="Send"
              className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-primary text-surface-page', focusRing)}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
