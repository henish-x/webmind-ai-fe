import { emptyDatabase, getDb, isDbEmpty, replaceDb } from '../store/db'
import {
  buildApiKeys,
  buildBots,
  buildInjectionIncidents,
  buildIntegrations,
  buildInvoices,
  buildPaymentMethods,
  buildTeamMembers,
  buildTenant,
  seedSourcesAndChunks,
} from './seedTenant'
import { seedConversationsForBot } from './seedConversations'

const MERIDIAN_PAGES = ['/', '/pricing', '/floor-plans', '/possession-timeline', '/amenities', '/faq', '/contact']
const FLOWLY_PAGES = ['/', '/docs/getting-started', '/docs/integrations', '/pricing', '/faq']

/** Seeds a realistic dataset into the mock db exactly once. Safe to call on every app boot. */
export function seedIfEmpty(): void {
  if (!isDbEmpty()) return

  const db = emptyDatabase()
  const tenant = buildTenant()
  const bots = buildBots(tenant.id)
  const { sources, chunks } = seedSourcesAndChunks(bots)

  db.tenants.push(tenant)
  db.bots.push(...bots)
  db.sources.push(...sources)
  db.chunks.push(...chunks)
  db.integrations.push(...buildIntegrations())
  db.teamMembers.push(...buildTeamMembers(tenant.id))
  db.apiKeys.push(...buildApiKeys(tenant.id))
  db.invoices.push(...buildInvoices(tenant.id))
  db.paymentMethods.push(...buildPaymentMethods(tenant.id))
  db.injectionIncidents.push(...buildInjectionIncidents(bots[0].id), ...buildInjectionIncidents(bots[1].id))

  const meridianData = seedConversationsForBot(bots[0], MERIDIAN_PAGES)
  const flowlyData = seedConversationsForBot(bots[1], FLOWLY_PAGES)
  for (const data of [meridianData, flowlyData]) {
    db.conversations.push(...data.conversations)
    db.messages.push(...data.messages)
    db.leads.push(...data.leads)
    db.tickets.push(...data.tickets)
  }

  replaceDb(db)
}

export function resetAndReseed(): void {
  replaceDb(emptyDatabase())
  seedIfEmpty()
}

export { getDb }
