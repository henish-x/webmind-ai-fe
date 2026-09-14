import {
  BarChart3,
  Bot,
  CreditCard,
  Database,
  type LucideIcon,
  Inbox,
  LayoutDashboard,
  Paintbrush,
  Plug,
  Settings,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Builder', href: '/builder', icon: Bot },
  { label: 'Knowledge Base', href: '/knowledge-base', icon: Database },
  { label: 'Inbox', href: '/inbox', icon: Inbox },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Customize', href: '/customize', icon: Paintbrush },
  { label: 'Integrations', href: '/integrations', icon: Plug },
  { label: 'Billing', href: '/billing', icon: CreditCard },
  { label: 'Settings', href: '/settings', icon: Settings },
]
