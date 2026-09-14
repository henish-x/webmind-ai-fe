import { useState } from 'react'
import { Button } from '@/components/Button'
import { SplitPreviewLayout } from '@/components/SplitPreviewLayout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { botService } from '@/data/services'
import type { WidgetPosition } from '@/data/types'
import { WidgetPreview } from '@/features/customize/WidgetPreview'
import { cn, focusRing } from '@/lib/utils'

export interface CustomizeWidgetStepProps {
  botId: string
  onDone: () => void
}

const COLOR_PRESETS = ['#0F6E56', '#2F5C8A', '#8A3E1D', '#1E1D1B', '#C25A2C']

export function CustomizeWidgetStep({ botId, onDone }: CustomizeWidgetStepProps) {
  const [primaryColor, setPrimaryColor] = useState('#0F6E56')
  const [position, setPosition] = useState<WidgetPosition>('bottom-right')
  const [greeting, setGreeting] = useState('Questions? Ask away.')
  const [saving, setSaving] = useState(false)

  async function handleContinue() {
    setSaving(true)
    const bot = await botService.getBotById(botId)
    if (bot) {
      await botService.updateBot(botId, {
        widgetConfig: { ...bot.widgetConfig, primaryColor, position, greeting },
      })
    }
    onDone()
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center">
        <p className="text-page-title font-medium text-ink-primary">Customize your widget</p>
        <p className="mt-2 text-body text-ink-secondary">This is what your visitors will see.</p>
      </div>

      <div className="mt-8">
        <SplitPreviewLayout
          previewLabel="Live preview"
          form={
            <>
              <div className="space-y-1.5">
                <Label>Primary color</Label>
                <div className="flex items-center gap-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setPrimaryColor(color)}
                      aria-label={`Use color ${color}`}
                      className={cn(
                        'h-8 w-8 rounded-full border-2',
                        primaryColor === color ? 'border-ink-primary' : 'border-transparent',
                        focusRing,
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-28 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Launcher position</Label>
                <div className="flex gap-2">
                  {(['bottom-right', 'bottom-left'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPosition(p)}
                      className={cn(
                        'rounded-md border px-3 py-1.5 text-meta',
                        position === p ? 'border-ink-primary bg-surface-sunken text-ink-primary' : 'border-hairline text-ink-secondary',
                        focusRing,
                      )}
                    >
                      {p === 'bottom-right' ? 'Bottom right' : 'Bottom left'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="widget-greeting">Greeting message</Label>
                <Input id="widget-greeting" value={greeting} onChange={(e) => setGreeting(e.target.value)} />
              </div>
            </>
          }
          preview={<WidgetPreview key={`${primaryColor}-${position}-${greeting}`} config={{ primaryColor, position, greeting }} />}
        />
      </div>

      <Button size="lg" className="mx-auto mt-8 block w-full max-w-lg" onClick={handleContinue} disabled={saving}>
        {saving ? 'Saving…' : 'Continue'}
      </Button>
    </div>
  )
}
