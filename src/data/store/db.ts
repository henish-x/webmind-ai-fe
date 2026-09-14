import type {
  ApiKey,
  Bot,
  Chunk,
  Conversation,
  Integration,
  InjectionIncident,
  Invoice,
  Lead,
  Message,
  PaymentMethod,
  Source,
  TeamMember,
  Tenant,
  Ticket,
} from '../types'
import { readJson, writeJson } from './localStorageAdapter'

export interface Database {
  tenants: Tenant[]
  bots: Bot[]
  sources: Source[]
  chunks: Chunk[]
  conversations: Conversation[]
  messages: Message[]
  leads: Lead[]
  tickets: Ticket[]
  integrations: Integration[]
  teamMembers: TeamMember[]
  apiKeys: ApiKey[]
  invoices: Invoice[]
  paymentMethods: PaymentMethod[]
  injectionIncidents: InjectionIncident[]
}

const DB_KEY = 'webmind_db'
export const DB_VERSION = 1

export function emptyDatabase(): Database {
  return {
    tenants: [],
    bots: [],
    sources: [],
    chunks: [],
    conversations: [],
    messages: [],
    leads: [],
    tickets: [],
    integrations: [],
    teamMembers: [],
    apiKeys: [],
    invoices: [],
    paymentMethods: [],
    injectionIncidents: [],
  }
}

let db: Database = readJson<Database>(DB_KEY) ?? emptyDatabase()

export function getDb(): Database {
  return db
}

export function persist(): void {
  writeJson(DB_KEY, db)
}

export function replaceDb(next: Database): void {
  db = next
  persist()
}

export function isDbEmpty(): boolean {
  return db.tenants.length === 0
}

/** Simulates real async network latency so loading states are honestly exercised in the UI. */
export function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export function genId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}
