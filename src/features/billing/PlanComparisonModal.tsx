import { Check } from 'lucide-react'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { toast } from '@/components/Toast'
import { billingService } from '@/data/services'
import { PLAN_CATALOG } from '@/data/services/billingService'
import type { PlanTier, Tenant } from '@/data/types'
import { cn } from '@/lib/utils'

const TIERS: PlanTier[] = ['starter', 'growth', 'scale']

export function PlanComparisonModal({
  open,
  onOpenChange,
  tenant,
  onChanged,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: Tenant
  onChanged: (tenant: Tenant) => void
}) {
  async function handleSelect(plan: PlanTier) {
    const next = await billingService.changePlan(tenant.id, plan)
    onChanged(next)
    onOpenChange(false)
    toast({ title: 'Plan updated', description: `You're now on the ${PLAN_CATALOG[plan].name} plan.`, variant: 'success' })
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Change plan" description="Upgrade or downgrade any time — no dark patterns, downgrades stay one click away." className="max-w-2xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TIERS.map((tier) => {
          const plan = PLAN_CATALOG[tier]
          const isCurrent = tenant.plan === tier
          return (
            <div key={tier} className={cn('flex flex-col rounded-lg border p-4', isCurrent ? 'border-ink-primary' : 'border-hairline')}>
              <p className="text-card-title font-medium text-ink-primary">{plan.name}</p>
              <p className="mt-1 text-page-title font-medium text-ink-primary">
                ${plan.price}
                <span className="text-meta font-normal text-ink-muted">/mo</span>
              </p>
              <p className="mt-1 text-caption text-ink-muted">{plan.conversationLimit.toLocaleString()} conversations/mo</p>
              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-meta text-ink-secondary">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={isCurrent ? 'secondary' : 'primary'}
                className="mt-4 w-full"
                disabled={isCurrent}
                onClick={() => handleSelect(tier)}
              >
                {isCurrent ? 'Current plan' : 'Select'}
              </Button>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
