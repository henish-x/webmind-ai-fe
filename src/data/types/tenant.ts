export type PlanTier = 'starter' | 'growth' | 'scale'

export interface Tenant {
  id: string
  name: string
  plan: PlanTier
  conversationLimit: number
  conversationsUsed: number
  billingCycleStart: string
  billingCycleEnd: string
  createdAt: string
}

export interface Invoice {
  id: string
  tenantId: string
  amount: number
  currency: string
  status: 'paid' | 'due' | 'failed'
  issuedAt: string
  periodLabel: string
}

export interface PaymentMethod {
  id: string
  tenantId: string
  brand: 'visa' | 'mastercard' | 'amex'
  last4: string
  expiry: string
  isDefault: boolean
}
