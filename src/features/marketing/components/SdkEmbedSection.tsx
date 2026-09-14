import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn, focusRing } from '@/lib/utils'
import { HtmlIcon, ReactIcon, ShopifyIcon, WebflowIcon, WordpressIcon } from './BrandIcons'
import { MOCK_CARD } from './mockCard'
import { SECTION_PADDING } from './sectionSpacing'

const SCRIPT_SNIPPET = '<script\n  src="https://cdn.webmindai.com/widget.js"\n  data-bot-id="wm_8f2a1c"\n></script>'
const REACT_SNIPPET =
  "import { WebMindWidget } from '@webmindai/react'\n\nexport default function App() {\n  return <WebMindWidget botId=\"wm_8f2a1c\" />\n}"

interface Platform {
  id: string
  label: string
  filename: string
  icon: ReactNode
  snippet: string
}

const PLATFORMS: Platform[] = [
  { id: 'html', label: 'HTML', filename: 'index.html', icon: <HtmlIcon size={14} color="default" />, snippet: SCRIPT_SNIPPET },
  { id: 'wordpress', label: 'WordPress', filename: 'footer.php', icon: <WordpressIcon size={14} color="default" />, snippet: SCRIPT_SNIPPET },
  { id: 'shopify', label: 'Shopify', filename: 'theme.liquid', icon: <ShopifyIcon size={14} color="default" />, snippet: SCRIPT_SNIPPET },
  { id: 'webflow', label: 'Webflow', filename: 'Custom code', icon: <WebflowIcon size={14} color="default" />, snippet: SCRIPT_SNIPPET },
  { id: 'react', label: 'React', filename: 'App.tsx', icon: <ReactIcon size={14} color="default" />, snippet: REACT_SNIPPET },
]

const MS_PER_CHAR = 16
const PAUSE_BEFORE_TYPE = 500
const PAUSE_AFTER_COMPLETE = 2400

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/** Highlights quoted strings only — enough IDE feel without a full tokenizer. */
function highlightLine(line: string, key: number) {
  const parts = line.split(/("(?:[^"\\]|\\.)*")/g)
  return (
    <span key={key}>
      {parts.map((part, i) => (part.startsWith('"') ? <span key={i} className="text-support-100">{part}</span> : <span key={i}>{part}</span>))}
    </span>
  )
}

function CodeEditor({ platform, charCount, showCursor }: { platform: Platform; charCount: number; showCursor: boolean }) {
  const revealed = platform.snippet.slice(0, charCount)
  const lines = revealed.split('\n')

  return (
    <div className="overflow-hidden rounded-2xl border border-mkt-cream/10 bg-mkt-ink-950 shadow-overlay transition-transform duration-300 ease-out hover:scale-[1.01]">
      <div className="flex items-center gap-1.5 border-b border-mkt-cream/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-mkt-cream/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-mkt-cream/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-mkt-cream/20" />
      </div>
      <div className="flex items-center gap-2 border-b border-mkt-cream/10 bg-white/[0.02] px-4 py-2">
        {platform.icon}
        <span className="font-mono text-[12px] text-mkt-cream/70">{platform.filename}</span>
      </div>
      <div className="flex min-h-56 gap-3 overflow-x-auto p-4 font-mono text-[11px] leading-relaxed sm:gap-4 sm:text-[13px]">
        <div className="select-none text-right text-mkt-cream/25">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="whitespace-pre text-mkt-cream/90">
          {lines.map((line, i) => (
            <div key={i}>
              {highlightLine(line, i)}
              {showCursor && i === lines.length - 1 && <span className="inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-mkt-cream/70" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BrowserMock({ bubbleVisible, reducedMotion }: { bubbleVisible: boolean; reducedMotion: boolean | null }) {
  return (
    <div className={cn(MOCK_CARD, 'relative')}>
      <div className="flex items-center gap-1.5 border-b border-hairline bg-surface-sunken px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
        <span className="ml-3 truncate font-mono text-[12px] text-ink-muted">yourwebsite.com</span>
      </div>
      <div className="relative min-h-56 space-y-4 p-6">
        <div className="flex items-center justify-between">
          <span className="h-3 w-20 rounded-full bg-surface-sunken" />
          <div className="flex gap-3">
            <span className="h-2 w-8 rounded-full bg-surface-sunken" />
            <span className="h-2 w-8 rounded-full bg-surface-sunken" />
            <span className="h-2 w-8 rounded-full bg-surface-sunken" />
          </div>
        </div>
        <div className="space-y-2 pt-4">
          <span className="block h-4 w-3/5 rounded-full bg-surface-sunken" />
          <span className="block h-2.5 w-4/5 rounded-full bg-surface-sunken" />
          <span className="block h-2.5 w-2/3 rounded-full bg-surface-sunken" />
        </div>
        <div className="flex gap-2 pt-2">
          <span className="h-7 w-20 rounded-md bg-surface-sunken" />
          <span className="h-7 w-20 rounded-md border border-hairline" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={bubbleVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 14 }}
          className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-mkt-ink-950 text-mkt-cream shadow-overlay"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
        </motion.div>
      </div>
    </div>
  )
}

/**
 * Shows the actual install experience — typing the real embed snippet and
 * watching the launcher appear — rather than a static code block, so "under
 * 10 minutes" reads as demonstrated, not just claimed.
 */
export function SdkEmbedSection() {
  const reducedMotion = useReducedMotion()
  const [activeId, setActiveId] = useState(PLATFORMS[0].id)
  const [charCount, setCharCount] = useState(0)
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const runIdRef = useRef(0)

  const platform = PLATFORMS.find((p) => p.id === activeId) ?? PLATFORMS[0]

  useEffect(() => {
    if (reducedMotion) return // handled via the derived display values below — no scripted loop needed

    const myRun = ++runIdRef.current
    const isCurrent = () => runIdRef.current === myRun

    async function loop() {
      for (;;) {
        setCharCount(0)
        setBubbleVisible(false)
        await sleep(PAUSE_BEFORE_TYPE)
        if (!isCurrent()) return

        for (let i = 1; i <= platform.snippet.length; i++) {
          setCharCount(i)
          await sleep(MS_PER_CHAR)
          if (!isCurrent()) return
        }

        setBubbleVisible(true)
        await sleep(PAUSE_AFTER_COMPLETE)
        if (!isCurrent()) return
      }
    }
    loop()
    return () => {
      runIdRef.current++
    }
  }, [activeId, reducedMotion, platform.snippet])

  const displayCharCount = reducedMotion ? platform.snippet.length : charCount
  const displayBubbleVisible = reducedMotion ? true : bubbleVisible

  return (
    <section className={cn('relative overflow-hidden bg-surface-page', SECTION_PADDING)}>
      <div aria-hidden className="mkt-dot-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-[28px] font-medium leading-[1.2] text-ink-primary md:text-[36px]">
            One line of code. Live everywhere.
          </h2>
          <p className="mx-auto mt-4 text-[17px] leading-[1.65] text-ink-secondary">
            No dev sprint, no ticket in your backlog — paste it yourself in under 10 minutes.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
          <AnimatePresence mode="wait">
            <motion.div key={activeId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <CodeEditor platform={platform} charCount={displayCharCount} showCursor={!reducedMotion} />
            </motion.div>
          </AnimatePresence>

          <BrowserMock bubbleVisible={displayBubbleVisible} reducedMotion={reducedMotion} />
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveId(p.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors',
                p.id === activeId
                  ? 'border-ink-primary bg-ink-primary text-surface-page'
                  : 'border-hairline text-ink-secondary hover:bg-surface-sunken',
                focusRing,
              )}
            >
              <span className={p.id === activeId ? 'grayscale invert' : ''}>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
