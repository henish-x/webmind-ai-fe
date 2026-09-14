import { PartyPopper } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { botService } from '@/data/services'

export function DoneStep({ botId }: { botId: string }) {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    botService.completeOnboarding(botId).then(() => setReady(true))
  }, [botId])

  return (
    <div className="mx-auto max-w-md text-center">
      <PartyPopper className="mx-auto h-8 w-8 text-ink-primary" strokeWidth={1.5} />
      <p className="mt-4 text-page-title font-medium text-ink-primary">Your chatbot is live</p>
      <p className="mt-2 text-body text-ink-secondary">
        It's already answering support questions and capturing leads on your site.
      </p>

      <div className="mt-8 space-y-2">
        <Button size="lg" className="w-full" disabled={!ready} onClick={() => navigate('/dashboard')}>
          Go to dashboard
        </Button>
        <Button size="lg" variant="secondary" className="w-full" disabled={!ready} onClick={() => navigate('/customize')}>
          Test your chatbot
        </Button>
      </div>
    </div>
  )
}
