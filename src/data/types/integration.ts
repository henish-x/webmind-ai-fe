export type IntegrationCategory = 'crm' | 'helpdesk' | 'notifications' | 'scheduling' | 'automation' | 'analytics'

export interface Integration {
  id: string
  name: string
  category: IntegrationCategory
  description: string
  connected: boolean
  connectedAt: string | null
  comingSoon: boolean
}
