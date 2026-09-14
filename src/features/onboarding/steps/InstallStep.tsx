import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn, focusRing } from '@/lib/utils'

export interface InstallStepProps {
  botId: string
  onDone: () => void
}

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

const FRAMEWORK_NOTES: Record<string, string> = {
  HTML: 'Paste this snippet right before the closing </body> tag.',
  WordPress: 'Add this via Appearance → Theme File Editor → footer.php, or a header/footer plugin.',
  Shopify: 'Add this to theme.liquid, just before </body>, under Online Store → Themes → Edit code.',
  Webflow: 'Paste this into Project Settings → Custom Code → Footer Code.',
}

function CodeBlock({ botId }: { botId: string }) {
  const [copied, setCopied] = useState(false)
  const snippet = SNIPPET(botId)

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-hairline bg-ink-primary">
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          'absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-surface-card/10 px-2 py-1 text-caption text-surface-page hover:bg-surface-card/20',
          focusRing,
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="overflow-x-auto p-4 pr-20 font-mono text-meta text-surface-page">
        <code>{snippet}</code>
      </pre>
    </div>
  )
}

export function InstallStep({ botId, onDone }: InstallStepProps) {
  const [devEmail, setDevEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <p className="text-page-title font-medium text-ink-primary">Install your widget</p>
        <p className="mt-2 text-body text-ink-secondary">Add this snippet to your site — it takes under a minute.</p>
      </div>

      <Tabs defaultValue="HTML" className="mt-8">
        <TabsList>
          {Object.keys(FRAMEWORK_NOTES).map((key) => (
            <TabsTrigger key={key} value={key}>
              {key}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(FRAMEWORK_NOTES).map(([key, note]) => (
          <TabsContent key={key} value={key} className="space-y-3">
            <p className="text-meta text-ink-secondary">{note}</p>
            <CodeBlock botId={botId} />
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 rounded-lg border border-hairline bg-surface-card p-4">
        <Label htmlFor="dev-email">Send to my developer</Label>
        <div className="mt-1.5 flex gap-2">
          <Input
            id="dev-email"
            type="email"
            placeholder="dev@yourcompany.com"
            value={devEmail}
            onChange={(e) => setDevEmail(e.target.value)}
          />
          <Button
            variant="secondary"
            disabled={!devEmail.includes('@')}
            onClick={() => setSent(true)}
          >
            {sent ? 'Sent' : 'Send'}
          </Button>
        </div>
      </div>

      <Button size="lg" className="mt-8 w-full" onClick={onDone}>
        Continue
      </Button>
    </div>
  )
}
