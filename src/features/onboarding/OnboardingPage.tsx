import { useState } from 'react'
import type { Source } from '@/data/types'
import { StepProgress } from './StepProgress'
import { ConfigureLanesStep } from './steps/ConfigureLanesStep'
import { CrawlingStep } from './steps/CrawlingStep'
import { CustomizeWidgetStep } from './steps/CustomizeWidgetStep'
import { DoneStep } from './steps/DoneStep'
import { InstallStep } from './steps/InstallStep'
import { PasteUrlStep } from './steps/PasteUrlStep'
import { PreviewSourcesStep } from './steps/PreviewSourcesStep'

const TOTAL_STEPS = 7

export function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [botId, setBotId] = useState<string | null>(null)
  const [url, setUrl] = useState('')
  const [sources, setSources] = useState<Source[]>([])

  return (
    <div>
      <StepProgress step={step} total={TOTAL_STEPS} />

      {step === 1 && (
        <PasteUrlStep
          onDone={(id, u) => {
            setBotId(id)
            setUrl(u)
            setStep(2)
          }}
        />
      )}
      {step === 2 && botId && (
        <CrawlingStep
          botId={botId}
          url={url}
          onDone={(discovered) => {
            setSources(discovered)
            setStep(3)
          }}
        />
      )}
      {step === 3 && <PreviewSourcesStep sources={sources} onDone={() => setStep(4)} />}
      {step === 4 && botId && <ConfigureLanesStep botId={botId} onDone={() => setStep(5)} />}
      {step === 5 && botId && <CustomizeWidgetStep botId={botId} onDone={() => setStep(6)} />}
      {step === 6 && botId && <InstallStep botId={botId} onDone={() => setStep(7)} />}
      {step === 7 && botId && <DoneStep botId={botId} />}
    </div>
  )
}
