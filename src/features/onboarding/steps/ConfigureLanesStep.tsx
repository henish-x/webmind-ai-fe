import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { botService } from '@/data/services'
import type { QualificationQuestion } from '@/data/types'
import { cn, focusRing } from '@/lib/utils'

export interface ConfigureLanesStepProps {
  botId: string
  onDone: () => void
}

let questionIdSeq = 0

export function ConfigureLanesStep({ botId, onDone }: ConfigureLanesStepProps) {
  const [supportGreeting, setSupportGreeting] = useState(
    "Hi! I'm here to help — ask me anything and I'll do my best to answer from what I know about your site.",
  )
  const [salesGreeting, setSalesGreeting] = useState("Looks like you're interested — let's get you the right info.")
  const [questions, setQuestions] = useState<QualificationQuestion[]>([
    { id: 'q1', label: 'What is your budget range?', order: 1 },
    { id: 'q2', label: "What's your timeline?", order: 2 },
  ])
  const [saving, setSaving] = useState(false)

  function addQuestion() {
    questionIdSeq += 1
    setQuestions((prev) => [...prev, { id: `local_${questionIdSeq}`, label: '', order: prev.length + 1 }])
  }
  function updateQuestion(id: string, label: string) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, label } : q)))
  }
  function removeQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  async function handleContinue() {
    setSaving(true)
    const bot = await botService.getBotById(botId)
    if (bot) {
      await botService.updateBot(botId, {
        persona: { ...bot.persona, greeting: supportGreeting },
        salesLane: { ...bot.salesLane, qualificationQuestions: questions.filter((q) => q.label.trim()) },
        widgetConfig: { ...bot.widgetConfig, greeting: salesGreeting },
      })
    }
    onDone()
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <p className="text-page-title font-medium text-ink-primary">Set up your two lanes</p>
        <p className="mt-2 text-body text-ink-secondary">
          Every conversation gets routed to Support or Sales — configure how each one greets a visitor.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-hairline bg-surface-card">
          <div className="rounded-t-lg bg-support-50 px-4 py-2.5">
            <p className="text-meta font-medium text-support-700">Support lane</p>
          </div>
          <div className="space-y-1.5 p-4">
            <Label htmlFor="support-greeting">Greeting message</Label>
            <Textarea id="support-greeting" value={supportGreeting} onChange={(e) => setSupportGreeting(e.target.value)} />
          </div>
        </div>

        <div className="rounded-lg border border-hairline bg-surface-card">
          <div className="rounded-t-lg bg-sales-50 px-4 py-2.5">
            <p className="text-meta font-medium text-sales-700">Sales lane</p>
          </div>
          <div className="space-y-4 p-4">
            <div className="space-y-1.5">
              <Label htmlFor="sales-greeting">Greeting message</Label>
              <Textarea id="sales-greeting" value={salesGreeting} onChange={(e) => setSalesGreeting(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Qualification questions</Label>
              <div className="space-y-2">
                {questions.map((q) => (
                  <div key={q.id} className="flex items-center gap-2">
                    <Input value={q.label} onChange={(e) => updateQuestion(q.id, e.target.value)} placeholder="Ask a question…" />
                    <button
                      type="button"
                      onClick={() => removeQuestion(q.id)}
                      aria-label="Remove question"
                      className={cn('shrink-0 rounded-md p-1.5 text-ink-muted hover:text-danger', focusRing)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addQuestion}
                className={cn('flex items-center gap-1 rounded-md py-1 text-meta font-medium text-sales-700', focusRing)}
              >
                <Plus className="h-3.5 w-3.5" /> Add question
              </button>
            </div>
          </div>
        </div>
      </div>

      <Button size="lg" className="mt-8 w-full" onClick={handleContinue} disabled={saving}>
        {saving ? 'Saving…' : 'Continue'}
      </Button>
    </div>
  )
}
