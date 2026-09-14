import { PLAN_CATALOG } from '@/data/services/billingService'
import type { PlanTier } from '@/data/types'

export interface MarketingPlan {
  tier: PlanTier
  displayName: string
  price: number
  conversationLimit: number
  features: string[]
  ctaLabel: string
  emphasized: boolean
}

/** Same catalog the dashboard's Billing page reads from — one source of truth for pricing. */
export const MARKETING_PLANS: MarketingPlan[] = [
  { tier: 'starter', displayName: 'Starter', ctaLabel: 'Start free trial', emphasized: false, ...PLAN_CATALOG.starter },
  { tier: 'growth', displayName: 'Growth', ctaLabel: 'Start free trial', emphasized: true, ...PLAN_CATALOG.growth },
  { tier: 'scale', displayName: 'Pro / Agency', ctaLabel: 'Talk to sales', emphasized: false, ...PLAN_CATALOG.scale },
]
