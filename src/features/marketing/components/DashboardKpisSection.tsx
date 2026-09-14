import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { StatCard } from '@/components/StatCard'
import { cn } from '@/lib/utils'
import { useCountUp } from '@/lib/useCountUp'
import { MOCK_CARD } from './mockCard'
import { SECTION_PADDING } from './sectionSpacing'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SUPPORT_TREND = [52, 58, 61, 65, 70, 75, 79]
const SALES_TREND = [5, 7, 6, 9, 11, 10, 13]

const CONVERSATIONS_THIS_WEEK = 428
const CONVERSATIONS_DELTA = 18
const RESOLUTION_RATE = 92
const LEADS_CAPTURED = 61
const ESCALATIONS = 3

function CountingStat({
  label,
  target,
  suffix = '',
  accent,
  delta,
  inView,
  instant,
}: {
  label: string
  target: number
  suffix?: string
  accent?: 'support' | 'sales' | 'danger' | 'none'
  delta?: number
  inView: boolean
  instant: boolean
}) {
  const count = useCountUp(target, { start: inView, duration: 1100, instant })
  return <StatCard label={label} value={`${count}${suffix}`} accent={accent} delta={delta} />
}

/** Normalizes a data series into an SVG path (viewBox 280x80, 8px vertical margin). */
function trendPath(data: number[]) {
  const width = 280
  const height = 80
  const margin = 8
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)

  return data
    .map((v, i) => {
      const x = i * stepX
      const y = height - margin - ((v - min) / range) * (height - margin * 2)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

function TrendCard({
  heading,
  headingColor,
  data,
  stroke,
  valueLabel,
  inView,
  reducedMotion,
}: {
  heading: string
  headingColor: string
  data: number[]
  stroke: string
  valueLabel: string
  inView: boolean
  reducedMotion: boolean | null
}) {
  const path = trendPath(data)
  const lastX = 280
  const lastY = Number(path.split('L').at(-1)?.split(',')[1] ?? 0)

  return (
    <div className="rounded-lg border border-hairline bg-surface-card p-4">
      <p className={cn('text-meta font-medium', headingColor)}>{heading}</p>
      <svg viewBox="0 0 280 80" className="mt-2 h-20 w-full overflow-visible">
        {[20, 40, 60].map((y) => (
          <line key={y} x1={0} x2={280} y1={y} y2={y} stroke="var(--hairline)" strokeWidth={1} />
        ))}
        <motion.path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reducedMotion ? 1 : 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: reducedMotion ? 0 : 1.3, ease: 'easeInOut' }}
        />
        <motion.circle
          cx={lastX}
          cy={lastY}
          r={3}
          fill={stroke}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: reducedMotion ? 0 : 1.2 }}
        />
      </svg>
      <div className="mt-1 flex justify-between text-caption text-ink-muted">
        <span>{DAYS[0]}</span>
        <span>{DAYS[DAYS.length - 1]}</span>
      </div>
      <p className="mt-1 text-caption text-ink-muted">{valueLabel}</p>
    </div>
  )
}

/**
 * A realistic mock of the actual Overview dashboard (same 4 stat cards + 2 trend
 * panels the real OverviewPage renders), not a generic "analytics" bullet —
 * proof the numbers this product promises are numbers you actually get.
 */
export function DashboardKpisSection() {
  const reducedMotion = useReducedMotion()
  const [inView, setInView] = useState(Boolean(reducedMotion))

  return (
    <section className={cn('relative overflow-hidden bg-surface-page', SECTION_PADDING)}>
      <div aria-hidden className="mkt-dot-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-[28px] font-medium leading-[1.2] text-ink-primary md:text-[36px]">
            The Overview tab you'll actually open every morning.
          </h2>
          <p className="mx-auto mt-4 text-[17px] leading-[1.65] text-ink-secondary">
            Every conversation becomes a number you can act on — like a 92% resolution rate, and 61 leads captured
            this week alone.
          </p>
        </div>

        <motion.div
          onViewportEnter={() => setInView(true)}
          viewport={{ once: true, amount: 0.4 }}
          className={cn(MOCK_CARD, 'mx-auto mt-12 max-w-4xl')}
        >
          <div className="flex items-center gap-1.5 border-b border-hairline bg-surface-sunken px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
            <span className="ml-3 truncate font-mono text-[12px] text-ink-muted">app.webmindai.com/overview</span>
          </div>

          <div className="space-y-4 p-4 md:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <CountingStat
                label="Conversations this week"
                target={CONVERSATIONS_THIS_WEEK}
                delta={CONVERSATIONS_DELTA}
                inView={inView}
                instant={Boolean(reducedMotion)}
              />
              <CountingStat
                label="Resolution rate"
                target={RESOLUTION_RATE}
                suffix="%"
                accent="support"
                inView={inView}
                instant={Boolean(reducedMotion)}
              />
              <CountingStat
                label="Leads captured"
                target={LEADS_CAPTURED}
                accent="sales"
                inView={inView}
                instant={Boolean(reducedMotion)}
              />
              <CountingStat
                label="Escalations needing attention"
                target={ESCALATIONS}
                accent="danger"
                inView={inView}
                instant={Boolean(reducedMotion)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <TrendCard
                heading="Support · resolved by AI"
                headingColor="text-support-700"
                data={SUPPORT_TREND}
                stroke="var(--support-500)"
                valueLabel="Resolved conversations"
                inView={inView}
                reducedMotion={reducedMotion}
              />
              <TrendCard
                heading="Sales · leads captured"
                headingColor="text-sales-700"
                data={SALES_TREND}
                stroke="var(--sales-500)"
                valueLabel="Leads"
                inView={inView}
                reducedMotion={reducedMotion}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
