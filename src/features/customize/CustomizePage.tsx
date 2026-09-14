import { Check, CheckCircle2, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { SplitPreviewLayout } from '@/components/SplitPreviewLayout'
import { toast } from '@/components/Toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCurrentBot } from '@/features/builder/useCurrentBot'
import type { WidgetPosition } from '@/data/types'
import { cn, focusRing } from '@/lib/utils'
import { PageContainer } from '@/shell/PageContainer'
import { WidgetPreview } from './WidgetPreview'

const COLOR_PRESETS = ['#0F6E56', '#2F5C8A', '#8A3E1D', '#1E1D1B', '#C25A2C']
const SNIPPET = (botId: string) =>
  `<script>
  (function (w, d) {
    w.WebMindConfig = { botId: "${botId}" };
    var s = d.createElement("script");
    s.src = "https://cdn.webmind.ai/widget.js";
    s.async = true;
    d.head.appendChild(s);
  })(window, document);
</script>`

const FRAMEWORKS = ['HTML', 'WordPress', 'Shopify', 'Webflow', 'React']

export function CustomizePage() {
  const { bot, loading, save } = useCurrentBot()
  const [primaryColor, setPrimaryColor] = useState('#0F6E56')
  const [position, setPosition] = useState<WidgetPosition>('bottom-right')
  const [greeting, setGreeting] = useState('')
  const [size, setSize] = useState<'compact' | 'standard'>('standard')
  const [domainAllowList, setDomainAllowList] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState<boolean | null>(null)

  useEffect(() => {
    if (!bot) return
    setPrimaryColor(bot.widgetConfig.primaryColor)
    setPosition(bot.widgetConfig.position)
    setGreeting(bot.widgetConfig.greeting)
    setSize(bot.widgetConfig.size)
    setDomainAllowList(bot.widgetConfig.domainAllowList.join(', '))
  }, [bot])

  async function handleSave() {
    setSaving(true)
    await save({
      widgetConfig: {
        primaryColor,
        position,
        greeting,
        size,
        avatarUrl: bot?.widgetConfig.avatarUrl ?? null,
        domainAllowList: domainAllowList.split(',').map((d) => d.trim()).filter(Boolean),
      },
    })
    setSaving(false)
    toast({ title: 'Widget updated', variant: 'success' })
  }

  async function handleCopy() {
    if (!bot) return
    await navigator.clipboard.writeText(SNIPPET(bot.id))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleVerify() {
    setVerifying(true)
    setVerified(null)
    await new Promise((r) => setTimeout(r, 900))
    setVerified(bot?.status === 'active')
    setVerifying(false)
  }

  if (loading || !bot) return <PageContainer><p className="text-body text-ink-secondary">Loading…</p></PageContainer>

  return (
    <PageContainer className="space-y-10">
      <p className="text-page-title font-medium text-ink-primary">Customize</p>

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
                    className={cn('h-8 w-8 rounded-full border-2', primaryColor === color ? 'border-ink-primary' : 'border-transparent', focusRing)}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-28 font-mono" />
              </div>
              <p className="text-caption text-ink-secondary">This is the visitor-facing brand color — separate from the dashboard's lane colors.</p>
            </div>

            <div className="space-y-1.5">
              <Label>Launcher position</Label>
              <div className="flex gap-2">
                {(['bottom-right', 'bottom-left'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPosition(p)}
                    className={cn('rounded-md border px-3 py-1.5 text-meta', position === p ? 'border-ink-primary bg-surface-sunken text-ink-primary' : 'border-hairline text-ink-secondary', focusRing)}
                  >
                    {p === 'bottom-right' ? 'Bottom right' : 'Bottom left'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Widget size</Label>
              <div className="flex gap-2">
                {(['standard', 'compact'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn('rounded-md border px-3 py-1.5 text-meta capitalize', size === s ? 'border-ink-primary bg-surface-sunken text-ink-primary' : 'border-hairline text-ink-secondary', focusRing)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="widget-greeting">Greeting message</Label>
              <Input id="widget-greeting" value={greeting} onChange={(e) => setGreeting(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="domain-allowlist">Domain allow-list</Label>
              <Input id="domain-allowlist" value={domainAllowList} onChange={(e) => setDomainAllowList(e.target.value)} placeholder="yoursite.com, www.yoursite.com" />
              <p className="text-caption text-ink-secondary">Only these domains can load the widget.</p>
            </div>

            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </>
        }
        preview={<WidgetPreview key={`${primaryColor}-${position}-${greeting}-${size}`} config={{ primaryColor, position, greeting }} />}
      />

      <div className="space-y-4 border-t border-hairline pt-8">
        <p className="text-card-title font-medium text-ink-primary">Install</p>
        <Tabs defaultValue="HTML">
          <TabsList>
            {FRAMEWORKS.map((f) => (
              <TabsTrigger key={f} value={f}>
                {f}
              </TabsTrigger>
            ))}
          </TabsList>
          {FRAMEWORKS.map((f) => (
            <TabsContent key={f} value={f}>
              <div className="relative overflow-hidden rounded-lg border border-hairline bg-ink-primary">
                <button type="button" onClick={handleCopy} className={cn('absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-surface-card/10 px-2 py-1 text-caption text-surface-page hover:bg-surface-card/20', focusRing)}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <pre className="overflow-x-auto p-4 pr-20 font-mono text-meta text-surface-page">
                  <code>{SNIPPET(bot.id)}</code>
                </pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleVerify} disabled={verifying}>
            {verifying ? 'Verifying…' : 'Verify installation'}
          </Button>
          {verified === true && (
            <span className="flex items-center gap-1.5 text-meta font-medium text-success">
              <CheckCircle2 className="h-4 w-4" /> Widget is live
            </span>
          )}
          {verified === false && <span className="text-meta text-danger">We couldn't detect the widget on your domain yet.</span>}
        </div>
      </div>
    </PageContainer>
  )
}
