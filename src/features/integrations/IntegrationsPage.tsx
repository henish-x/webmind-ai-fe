import {
  BarChart3,
  Calendar,
  LifeBuoy,
  type LucideIcon,
  MessagesSquare,
  Users,
  Workflow,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { toast } from '@/components/Toast'
import { integrationService } from '@/data/services'
import type { Integration, IntegrationCategory } from '@/data/types'
import { cn } from '@/lib/utils'
import { PageContainer } from '@/shell/PageContainer'

const CATEGORY_META: Record<IntegrationCategory, { label: string; icon: LucideIcon }> = {
  crm: { label: 'CRM', icon: Users },
  helpdesk: { label: 'Helpdesk', icon: LifeBuoy },
  notifications: { label: 'Notifications', icon: MessagesSquare },
  scheduling: { label: 'Scheduling', icon: Calendar },
  automation: { label: 'Automation', icon: Workflow },
  analytics: { label: 'Analytics export', icon: BarChart3 },
}

const CATEGORY_ORDER: IntegrationCategory[] = ['crm', 'helpdesk', 'notifications', 'scheduling', 'automation', 'analytics']

function IntegrationCard({ integration, onToggle }: { integration: Integration; onToggle: (id: string, connect: boolean) => void }) {
  const Icon = CATEGORY_META[integration.category].icon
  return (
    <div className="flex flex-col rounded-lg border border-hairline bg-surface-card p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-sunken">
          <Icon className="h-4 w-4 text-ink-secondary" strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-meta font-medium text-ink-primary">{integration.name}</p>
          <span className="flex items-center gap-1.5 text-caption text-ink-muted">
            <span className={cn('h-1.5 w-1.5 rounded-full', integration.connected ? 'bg-success' : 'bg-hairline-strong')} />
            {integration.connected ? 'Connected' : 'Not connected'}
          </span>
        </div>
      </div>
      <p className="mt-3 flex-1 text-caption text-ink-secondary">{integration.description}</p>
      <div className="mt-4">
        {integration.comingSoon ? (
          <Button size="sm" variant="secondary" disabled className="w-full">
            Coming soon
          </Button>
        ) : integration.connected ? (
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" className="flex-1">
              Configure
            </Button>
            <Button size="sm" variant="ghost" className="text-danger" onClick={() => onToggle(integration.id, false)}>
              Disconnect
            </Button>
          </div>
        ) : (
          <Button size="sm" className="w-full" onClick={() => onToggle(integration.id, true)}>
            Connect
          </Button>
        )}
      </div>
    </div>
  )
}

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)

  async function reload() {
    setLoading(true)
    setIntegrations(await integrationService.getIntegrations())
    setLoading(false)
  }

  useEffect(() => {
    reload()
  }, [])

  async function handleToggle(id: string, connect: boolean) {
    const integration = integrations.find((i) => i.id === id)
    if (connect) await integrationService.connectIntegration(id)
    else await integrationService.disconnectIntegration(id)
    reload()
    toast({ title: connect ? 'Integration connected' : 'Integration disconnected', description: integration?.name, variant: 'success' })
  }

  if (loading) return <PageContainer><p className="text-body text-ink-secondary">Loading…</p></PageContainer>

  return (
    <PageContainer className="space-y-8">
      <p className="text-page-title font-medium text-ink-primary">Integrations</p>

      {CATEGORY_ORDER.map((category) => {
        const items = integrations.filter((i) => i.category === category)
        if (items.length === 0) return null
        return (
          <div key={category}>
            <p className="mb-3 text-meta font-medium text-ink-secondary">{CATEGORY_META[category].label}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} onToggle={handleToggle} />
              ))}
            </div>
          </div>
        )
      })}
    </PageContainer>
  )
}
