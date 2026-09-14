import type { Invoice, PaymentMethod, PlanTier, Tenant } from '../types'
import { delay, getDb, persist } from '../store/db'

export const PLAN_CATALOG: Record<PlanTier, { name: string; price: number; conversationLimit: number; features: string[] }> = {
  starter: {
    name: 'Starter',
    price: 49,
    conversationLimit: 500,
    features: ['1 chatbot', 'Support + Sales lanes', 'Email notifications', 'Community support'],
  },
  growth: {
    name: 'Growth',
    price: 149,
    conversationLimit: 2000,
    features: ['3 chatbots', 'CRM + helpdesk integrations', 'Slack + WhatsApp notifications', 'Priority support'],
  },
  scale: {
    name: 'Scale',
    price: 399,
    conversationLimit: 8000,
    features: ['Unlimited chatbots', 'All integrations', 'Custom guardrail rules', 'Dedicated support'],
  },
}

export async function getTenant(tenantId: string): Promise<Tenant | null> {
  return delay(getDb().tenants.find((t) => t.id === tenantId) ?? null)
}

export async function changePlan(tenantId: string, plan: PlanTier): Promise<Tenant> {
  const db = getDb()
  const tenant = db.tenants.find((t) => t.id === tenantId)
  if (!tenant) throw new Error(`Tenant ${tenantId} not found`)
  tenant.plan = plan
  tenant.conversationLimit = PLAN_CATALOG[plan].conversationLimit
  persist()
  return delay(tenant, 500)
}

export async function getInvoices(tenantId: string): Promise<Invoice[]> {
  return delay(getDb().invoices.filter((i) => i.tenantId === tenantId))
}

export async function getPaymentMethods(tenantId: string): Promise<PaymentMethod[]> {
  return delay(getDb().paymentMethods.filter((p) => p.tenantId === tenantId))
}
