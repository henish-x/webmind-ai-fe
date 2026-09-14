import { Code2, Link2, Split, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SECTION_PADDING } from './sectionSpacing'

const STEPS = [
  {
    icon: Link2,
    title: 'Paste your URL',
    description: 'We read your site, no manual setup.',
  },
  {
    icon: Split,
    title: 'Two lanes, one bot',
    description: 'Support and sales are handled differently, automatically.',
  },
  {
    icon: Sparkles,
    title: 'Customize in minutes',
    description: 'Greeting, colors, and what counts as a "lead" for your business.',
  },
  {
    icon: Code2,
    title: 'Install one line of code',
    description: 'Works on any website, live in under 10 minutes.',
  },
]

export function HowItWorks() {
  const reducedMotion = useReducedMotion()

  return (
    <section id="how-it-works" className={cn('bg-surface-page', SECTION_PADDING)}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <h2 className="text-center font-serif text-[28px] font-medium leading-[1.2] text-ink-primary md:text-[36px]">
          How it works
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.3, delay: reducedMotion ? 0 : i * 0.08 }}
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-hairline-strong text-[12px] font-medium text-ink-secondary">
                  {i + 1}
                </span>
                <step.icon className="h-5 w-5 text-ink-secondary" strokeWidth={1.5} />
              </div>
              <p className="mt-3 text-[17px] font-medium text-ink-primary">{step.title}</p>
              <p className="mt-1.5 text-[15px] leading-[1.6] text-ink-secondary">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
