export type BotStatus = 'draft' | 'crawling' | 'active' | 'paused'
export type Tone = 'professional' | 'friendly' | 'concise'
export type WidgetPosition = 'bottom-right' | 'bottom-left'
export type NotificationChannel = 'slack' | 'email' | 'whatsapp'
export type CaptureField = 'name' | 'email' | 'phone' | string

export interface QualificationQuestion {
  id: string
  label: string
  order: number
}

export interface KeywordRule {
  id: string
  keyword: string
  lane: 'support' | 'sales'
  active: boolean
}

export interface SupportLaneConfig {
  confidenceThreshold: number // 0-100
  maxTurnsBeforeEscalation: number
  escalateOnThumbsDown: boolean
  escalationKeywords: string[]
  connectedHelpdeskIntegrationId: string | null
}

export interface SalesLaneConfig {
  captureFields: CaptureField[]
  qualificationQuestions: QualificationQuestion[]
  connectedCrmIntegrationId: string | null
  notificationChannel: NotificationChannel
  schedulingLink: string | null
}

export interface Bot {
  id: string
  tenantId: string
  name: string
  domains: string[]
  status: BotStatus
  lanesEnabled: ('support' | 'sales')[]
  persona: {
    greeting: string
    tone: Tone
    languageAutoDetect: boolean
  }
  supportLane: SupportLaneConfig
  salesLane: SalesLaneConfig
  fallback: {
    lowConfidenceMessage: string
    humanTriggerPhrases: string[]
  }
  keywordRules: KeywordRule[]
  guardrails: {
    topicAllowList: string[]
    topicDenyList: string[]
    rateLimitPerVisitorPerMin: number
    rateLimitPerTenantPerMin: number
  }
  dataRetentionDays: number
  piiMaskingEnabled: boolean
  widgetConfig: {
    primaryColor: string
    position: WidgetPosition
    avatarUrl: string | null
    greeting: string
    size: 'compact' | 'standard'
    domainAllowList: string[]
  }
  onboardingCompletedAt: string | null
  createdAt: string
}
