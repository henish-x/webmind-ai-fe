import type { ColumnDef } from '@tanstack/react-table'
import { CreditCard, Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { DataTable } from '@/components/DataTable'
import { billingService } from '@/data/services'
import { PLAN_CATALOG } from '@/data/services/billingService'
import type { Invoice, PaymentMethod, Tenant } from '@/data/types'
import { exportToCsv } from '@/lib/csv'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { PageContainer } from '@/shell/PageContainer'
import { useAuthStore } from '@/state/useAuthStore'
import { PlanComparisonModal } from './PlanComparisonModal'
import { UsageBar } from './UsageBar'

const STATUS_STYLE: Record<Invoice['status'], string> = {
  paid: 'text-success',
  due: 'text-warning',
  failed: 'text-danger',
}

export function BillingPage() {
  const session = useAuthStore((s) => s.session)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [planModalOpen, setPlanModalOpen] = useState(false)

  useEffect(() => {
    if (!session) return
    Promise.all([
      billingService.getTenant(session.tenantId),
      billingService.getInvoices(session.tenantId),
      billingService.getPaymentMethods(session.tenantId),
    ]).then(([t, inv, pm]) => {
      setTenant(t)
      setInvoices(inv)
      setPaymentMethods(pm)
      setLoading(false)
    })
  }, [session])

  const columns: ColumnDef<Invoice, unknown>[] = [
    { accessorKey: 'periodLabel', header: 'Period', cell: ({ row }) => <span className="text-ink-primary">{row.original.periodLabel}</span> },
    { accessorKey: 'issuedAt', header: 'Date', cell: ({ row }) => <span className="text-meta text-ink-secondary">{formatDate(row.original.issuedAt)}</span> },
    { accessorKey: 'amount', header: 'Amount', cell: ({ row }) => <span className="text-meta text-ink-secondary">{formatCurrency(row.original.amount, row.original.currency)}</span> },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <span className={cn('text-meta font-medium capitalize', STATUS_STYLE[row.original.status])}>{row.original.status}</span>,
    },
  ]

  if (loading || !tenant) return <PageContainer><p className="text-body text-ink-secondary">Loading…</p></PageContainer>

  const plan = PLAN_CATALOG[tenant.plan]

  return (
    <PageContainer className="space-y-6">
      <p className="text-page-title font-medium text-ink-primary">Billing &amp; subscription</p>

      <div className="rounded-lg border border-hairline bg-surface-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-card-title font-medium text-ink-primary">{plan.name} plan</p>
            <p className="mt-1 text-meta text-ink-secondary">
              {formatCurrency(plan.price)}/mo · renews {formatDate(tenant.billingCycleEnd)}
            </p>
          </div>
          <Button variant="secondary" onClick={() => setPlanModalOpen(true)}>
            Change plan
          </Button>
        </div>
        <div className="mt-5">
          <UsageBar used={tenant.conversationsUsed} limit={tenant.conversationLimit} />
        </div>
      </div>

      <div className="rounded-lg border border-hairline bg-surface-card p-5">
        <p className="mb-2 text-card-title font-medium text-ink-primary">Payment method</p>
        {paymentMethods.map((pm) => (
          <div key={pm.id} className="flex items-center gap-3 text-meta text-ink-secondary">
            <CreditCard className="h-4 w-4 text-ink-muted" strokeWidth={1.5} />
            <span className="capitalize">{pm.brand}</span> ending {pm.last4} — expires {pm.expiry}
          </div>
        ))}
        <Button variant="ghost" size="sm" className="mt-3">
          Update payment method
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-card-title font-medium text-ink-primary">Invoice history</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              exportToCsv(
                'invoices.csv',
                ['Period', 'Date', 'Amount', 'Status'],
                invoices.map((i) => [i.periodLabel, formatDate(i.issuedAt), formatCurrency(i.amount, i.currency), i.status]),
              )
            }
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
        <DataTable columns={columns} data={invoices} />
      </div>

      <PlanComparisonModal open={planModalOpen} onOpenChange={setPlanModalOpen} tenant={tenant} onChanged={setTenant} />
    </PageContainer>
  )
}
