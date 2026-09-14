import { create } from 'zustand'
import { seedIfEmpty } from '@/data/seed'

const STORAGE_KEY = 'webmind_session'

export interface Session {
  userId: string
  name: string
  email: string
  tenantId: string
}

interface AuthState {
  session: Session | null
  login: (email: string, _password: string) => Promise<Session>
  signup: (name: string, email: string, _password: string) => Promise<Session>
  logout: () => void
}

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function writeSession(session: Session | null) {
  if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  else localStorage.removeItem(STORAGE_KEY)
}

export const useAuthStore = create<AuthState>((set) => ({
  session: readSession(),
  login: async (email) => {
    seedIfEmpty()
    const session: Session = { userId: 'user_1', name: 'Priya Nair', email, tenantId: 'tenant_meridian' }
    await new Promise((r) => setTimeout(r, 400))
    writeSession(session)
    set({ session })
    return session
  },
  signup: async (name, email) => {
    seedIfEmpty()
    const session: Session = { userId: 'user_1', name, email, tenantId: 'tenant_meridian' }
    await new Promise((r) => setTimeout(r, 400))
    writeSession(session)
    set({ session })
    return session
  },
  logout: () => {
    writeSession(null)
    set({ session: null })
  },
}))
