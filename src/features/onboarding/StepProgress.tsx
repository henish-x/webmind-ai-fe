import { cn } from '@/lib/utils'

export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-1.5" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn('h-1.5 w-6 rounded-full transition-colors', i + 1 <= step ? 'bg-ink-primary' : 'bg-hairline-strong')}
        />
      ))}
    </div>
  )
}
